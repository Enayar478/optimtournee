"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import {
  teamSchema,
  type TeamFormData,
  type TeamMemberFormData,
} from "@/lib/validation/team";

interface TeamModalProps {
  team: {
    id: string;
    name: string;
    color: string;
    members: {
      id: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }[];
  } | null;
  onClose: () => void;
  onSave: () => void;
}

const COLORS = [
  "#2D5A3D",
  "#4A90A4",
  "#E07B39",
  "#8B5CF6",
  "#EC4899",
  "#22C55E",
  "#3B82F6",
  "#EF4444",
];

const emptyMember: TeamMemberFormData = {
  firstName: "",
  lastName: "",
  phone: "",
};

export function TeamModal({ team, onClose, onSave }: TeamModalProps) {
  const [form, setForm] = useState<TeamFormData>({
    name: team?.name ?? "",
    color: team?.color ?? COLORS[0],
    members: team?.members.map((m) => ({
      firstName: m.firstName,
      lastName: m.lastName,
      phone: m.phone ?? "",
    })) ?? [{ ...emptyMember }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const updateField = (field: "name" | "color", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateMember = (
    index: number,
    field: keyof TeamMemberFormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  const addMember = () => {
    setForm((prev) => ({
      ...prev,
      members: [...prev.members, { ...emptyMember }],
    }));
  };

  const removeMember = (index: number) => {
    if (form.members.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = teamSchema.safeParse(form);
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
      if (team) {
        const res = await fetch("/api/teams", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: team.id, ...result.data }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Erreur serveur");
        }
      } else {
        const res = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Erreur serveur");
        }
      }
      onSave();
    } catch {
      setErrors({ name: "Erreur lors de la sauvegarde" });
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
              {team ? "Modifier l'équipe" : "Nouvelle équipe"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nom de l&apos;équipe *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                placeholder="Ex: Équipe Alpha"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Couleur
              </label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateField("color", c)}
                    className={`h-8 w-8 rounded-full transition-all ${form.color === c ? "scale-110 ring-2 ring-gray-400 ring-offset-2" : "hover:scale-105"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Membres ({form.members.length})
              </label>
              <div className="space-y-3">
                {form.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex flex-1 gap-2">
                      <input
                        type="text"
                        value={member.firstName}
                        onChange={(e) =>
                          updateMember(index, "firstName", e.target.value)
                        }
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2D5A3D]"
                        placeholder="Prénom"
                      />
                      <input
                        type="text"
                        value={member.lastName}
                        onChange={(e) =>
                          updateMember(index, "lastName", e.target.value)
                        }
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2D5A3D]"
                        placeholder="Nom"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      disabled={form.members.length <= 1}
                      className="rounded-lg p-2 text-gray-400 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.members && (
                <p className="mt-1 text-sm text-red-500">{errors.members}</p>
              )}
              <button
                type="button"
                onClick={addMember}
                className="mt-2 flex items-center gap-1 text-sm font-medium text-[#2D5A3D] hover:text-[#1F3D29]"
              >
                <Plus className="h-4 w-4" />
                Ajouter un membre
              </button>
            </div>

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
                {team ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
