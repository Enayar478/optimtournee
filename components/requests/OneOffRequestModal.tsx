"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import {
  createRequestSchema,
  type CreateRequestFormData,
} from "@/lib/validation/one-off-request";
import { INTERVENTION_LABELS } from "@/lib/validation/onboarding";

interface ClientOption {
  id: string;
  name: string;
  address: string;
}

interface OneOffRequestData {
  id: string;
  clientId: string;
  interventionType: string;
  description: string;
  durationEstimate: number;
  priority: number;
  preferredDateStart?: string | null;
  preferredDateEnd?: string | null;
}

interface OneOffRequestModalProps {
  request?: OneOffRequestData | null;
  onClose: () => void;
  onSave: () => void;
}

const INTERVENTION_TYPES = [
  "mowing",
  "hedge_trimming",
  "pruning",
  "weeding",
  "planting",
  "maintenance",
  "emergency",
] as const;

function formatDateForInput(dateStr?: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

export function OneOffRequestModal({
  request,
  onClose,
  onSave,
}: OneOffRequestModalProps) {
  const toast = useToast();
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CreateRequestFormData>({
    clientId: request?.clientId ?? "",
    interventionType: (request?.interventionType as CreateRequestFormData["interventionType"]) ?? "mowing",
    description: request?.description ?? "",
    durationEstimate: request?.durationEstimate ?? 60,
    priority: request?.priority ?? 1,
    preferredDateStart: formatDateForInput(request?.preferredDateStart),
    preferredDateEnd: formatDateForInput(request?.preferredDateEnd),
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        if (res.ok) {
          const data = await res.json();
          setClients(data);
          if (request?.clientId) {
            const found = data.find(
              (c: ClientOption) => c.id === request.clientId
            );
            if (found) setClientSearch(found.name);
          }
        }
      } catch {
        console.error("Failed to fetch clients");
      }
    };
    fetchClients();
  }, [request?.clientId]);

  const filteredClients = useMemo(() => {
    const search = clientSearch.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.address.toLowerCase().includes(search)
    );
  }, [clients, clientSearch]);

  const updateField = <K extends keyof CreateRequestFormData>(
    field: K,
    value: CreateRequestFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const selectClient = (client: ClientOption) => {
    updateField("clientId", client.id);
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = createRequestSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...parsed.data,
        preferredDateStart: parsed.data.preferredDateStart || undefined,
        preferredDateEnd: parsed.data.preferredDateEnd || undefined,
      };

      if (request) {
        const res = await fetch(`/api/one-off-requests/${request.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: payload.description,
            preferredDateStart: payload.preferredDateStart,
            preferredDateEnd: payload.preferredDateEnd,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Erreur serveur");
        }
        toast.success("Demande mise a jour");
      } else {
        const res = await fetch("/api/one-off-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Erreur serveur");
        }
        toast.success("Demande creee");
      }
      onSave();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {request ? "Modifier la demande" : "Nouvelle demande"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client selector */}
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Client *
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                    if (!e.target.value) updateField("clientId", "");
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                  placeholder="Rechercher un client..."
                />
              </div>
              {showClientDropdown && filteredClients.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => selectClient(client)}
                      className="flex w-full flex-col px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <span className="text-sm font-medium">{client.name}</span>
                      <span className="text-xs text-gray-500">
                        {client.address}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {errors.clientId && (
                <p className="mt-1 text-sm text-red-500">{errors.clientId}</p>
              )}
            </div>

            {/* Intervention type */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Type d&apos;intervention *
              </label>
              <select
                value={form.interventionType}
                onChange={(e) =>
                  updateField(
                    "interventionType",
                    e.target.value as CreateRequestFormData["interventionType"]
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
              >
                {INTERVENTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {INTERVENTION_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                placeholder="Decrivez l'intervention souhaitee..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Duration + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Duree estimee (min) *
                </label>
                <input
                  type="number"
                  value={form.durationEstimate}
                  onChange={(e) =>
                    updateField("durationEstimate", Number(e.target.value))
                  }
                  min={15}
                  max={480}
                  step={15}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                />
                {errors.durationEstimate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.durationEstimate}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Priorite (1-5)
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    updateField("priority", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                >
                  {[1, 2, 3, 4, 5].map((p) => (
                    <option key={p} value={p}>
                      {p} {p === 1 ? "(basse)" : p === 5 ? "(urgente)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date souhaitee (debut)
                </label>
                <input
                  type="date"
                  value={form.preferredDateStart ?? ""}
                  onChange={(e) =>
                    updateField("preferredDateStart", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date souhaitee (fin)
                </label>
                <input
                  type="date"
                  value={form.preferredDateEnd ?? ""}
                  onChange={(e) =>
                    updateField("preferredDateEnd", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-4 py-3 font-medium text-white disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {request ? "Enregistrer" : "Creer"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
