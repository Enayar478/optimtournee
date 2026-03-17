"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "mowing", label: "Tonte" },
  { value: "hedge_trimming", label: "Taille de haies" },
  { value: "pruning", label: "Élagage" },
  { value: "weeding", label: "Désherbage" },
  { value: "planting", label: "Plantation" },
  { value: "maintenance", label: "Entretien" },
  { value: "emergency", label: "Urgence" },
];

interface ClientOption {
  id: string;
  name: string;
}

interface TeamOption {
  id: string;
  name: string;
  color: string;
}

interface Props {
  open: boolean;
  defaultDate?: string;
  defaultTime?: string;
  teams: TeamOption[];
  scheduleId: string;
  onClose: () => void;
  onAdded: () => void;
}

export function AddInterventionModal({
  open,
  defaultDate,
  defaultTime,
  teams,
  scheduleId,
  onClose,
  onAdded,
}: Props) {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientId, setClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [date, setDate] = useState(
    defaultDate ?? new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState(defaultTime ?? "09:00");
  const [type, setType] = useState("mowing");
  const [duration, setDuration] = useState(60);
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetch("/api/clients")
        .then((r) => r.json())
        .then((data) => setClients(Array.isArray(data) ? data : []))
        .catch(() => setClients([]));
    }
  }, [open]);

  useEffect(() => {
    if (defaultDate) setDate(defaultDate);
    if (defaultTime) setTime(defaultTime);
  }, [defaultDate, defaultTime]);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!clientId || !teamId) {
      setError("Client et équipe requis");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/schedules/${scheduleId}/interventions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          scheduledDate: date,
          estimatedStartTime: time,
          interventionType: type,
          estimatedDurationMinutes: duration,
          assignedTeamId: teamId,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error ?? "Erreur ajout");
      }

      onAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Ajouter une intervention
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Client search */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Client
              </label>
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Rechercher un client..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
              />
              {clientSearch && filteredClients.length > 0 && !clientId && (
                <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                  {filteredClients.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setClientId(c.id);
                        setClientSearch(c.name);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Heure
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Durée (min)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={15}
                  max={480}
                  step={15}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Équipe
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
                placeholder="Notes optionnelles..."
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading || !clientId}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D5A3D] px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              Ajouter l&apos;intervention
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
