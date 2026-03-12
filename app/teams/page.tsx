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
    <div className="p-6 space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-transparent">
            Équipes
          </h1>
          <p className="text-muted-foreground mt-1">Gérez vos équipes et leurs membres</p>
        </div>

        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] text-white rounded-xl font-medium shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingTeam(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
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
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 group"
          >
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: team.color }}
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: team.color }}
                  whileHover={{ rotate: 5 }}
                >
                  {team.name.charAt(0)}
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">{team.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {team.members.length} membres
                  </div>
                </div>
              </div>

              <div className="relative">
                <motion.button
                  className="p-2 rounded-lg hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setOpenMenuId(openMenuId === team.id ? null : team.id)
                  }
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </motion.button>

                {openMenuId === team.id && (
                  <div className="absolute right-0 top-10 z-10 w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
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
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] flex items-center justify-center text-white text-xs font-bold">
                    {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                  </div>
                  <span className="text-sm">{m.firstName} {m.lastName}</span>
                </motion.div>
              ))}

              {team.members.length > 3 && (
                <div className="text-sm text-muted-foreground text-center py-1">
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
