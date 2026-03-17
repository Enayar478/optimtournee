"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { TeamModal } from "@/components/teams/TeamModal";
import { TeamMemberModal } from "@/components/teams/TeamMemberModal";
import { UnavailableDatesModal } from "@/components/teams/UnavailableDatesModal";
import { useToast } from "@/components/ui/Toast";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Team, TeamMember } from "@/types/domain";
import {
  Users,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  CalendarOff,
  UserPlus,
  Shield,
  Wrench,
} from "lucide-react";
import {
  LICENSE_LABELS,
  MEMBER_SKILL_LABELS,
} from "@/lib/validation/team-member";

function hasUpcomingUnavailableDates(team: Team): boolean {
  if (!team.unavailableDates || team.unavailableDates.length === 0)
    return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return team.unavailableDates.some((d) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return date >= now;
  });
}

function TeamsContent() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Member modal state
  const [memberModalTeamId, setMemberModalTeamId] = useState<string | null>(
    null
  );
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Unavailable dates modal state
  const [unavailTeamId, setUnavailTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setTeams(Array.isArray(data) ? data : []);
    } catch {
      setTeams([]);
    }
  };

  const toast = useToast();

  const deleteTeam = async (id: string) => {
    if (!confirm("Supprimer cette équipe ?")) return;
    try {
      const res = await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur serveur");
      toast.success("Équipe supprimée");
      setOpenMenuId(null);
      fetchTeams();
    } catch {
      toast.error("Erreur lors de la suppression de l'équipe");
    }
  };

  const openMemberModal = (teamId: string, member?: TeamMember) => {
    setMemberModalTeamId(teamId);
    setEditingMember(member ?? null);
  };

  const closeMemberModal = () => {
    setMemberModalTeamId(null);
    setEditingMember(null);
  };

  const unavailTeam = unavailTeamId
    ? teams.find((t) => t.id === unavailTeamId)
    : null;

  return (
    <div className="space-y-6 p-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-3xl font-bold text-transparent">
            Équipes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos équipes et leurs membres
          </p>
        </div>

        <motion.button
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-6 py-3 font-medium text-white shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingTeam(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-5 w-5" />
          Nouvelle équipe
        </motion.button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
          >
            <div
              className="absolute top-0 left-0 h-1 w-full"
              style={{ backgroundColor: team.color }}
            />

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: team.color }}
                  whileHover={{ rotate: 5 }}
                >
                  {team.name.charAt(0)}
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">{team.name}</h3>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4" />
                    {team.members.length} membres
                    {hasUpcomingUnavailableDates(team) && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                        <CalendarOff className="h-3 w-3" />
                        Indispo.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <motion.button
                  className="rounded-lg p-2 hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setOpenMenuId(openMenuId === team.id ? null : team.id)
                  }
                >
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </motion.button>

                {openMenuId === team.id && (
                  <div className="absolute top-10 right-0 z-10 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                    <button
                      onClick={() => {
                        setEditingTeam(team);
                        setIsModalOpen(true);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        openMemberModal(team.id);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserPlus className="h-4 w-4" />
                      Ajouter membre
                    </button>
                    <button
                      onClick={() => {
                        setUnavailTeamId(team.id);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <CalendarOff className="h-4 w-4" />
                      Disponibilité
                    </button>
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {team.members.slice(0, 3).map((m, i) => (
                <motion.button
                  key={m.id}
                  type="button"
                  onClick={() => openMemberModal(team.id, m)}
                  className="flex w-full items-center gap-3 rounded-lg bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] text-xs font-bold text-white">
                    {m.firstName.charAt(0)}
                    {m.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">
                      {m.firstName} {m.lastName}
                    </span>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {(m.licenseTypes ?? []).slice(0, 2).map((l) => (
                        <span
                          key={l}
                          className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700"
                        >
                          <Shield className="h-2.5 w-2.5" />
                          {LICENSE_LABELS[l] ?? l}
                        </span>
                      ))}
                      {(m.skills ?? []).slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700"
                        >
                          <Wrench className="h-2.5 w-2.5" />
                          {MEMBER_SKILL_LABELS[s] ?? s}
                        </span>
                      ))}
                      {(m.licenseTypes?.length ?? 0) + (m.skills?.length ?? 0) >
                        4 && (
                        <span className="text-[10px] text-gray-400">
                          +
                          {(m.licenseTypes?.length ?? 0) +
                            (m.skills?.length ?? 0) -
                            4}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}

              {team.members.length > 3 && (
                <div className="text-muted-foreground py-1 text-center text-sm">
                  +{team.members.length - 3} autres
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openMemberModal(team.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Ajouter membre
              </button>
              <button
                onClick={() => setUnavailTeamId(team.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                <CalendarOff className="h-3.5 w-3.5" />
                Disponibilité
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <TeamModal
          team={
            editingTeam
              ? {
                  id: editingTeam.id,
                  name: editingTeam.name,
                  color: editingTeam.color,
                  members: editingTeam.members.map((m) => ({
                    id: m.id,
                    firstName: m.firstName,
                    lastName: m.lastName,
                    phone: m.phone,
                  })),
                }
              : null
          }
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            fetchTeams();
            setIsModalOpen(false);
          }}
        />
      )}

      {memberModalTeamId && (
        <TeamMemberModal
          teamId={memberModalTeamId}
          member={editingMember}
          onClose={closeMemberModal}
          onSave={() => {
            closeMemberModal();
            fetchTeams();
          }}
        />
      )}

      {unavailTeam && (
        <UnavailableDatesModal
          teamId={unavailTeam.id}
          teamName={unavailTeam.name}
          currentDates={(unavailTeam.unavailableDates ?? []).map((d) =>
            typeof d === "string" ? d : new Date(d).toISOString()
          )}
          onClose={() => setUnavailTeamId(null)}
          onSave={() => {
            setUnavailTeamId(null);
            fetchTeams();
          }}
        />
      )}
    </div>
  );
}

export default function TeamsPage() {
  return (
    <AdminLayout>
      <TeamsContent />
    </AdminLayout>
  );
}
