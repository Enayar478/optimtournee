"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  MapPin,
  Phone,
  User,
  Truck,
  Cloud,
  Thermometer,
  Wind,
  Loader2,
  Trash2,
} from "lucide-react";
import type { InterventionDetail } from "@/lib/hooks/usePlanning";

const STATUS_OPTIONS = [
  { value: "planned", label: "Planifié", color: "bg-blue-100 text-blue-700" },
  {
    value: "in_progress",
    label: "En cours",
    color: "bg-amber-100 text-amber-700",
  },
  {
    value: "completed",
    label: "Terminé",
    color: "bg-green-100 text-green-700",
  },
  { value: "cancelled", label: "Annulé", color: "bg-red-100 text-red-700" },
  { value: "postponed", label: "Reporté", color: "bg-gray-100 text-gray-700" },
];

const TYPE_LABELS: Record<string, string> = {
  mowing: "Tonte",
  hedge_trimming: "Taille de haies",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Entretien",
  emergency: "Urgence",
};

interface Props {
  intervention: InterventionDetail | null;
  teams: { id: string; name: string; color: string }[];
  onClose: () => void;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function InterventionDetailModal({
  intervention,
  teams,
  onClose,
  onUpdate,
  onDelete,
}: Props) {
  const [status, setStatus] = useState(intervention?.status ?? "planned");
  const [teamId, setTeamId] = useState(intervention?.assignedTeamId ?? "");
  const [startTime, setStartTime] = useState(
    intervention?.estimatedStartTime ?? ""
  );
  const [notes, setNotes] = useState(intervention?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!intervention) return null;

  const hasChanges =
    status !== intervention.status ||
    teamId !== intervention.assignedTeamId ||
    startTime !== intervention.estimatedStartTime ||
    notes !== (intervention.notes ?? "");

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {};
      if (status !== intervention.status) updates.status = status;
      if (teamId !== intervention.assignedTeamId)
        updates.assignedTeamId = teamId;
      if (startTime !== intervention.estimatedStartTime)
        updates.estimatedStartTime = startTime;
      if (notes !== (intervention.notes ?? "")) updates.notes = notes;
      await onUpdate(intervention.id, updates);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(intervention.id);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setDeleting(false);
    }
  };

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
          className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {intervention.client.name}
              </h2>
              <span className="text-sm text-gray-500">
                {TYPE_LABELS[intervention.interventionType] ??
                  intervention.interventionType}
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Client info */}
            <div className="space-y-2 rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {intervention.client.address}
              </div>
              {intervention.client.contactPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {intervention.client.contactPhone}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {intervention.estimatedDurationMinutes} min
                {intervention.estimatedTravelTimeMinutes > 0 &&
                  ` (+${intervention.estimatedTravelTimeMinutes} min trajet)`}
              </div>
            </div>

            {/* Weather */}
            {intervention.weatherTemperature !== null && (
              <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-3 text-sm">
                <div className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-blue-600" />
                  {intervention.weatherTemperature}°C
                </div>
                {intervention.weatherWindSpeed !== null && (
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-blue-600" />
                    {intervention.weatherWindSpeed} km/h
                  </div>
                )}
                {intervention.weatherCondition && (
                  <div className="flex items-center gap-1">
                    <Cloud className="h-4 w-4 text-blue-600" />
                    {intervention.weatherCondition}
                  </div>
                )}
              </div>
            )}

            {/* Status */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Statut
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      status === opt.value
                        ? opt.color + " ring-2 ring-gray-300 ring-offset-1"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Team */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <User className="mr-1 inline h-4 w-4" />
                Équipe assignée
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

            {/* Start time */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <Clock className="mr-1 inline h-4 w-4" />
                Heure de début
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
              />
            </div>

            {/* Equipment */}
            {intervention.assignedEquipment.length > 0 && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  <Truck className="mr-1 inline h-4 w-4" />
                  Équipement
                </label>
                <div className="flex flex-wrap gap-1">
                  {intervention.assignedEquipment.map((eq) => (
                    <span
                      key={eq}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {eq.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90A4] focus:ring-1 focus:ring-[#4A90A4] focus:outline-none"
                placeholder="Notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Supprimer
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className="flex items-center gap-2 rounded-lg bg-[#2D5A3D] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Enregistrer
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
