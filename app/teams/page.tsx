"use client";

import { useState, useEffect } from "react";
import { Team, InterventionType } from "@/types/domain";

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const INTERVENTION_LABELS = {
  mowing: "Tonte",
  hedge_trimming: "Taille de haie",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Maintenance",
  emergency: "Urgence",
};

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

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
    fetchTeams();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Équipes</h1>
          <button
            onClick={() => {
              setEditingTeam(null);
              setIsModalOpen(true);
            }}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            + Nouvelle équipe
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-lg bg-white p-6 shadow"
              style={{ borderLeft: `4px solid ${team.color}` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">{team.name}</h3>
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
              </div>
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-500">
                  Membres ({team.members.length})
                </h4>
                <div className="space-y-1">
                  {team.members.map((m) => (
                    <div key={m.id} className="text-sm">
                      {m.firstName} {m.lastName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
