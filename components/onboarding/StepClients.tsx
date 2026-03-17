"use client";

import { useState } from "react";
import { Plus, Trash2, UserPlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  INTERVENTION_LABELS,
  EQUIPMENT_LABELS,
  RECURRENCE_LABELS,
  DAY_LABELS,
  type ContractFormData,
} from "@/lib/validation/onboarding";
import { CsvImportBlock } from "./CsvImportBlock";
import { CLIENT_COLUMNS, parseClientRow } from "@/lib/import/csv-templates";

interface ClientWithContract {
  id?: string;
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  lat?: number;
  lng?: number;
  contract?: ContractFormData;
}

interface StepClientsProps {
  clients: ClientWithContract[];
  onClientsChange: (clients: ClientWithContract[]) => void;
}

async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { "User-Agent": "OptimTournee/1.0" } }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

const defaultContract: ContractFormData = {
  interventionType: "mowing",
  durationMinutes: 60,
  dayOfWeek: 1,
  recurrence: "weekly",
  requiredEquipment: [],
  priority: 1,
  maxWindSpeed: 50,
  noRainForecast: false,
  minTemperature: -5,
  maxTemperature: 40,
};

export function StepClients({ clients, onClientsChange }: StepClientsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ClientWithContract>({
    name: "",
    address: "",
    contract: { ...defaultContract },
  });
  const [error, setError] = useState<string | null>(null);

  const startAdd = () => {
    setForm({ name: "", address: "", contract: { ...defaultContract } });
    setEditingIndex(null);
    setError(null);
    setShowForm(true);
  };

  const startEdit = (index: number) => {
    setForm({ ...clients[index] });
    setEditingIndex(index);
    setShowForm(true);
  };

  const saveClient = async () => {
    if (!form.name.trim() || !form.address.trim()) return;

    setSaving(true);
    try {
      let { lat, lng } = form;
      if (!lat || !lng) {
        const coords = await geocodeAddress(form.address);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      const clientPayload = {
        name: form.name,
        address: form.address,
        contactPhone: form.contactPhone || null,
        contactEmail: form.contactEmail || null,
        lat: lat ?? 0,
        lng: lng ?? 0,
      };

      let clientId = form.id;

      if (editingIndex !== null && clientId) {
        const res = await fetch("/api/clients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: clientId, ...clientPayload }),
        });
        if (!res.ok) throw new Error("Erreur serveur");
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientPayload),
        });
        if (!res.ok) throw new Error("Erreur serveur");
        const created = await res.json();
        clientId = created.id;
      }

      // Save contract
      if (form.contract && clientId) {
        const contractRes = await fetch(`/api/clients/${clientId}/contract`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form.contract),
        });
        // If conflict (contract already exists), update instead
        if (contractRes.status === 500 && editingIndex !== null) {
          const putRes = await fetch(`/api/clients/${clientId}/contract`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form.contract),
          });
          if (!putRes.ok) throw new Error("Erreur sauvegarde contrat");
        } else if (!contractRes.ok) {
          throw new Error("Erreur création contrat");
        }
      }

      const saved: ClientWithContract = {
        ...form,
        id: clientId,
        lat,
        lng,
      };

      const newClients =
        editingIndex !== null
          ? clients.map((c, i) => (i === editingIndex ? saved : c))
          : [...clients, saved];

      setError(null);
      onClientsChange(newClients);
      setShowForm(false);
      setEditingIndex(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteClient = async (index: number) => {
    const client = clients[index];
    if (client.id) {
      const res = await fetch(`/api/clients?id=${client.id}`, {
        method: "DELETE",
      });
      if (!res.ok) return;
    }
    onClientsChange(clients.filter((_, i) => i !== index));
  };

  const updateContract = (field: keyof ContractFormData, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      contract: prev.contract
        ? { ...prev.contract, [field]: value }
        : undefined,
    }));
  };

  const toggleEquipment = (item: string) => {
    setForm((prev) => {
      if (!prev.contract) return prev;
      const arr = prev.contract.requiredEquipment;
      return {
        ...prev,
        contract: {
          ...prev.contract,
          requiredEquipment: arr.includes(item as never)
            ? arr.filter((v) => v !== item)
            : [...arr, item as never],
        },
      };
    });
  };

  const handleCsvImport = (rows: Record<string, string>[]) => {
    const errors: string[] = [];
    const imported: ClientWithContract[] = [];

    for (let i = 0; i < rows.length; i++) {
      const { data, error } = parseClientRow(rows[i], i);
      if (error) {
        errors.push(error);
        continue;
      }
      if (data) {
        const hasContract =
          data.interventionType && data.durationMinutes && data.recurrence;

        imported.push({
          name: data.name,
          address: data.address,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          contract: hasContract
            ? {
                interventionType:
                  data.interventionType as ContractFormData["interventionType"],
                durationMinutes: data.durationMinutes!,
                dayOfWeek: data.dayOfWeek ?? 1,
                recurrence: data.recurrence as ContractFormData["recurrence"],
                requiredEquipment: [],
                priority: data.priority ?? 1,
                maxWindSpeed: 50,
                noRainForecast: false,
                minTemperature: -5,
                maxTemperature: 40,
              }
            : { ...defaultContract },
        });
      }
    }

    if (imported.length > 0) {
      onClientsChange([...clients, ...imported]);
    }

    return { imported: imported.length, errors };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E07B39] to-[#F5A572]">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Mes clients</h2>
        <p className="mt-2 text-gray-500">
          Ajoutez au moins un client avec son contrat d&apos;intervention
          récurrent.
        </p>
      </div>

      {/* CSV Import */}
      <CsvImportBlock
        columns={CLIENT_COLUMNS}
        templateFilename="optimtournee-clients-template.csv"
        onImport={handleCsvImport}
        entityLabel="clients"
      />

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {clients.map((client, index) => (
            <motion.div
              key={client.id ?? index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-500">{client.address}</p>
                {client.contract && (
                  <p className="mt-1 text-xs text-[#2D5A3D]">
                    {INTERVENTION_LABELS[client.contract.interventionType]}{" "}
                    &middot; {RECURRENCE_LABELS[client.contract.recurrence]}{" "}
                    &middot; {client.contract.durationMinutes} min
                  </p>
                )}
              </div>
              <button
                onClick={() => startEdit(index)}
                className="text-sm font-medium text-[#2D5A3D] hover:underline"
              >
                Modifier
              </button>
              <button
                onClick={() => deleteClient(index)}
                className="rounded-lg p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form */}
      {showForm ? (
        <div className="space-y-4 rounded-xl border border-[#E07B39]/20 bg-white p-6">
          <h3 className="font-semibold text-gray-900">
            {editingIndex !== null ? "Modifier le client" : "Nouveau client"}
          </h3>

          {/* Client info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                placeholder="M. Dupont"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Adresse *
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                placeholder="12 Rue des Lilas, 75001 Paris"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                value={form.contactPhone ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contactPhone: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                placeholder="06 12 34 56 78"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={form.contactEmail ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contactEmail: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                placeholder="client@email.com"
              />
            </div>
          </div>

          {/* Contract section */}
          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Contrat récurrent
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Type d&apos;intervention
                </label>
                <select
                  value={form.contract?.interventionType ?? "mowing"}
                  onChange={(e) =>
                    updateContract("interventionType", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                >
                  {Object.entries(INTERVENTION_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  value={form.contract?.durationMinutes ?? 60}
                  onChange={(e) =>
                    updateContract(
                      "durationMinutes",
                      parseInt(e.target.value) || 15
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                  min={15}
                  step={15}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Jour de la semaine
                </label>
                <select
                  value={form.contract?.dayOfWeek ?? 1}
                  onChange={(e) =>
                    updateContract("dayOfWeek", parseInt(e.target.value))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                >
                  {DAY_LABELS.map((label, i) => (
                    <option key={i} value={i}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Récurrence
                </label>
                <select
                  value={form.contract?.recurrence ?? "weekly"}
                  onChange={(e) => updateContract("recurrence", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                >
                  {Object.entries(RECURRENCE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Priorité (1-5)
                </label>
                <input
                  type="range"
                  value={form.contract?.priority ?? 1}
                  onChange={(e) =>
                    updateContract("priority", parseInt(e.target.value))
                  }
                  className="w-full accent-[#2D5A3D]"
                  min={1}
                  max={5}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Basse</span>
                  <span>{form.contract?.priority ?? 1}</span>
                  <span>Haute</span>
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.contract?.noRainForecast ?? false}
                    onChange={(e) =>
                      updateContract("noRainForecast", e.target.checked)
                    }
                    className="rounded accent-[#2D5A3D]"
                  />
                  Pas de pluie requise
                </label>
              </div>
            </div>

            {/* Equipment required */}
            <div className="mt-3">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Équipement requis
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleEquipment(key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      form.contract?.requiredEquipment.includes(key as never)
                        ? "bg-[#E07B39] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
              }}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={saveClient}
              disabled={saving || !form.name.trim() || !form.address.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E07B39] to-[#F5A572] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingIndex !== null ? "Enregistrer" : "Créer le client"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-500 transition-all hover:border-[#E07B39] hover:text-[#E07B39]"
        >
          <Plus className="h-5 w-5" />
          Ajouter un client
        </button>
      )}
    </div>
  );
}
