"use client";

export const dynamic = "force-dynamic";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { TeamModal } from "@/components/teams/TeamModal";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Team } from "@/types/domain";
import { Users, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";

function TeamsContent() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(data);
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Supprimer cette équipe ?")) return;
    await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
    setOpenMenuId(null);
    fetchTeams();
  };

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
                  <div className="absolute top-10 right-0 z-10 w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
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
                <motion.div
                  key={m.id}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] text-xs font-bold text-white">
                    {m.firstName.charAt(0)}
                    {m.lastName.charAt(0)}
                  </div>
                  <span className="text-sm">
                    {m.firstName} {m.lastName}
                  </span>
                </motion.div>
              ))}

              {team.members.length > 3 && (
                <div className="text-muted-foreground py-1 text-center text-sm">
                  +{team.members.length - 3} autres
                </div>
              )}
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
