"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import {
  teamMemberFullSchema,
  LICENSE_LABELS,
  MEMBER_SKILL_LABELS,
  type TeamMemberFullFormData,
} from "@/lib/validation/team-member";

interface MemberData {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
  emergencyContact?: string | null;
  licenseTypes?: string[];
  skills?: string[];
  unavailableDates?: (string | Date)[];
  notes?: string | null;
}

interface TeamMemberModalProps {
  teamId: string;
  member?: MemberData | null;
  onClose: () => void;
  onSave: () => void;
}

export function TeamMemberModal({
  teamId,
  member,
  onClose,
  onSave,
}: TeamMemberModalProps) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newDate, setNewDate] = useState("");

  const [form, setForm] = useState<TeamMemberFullFormData>({
    firstName: member?.firstName ?? "",
    lastName: member?.lastName ?? "",
    phone: member?.phone ?? "",
    email: member?.email ?? "",
    emergencyContact: member?.emergencyContact ?? "",
    licenseTypes: (member?.licenseTypes ??
      []) as TeamMemberFullFormData["licenseTypes"],
    skills: (member?.skills ?? []) as TeamMemberFullFormData["skills"],
    unavailableDates: (member?.unavailableDates ?? []).map((d) =>
      typeof d === "string"
        ? d.split("T")[0]
        : new Date(d).toISOString().split("T")[0]
    ),
    notes: member?.notes ?? "",
  });

  const updateField = <K extends keyof TeamMemberFullFormData>(
    field: K,
    value: TeamMemberFullFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleLicense = (key: string) => {
    const typedKey = key as TeamMemberFullFormData["licenseTypes"][number];
    setForm((prev) => ({
      ...prev,
      licenseTypes: prev.licenseTypes.includes(typedKey)
        ? prev.licenseTypes.filter((l) => l !== typedKey)
        : [...prev.licenseTypes, typedKey],
    }));
  };

  const toggleSkill = (key: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(
        key as TeamMemberFullFormData["skills"][number]
      )
        ? prev.skills.filter((s) => s !== key)
        : [...prev.skills, key as TeamMemberFullFormData["skills"][number]],
    }));
  };

  const addUnavailableDate = () => {
    if (!newDate) return;
    if (form.unavailableDates.includes(newDate)) return;
    setForm((prev) => ({
      ...prev,
      unavailableDates: [...prev.unavailableDates, newDate].sort(),
    }));
    setNewDate("");
  };

  const removeUnavailableDate = (date: string) => {
    setForm((prev) => ({
      ...prev,
      unavailableDates: prev.unavailableDates.filter((d) => d !== date),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = teamMemberFullSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      const url = member
        ? `/api/teams/${teamId}/members/${member.id}`
        : `/api/teams/${teamId}/members`;
      const method = member ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur serveur");
      }

      toast.success(member ? "Membre mis à jour" : "Membre ajouté");
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
              {member ? "Modifier le membre" : "Nouveau membre"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identity */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                Identité
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                    placeholder="Prénom *"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                    placeholder="Nom *"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <input
                type="tel"
                value={form.phone ?? ""}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                placeholder="Téléphone"
              />
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
              <input
                type="text"
                value={form.emergencyContact ?? ""}
                onChange={(e) =>
                  updateField("emergencyContact", e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                placeholder="Contact urgence"
              />
            </div>

            {/* Licenses */}
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                Permis & habilitations
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(LICENSE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleLicense(key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      form.licenseTypes.includes(
                        key as TeamMemberFullFormData["licenseTypes"][number]
                      )
                        ? "bg-[#E07B39] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                Compétences
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(MEMBER_SKILL_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSkill(key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      form.skills.includes(
                        key as TeamMemberFullFormData["skills"][number]
                      )
                        ? "bg-[#4A90A4] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Unavailable Dates */}
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                Indisponibilités
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#2D5A3D]"
                />
                <button
                  type="button"
                  onClick={addUnavailableDate}
                  disabled={!newDate}
                  className="flex items-center gap-1 rounded-xl bg-[#2D5A3D] px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>
              {form.unavailableDates.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.unavailableDates.map((date) => (
                    <span
                      key={date}
                      className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                    >
                      {new Date(date + "T00:00:00").toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                      <button
                        type="button"
                        onClick={() => removeUnavailableDate(date)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                Notes
              </h3>
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                placeholder="Notes libres..."
              />
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
                {member ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
