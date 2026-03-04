"use client";

import { useState, useEffect } from "react";
import {
  Client,
  RecurrenceType,
  InterventionType,
  EquipmentType,
} from "@/types/domain";

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  weekly: "Hebdomadaire",
  biweekly: "Bi-hebdomadaire",
  monthly: "Mensuel",
  bimonthly: "Bimestriel",
  quarterly: "Trimestriel",
};

const INTERVENTION_LABELS: Record<InterventionType, string> = {
  mowing: "Tonte",
  hedge_trimming: "Taille de haie",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Maintenance",
  emergency: "Urgence",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Supprimer ce client ?")) return;
    await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
    fetchClients();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Clients</h1>
          <button
            onClick={() => {
              setEditingClient(null);
              setIsModalOpen(true);
            }}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            + Nouveau client
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Contrat
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-500">
                      {client.contactPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {client.location.address}
                  </td>
                  <td className="px-6 py-4">
                    {client.contract ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-800">
                        {RECURRENCE_LABELS[client.contract.recurrence]}
                      </span>
                    ) : (
                      <span className="text-gray-400">Ponctuel</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setEditingClient(client);
                        setIsModalOpen(true);
                      }}
                      className="mr-4 text-blue-600 hover:text-blue-800"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            fetchClients();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ClientModal({
  client,
  onClose,
  onSave,
}: {
  client: Client | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: client?.name || "",
    address: client?.location.address || "",
    phone: client?.contactPhone || "",
    email: client?.contactEmail || "",
    notes: client?.notes || "",
    hasContract: !!client?.contract,
    recurrence: client?.contract?.recurrence || "weekly",
    dayOfWeek: client?.contract?.dayOfWeek || 1,
    duration: client?.contract?.durationMinutes || 60,
    interventionType: client?.contract?.interventionType || "mowing",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...(client ? { id: client.id } : {}),
      name: form.name,
      location: {
        lat: client?.location.lat ?? 0,
        lng: client?.location.lng ?? 0,
        address: form.address,
      },
      contactPhone: form.phone,
      contactEmail: form.email,
      notes: form.notes,
      contract: form.hasContract
        ? {
            id: client?.contract?.id ?? `ctr-${Date.now()}`,
            clientId: client?.id ?? `c-${Date.now()}`,
            recurrence: form.recurrence as RecurrenceType,
            dayOfWeek: form.dayOfWeek,
            durationMinutes: form.duration,
            interventionType: form.interventionType as InterventionType,
            requiredEquipment: [] as EquipmentType[],
            weatherConstraints: {
              maxWindSpeed: 30,
              noRainForecast: true,
              minTemperature: 5,
              maxTemperature: 35,
            },
            startDate: new Date(),
            priority: 3,
          }
        : undefined,
    };
    const method = client ? "PUT" : "POST";
    const url = "/api/clients";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    onSave();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">
          {client ? "Modifier" : "Nouveau"} client
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded border px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Adresse"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded border px-3 py-2"
            required
          />
          <div className="flex gap-4">
            <input
              type="tel"
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="flex-1 rounded border px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="flex-1 rounded border px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.hasContract}
              onChange={(e) =>
                setForm({ ...form, hasContract: e.target.checked })
              }
            />
            Contrat d'entretien récurrent
          </label>

          {form.hasContract && (
            <div className="space-y-3 rounded bg-gray-50 p-4">
              <select
                value={form.recurrence}
                onChange={(e) =>
                  setForm({
                    ...form,
                    recurrence: e.target.value as RecurrenceType,
                  })
                }
                className="w-full rounded border px-3 py-2"
              >
                {Object.entries(RECURRENCE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <select
                value={form.interventionType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    interventionType: e.target.value as InterventionType,
                  })
                }
                className="w-full rounded border px-3 py-2"
              >
                {Object.entries(INTERVENTION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border py-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-green-600 py-2 text-white"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
