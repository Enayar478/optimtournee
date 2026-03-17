"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import {
  contractSchema,
  type ContractFormData,
  INTERVENTION_LABELS,
  EQUIPMENT_LABELS,
  RECURRENCE_LABELS,
  DAY_LABELS,
} from "@/lib/validation/onboarding";

interface ContractModalProps {
  clientId: string;
  clientName: string;
  contract: (ContractFormData & { id: string }) | null;
  onClose: () => void;
  onSave: () => void;
}

const PRIORITY_LABELS = ["Basse", "Normale", "Moyenne", "Haute", "Urgente"];

const DEFAULT_FORM: ContractFormData = {
  interventionType: "mowing",
  durationMinutes: 60,
  recurrence: "weekly",
  dayOfWeek: 1,
  requiredEquipment: [],
  priority: 1,
  maxWindSpeed: 50,
  noRainForecast: false,
  minTemperature: -5,
  maxTemperature: 40,
};

function buildInitialForm(contract: ContractModalProps["contract"]): ContractFormData {
  if (!contract) return DEFAULT_FORM;
  return {
    interventionType: contract.interventionType,
    durationMinutes: contract.durationMinutes,
    recurrence: contract.recurrence,
    dayOfWeek: contract.dayOfWeek,
    requiredEquipment: contract.requiredEquipment ?? [],
    priority: contract.priority ?? 1,
    maxWindSpeed: contract.maxWindSpeed ?? 50,
    noRainForecast: contract.noRainForecast ?? false,
    minTemperature: contract.minTemperature ?? -5,
    maxTemperature: contract.maxTemperature ?? 40,
  };
}

export function ContractModal({
  clientId,
  clientName,
  contract,
  onClose,
  onSave,
}: ContractModalProps) {
  const toast = useToast();
  const [form, setForm] = useState<ContractFormData>(() => buildInitialForm(contract));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = <K extends keyof ContractFormData>(
    field: K,
    value: ContractFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleEquipment = (eq: string) => {
    setForm((prev) => {
      const current = prev.requiredEquipment ?? [];
      const has = current.includes(eq as ContractFormData["requiredEquipment"][number]);
      return {
        ...prev,
        requiredEquipment: has
          ? current.filter((e) => e !== eq)
          : [...current, eq as ContractFormData["requiredEquipment"][number]],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contractSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      const method = contract ? "PUT" : "POST";
      const res = await fetch(`/api/clients/${clientId}/contract`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur serveur");
      }

      toast.success(contract ? "Contrat mis à jour" : "Contrat créé");
      onSave();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20";

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
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {contract ? "Modifier le contrat" : "Nouveau contrat"}
              </h2>
              <p className="text-sm text-gray-500">{clientName}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Intervention Type */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Type d&apos;intervention *
              </label>
              <select
                value={form.interventionType}
                onChange={(e) => updateField("interventionType", e.target.value as ContractFormData["interventionType"])}
                className={inputClass}
              >
                {Object.entries(INTERVENTION_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {errors.interventionType && (
                <p className="mt-1 text-sm text-red-500">{errors.interventionType}</p>
              )}
            </div>

            {/* Duration + Recurrence */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Durée (min) *
                </label>
                <input
                  type="number"
                  min={15}
                  step={15}
                  value={form.durationMinutes}
                  onChange={(e) => updateField("durationMinutes", Number(e.target.value))}
                  className={inputClass}
                />
                {errors.durationMinutes && (
                  <p className="mt-1 text-sm text-red-500">{errors.durationMinutes}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Récurrence *
                </label>
                <select
                  value={form.recurrence}
                  onChange={(e) => updateField("recurrence", e.target.value as ContractFormData["recurrence"])}
                  className={inputClass}
                >
                  {Object.entries(RECURRENCE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Day of Week */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Jour de passage préféré *
              </label>
              <select
                value={form.dayOfWeek}
                onChange={(e) => updateField("dayOfWeek", Number(e.target.value))}
                className={inputClass}
              >
                {DAY_LABELS.map((label, i) => (
                  <option key={i} value={i}>{label}</option>
                ))}
              </select>
            </div>

            {/* Equipment */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Équipement requis
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => {
                  const isSelected = (form.requiredEquipment ?? []).includes(
                    key as ContractFormData["requiredEquipment"][number]
                  );
                  return (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => toggleEquipment(key)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-[#2D5A3D] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Priorité
              </label>
              <div className="flex gap-2">
                {PRIORITY_LABELS.map((label, i) => {
                  const level = i + 1;
                  const isSelected = form.priority === level;
                  return (
                    <motion.button
                      key={level}
                      type="button"
                      onClick={() => updateField("priority", level)}
                      className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                        isSelected
                          ? "bg-[#4A90A4] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Advanced: Weather Constraints */}
            <div className="rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Paramètres avancés
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 border-t border-gray-200 px-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Vent max (km/h)
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={200}
                            value={form.maxWindSpeed}
                            onChange={(e) => updateField("maxWindSpeed", Number(e.target.value))}
                            className={inputClass}
                          />
                        </div>
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                              type="checkbox"
                              checked={form.noRainForecast}
                              onChange={(e) => updateField("noRainForecast", e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-[#2D5A3D] focus:ring-[#2D5A3D]"
                            />
                            Pas de pluie requise
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Temp. min (°C)
                          </label>
                          <input
                            type="number"
                            value={form.minTemperature}
                            onChange={(e) => updateField("minTemperature", Number(e.target.value))}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Temp. max (°C)
                          </label>
                          <input
                            type="number"
                            value={form.maxTemperature}
                            onChange={(e) => updateField("maxTemperature", Number(e.target.value))}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                {contract ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
