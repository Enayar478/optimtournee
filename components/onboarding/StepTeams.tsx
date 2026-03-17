"use client";

import { useState } from "react";
import { Plus, Trash2, Users, Loader2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EQUIPMENT_LABELS, SKILL_LABELS } from "@/lib/validation/onboarding";
import type { TeamFormData } from "@/lib/validation/team";
import { CsvImportBlock } from "./CsvImportBlock";
import { TEAM_COLUMNS, parseTeamRow } from "@/lib/import/csv-templates";
import {
  AddressInput,
  EMPTY_ADDRESS,
  type AddressData,
} from "@/components/ui/AddressInput";
import { geocodeAddress } from "@/lib/services/geocoding";

type TeamData = TeamFormData & { id?: string };

interface StepTeamsProps {
  teams: TeamData[];
  onTeamsChange: (teams: TeamData[]) => void;
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

const DAY_SHORT = ["D", "L", "M", "Me", "J", "V", "S"];

const emptyTeam: TeamData & { depotAddress?: AddressData } = {
  name: "",
  color: COLORS[0],
  members: [{ firstName: "", lastName: "" }],
  defaultStartAddress: "",
  workScheduleStart: "08:00",
  workScheduleEnd: "17:00",
  lunchBreakMinutes: 60,
  workingDays: [1, 2, 3, 4, 5],
  assignedEquipment: [] as TeamFormData["assignedEquipment"],
  skills: [] as TeamFormData["skills"],
};

export function StepTeams({ teams, onTeamsChange }: StepTeamsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<TeamData & { depotAddress?: AddressData }>({
    ...emptyTeam,
  });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAdd = () => {
    setForm({ ...emptyTeam, color: COLORS[teams.length % COLORS.length] });
    setEditingIndex(null);
    setError(null);
    setShowForm(true);
  };

  const startEdit = (index: number) => {
    setForm({ ...teams[index] });
    setEditingIndex(index);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingIndex(null);
  };

  const saveTeam = async () => {
    if (!form.name.trim() || !form.members[0]?.firstName.trim()) return;

    setSaving(true);
    try {
      const depotAddr = form.depotAddress;
      const fullAddress =
        depotAddr?.fullAddress ?? form.defaultStartAddress ?? "";
      let lat = depotAddr?.lat ?? form.defaultStartLat;
      let lng = depotAddr?.lng ?? form.defaultStartLng;
      if (fullAddress && (!lat || !lng)) {
        const coords = await geocodeAddress(fullAddress);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { depotAddress: _da, ...formWithoutDepot } = form;
      let payload: TeamData = {
        ...formWithoutDepot,
        defaultStartAddress: fullAddress,
        defaultStartLat: lat,
        defaultStartLng: lng,
      };

      if (editingIndex !== null && teams[editingIndex]?.id) {
        const res = await fetch("/api/teams", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: teams[editingIndex].id, ...payload }),
        });
        if (!res.ok) throw new Error("Erreur serveur");
      } else {
        const res = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Erreur serveur");
        const created = await res.json();
        payload = { ...payload, id: created.id };
      }

      setError(null);
      const newTeams =
        editingIndex !== null
          ? teams.map((t, i) => (i === editingIndex ? payload : t))
          : [...teams, payload];
      onTeamsChange(newTeams);
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

  const deleteTeam = async (index: number) => {
    const team = teams[index];
    if (team.id) {
      const res = await fetch(`/api/teams?id=${team.id}`, { method: "DELETE" });
      if (!res.ok) return;
    }
    onTeamsChange(teams.filter((_, i) => i !== index));
  };

  const updateFormField = <K extends keyof TeamData>(
    field: K,
    value: TeamData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (
    field: "assignedEquipment" | "skills" | "workingDays",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any
  ) => {
    setForm((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arr = prev[field] as any[];
      const exists = arr.includes(item);
      return {
        ...prev,
        [field]: exists
          ? arr.filter((v: unknown) => v !== item)
          : [...arr, item],
      };
    });
  };

  const updateMember = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleCsvImport = (rows: Record<string, string>[]) => {
    const errors: string[] = [];
    const imported: TeamData[] = [];

    for (let i = 0; i < rows.length; i++) {
      const { data, error } = parseTeamRow(rows[i], i, COLORS);
      if (error) {
        errors.push(error);
        continue;
      }
      if (data) {
        imported.push({
          ...data,
          members:
            data.members.length > 0
              ? data.members
              : [{ firstName: "", lastName: "" }],
          assignedEquipment:
            data.assignedEquipment as TeamFormData["assignedEquipment"],
          skills: data.skills as TeamFormData["skills"],
        });
      }
    }

    if (imported.length > 0) {
      onTeamsChange([...teams, ...imported]);
    }

    return { imported: imported.length, errors };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4A90A4] to-[#6BB3C7]">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Mes équipes</h2>
        <p className="mt-2 text-gray-500">
          Créez au moins une équipe avec ses membres, horaires et équipements.
        </p>
      </div>

      {/* CSV Import */}
      <CsvImportBlock
        columns={TEAM_COLUMNS}
        templateFilename="optimtournee-equipes-template.csv"
        onImport={handleCsvImport}
        entityLabel="équipes"
      />

      {/* List of existing teams */}
      <div className="space-y-3">
        <AnimatePresence>
          {teams.map((team, index) => (
            <motion.div
              key={team.id ?? index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: team.color }}
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{team.name}</p>
                <p className="text-sm text-gray-500">
                  {team.members.length} membre(s) &middot;{" "}
                  {team.workScheduleStart}-{team.workScheduleEnd}
                </p>
              </div>
              <button
                onClick={() => startEdit(index)}
                className="text-sm font-medium text-[#2D5A3D] hover:underline"
              >
                Modifier
              </button>
              <button
                onClick={() => deleteTeam(index)}
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
        <div className="space-y-4 rounded-xl border border-[#2D5A3D]/20 bg-white p-6">
          <h3 className="font-semibold text-gray-900">
            {editingIndex !== null ? "Modifier l'équipe" : "Nouvelle équipe"}
          </h3>

          {/* Name + Color */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D]"
                placeholder="Ex: Équipe Alpha"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Couleur
              </label>
              <div className="flex gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateFormField("color", c)}
                    className={`h-8 w-8 rounded-full transition-all ${form.color === c ? "ring-2 ring-gray-400 ring-offset-2" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Membres ({form.members.length})
            </label>
            <div className="space-y-2">
              {form.members.map((member, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={member.firstName}
                    onChange={(e) =>
                      updateMember(i, "firstName", e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2D5A3D]"
                    placeholder="Prénom"
                  />
                  <input
                    type="text"
                    value={member.lastName}
                    onChange={(e) =>
                      updateMember(i, "lastName", e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2D5A3D]"
                    placeholder="Nom"
                  />
                  {form.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          members: prev.members.filter((_, idx) => idx !== i),
                        }))
                      }
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  members: [...prev.members, { firstName: "", lastName: "" }],
                }))
              }
              className="mt-2 flex items-center gap-1 text-sm font-medium text-[#2D5A3D]"
            >
              <Plus className="h-4 w-4" /> Ajouter un membre
            </button>
          </div>

          {/* Depot address */}
          <AddressInput
            value={
              form.depotAddress ?? {
                ...EMPTY_ADDRESS,
                street: form.defaultStartAddress ?? "",
                fullAddress: form.defaultStartAddress ?? "",
              }
            }
            onChange={(addr) =>
              setForm((prev) => ({
                ...prev,
                depotAddress: addr,
                defaultStartAddress: addr.fullAddress,
              }))
            }
            label="Adresse dépôt (départ)"
            placeholder="Adresse de départ des tournées"
          />

          {/* Schedule */}
          <div>
            <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
              <Clock className="h-4 w-4" /> Horaires
            </label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={form.workScheduleStart}
                onChange={(e) =>
                  updateFormField("workScheduleStart", e.target.value)
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2D5A3D]"
              />
              <span className="text-gray-400">à</span>
              <input
                type="time"
                value={form.workScheduleEnd}
                onChange={(e) =>
                  updateFormField("workScheduleEnd", e.target.value)
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2D5A3D]"
              />
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Pause</span>
                <input
                  type="number"
                  value={form.lunchBreakMinutes}
                  onChange={(e) =>
                    updateFormField(
                      "lunchBreakMinutes",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-16 rounded-lg border border-gray-200 px-2 py-2 text-center text-sm outline-none focus:border-[#2D5A3D]"
                  min={0}
                  max={120}
                />
                <span className="text-xs text-gray-500">min</span>
              </div>
            </div>
          </div>

          {/* Working days */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Jours travaillés
            </label>
            <div className="flex gap-2">
              {DAY_SHORT.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleArrayItem("workingDays", i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    form.workingDays.includes(i)
                      ? "bg-[#2D5A3D] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Équipements
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleArrayItem("assignedEquipment", key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    (form.assignedEquipment as string[]).includes(key)
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Compétences
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SKILL_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleArrayItem("skills", key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    (form.skills as string[]).includes(key)
                      ? "bg-[#4A90A4] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Form actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={cancelForm}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={saveTeam}
              disabled={saving || !form.name.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingIndex !== null ? "Enregistrer" : "Créer l'équipe"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-500 transition-all hover:border-[#2D5A3D] hover:text-[#2D5A3D]"
        >
          <Plus className="h-5 w-5" />
          Ajouter une équipe
        </button>
      )}
    </div>
  );
}
