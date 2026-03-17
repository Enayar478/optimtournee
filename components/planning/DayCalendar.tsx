"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import type { InterventionDetail } from "@/lib/hooks/usePlanning";

const TYPE_LABELS: Record<string, string> = {
  mowing: "Tonte",
  hedge_trimming: "Taille de haies",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Entretien",
  emergency: "Urgence",
};

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  planned: { label: "Planifié", class: "bg-blue-100 text-blue-700" },
  in_progress: { label: "En cours", class: "bg-amber-100 text-amber-700" },
  completed: { label: "Terminé", class: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulé", class: "bg-red-100 text-red-700" },
  postponed: { label: "Reporté", class: "bg-gray-100 text-gray-700" },
};

interface Props {
  date: Date;
  interventions: InterventionDetail[];
  selectedTeamIds?: string[];
  onInterventionClick: (intervention: InterventionDetail) => void;
}

export function DayCalendar({
  date,
  interventions,
  selectedTeamIds,
  onInterventionClick,
}: Props) {
  // Group by team
  const byTeam = useMemo(() => {
    const filtered = selectedTeamIds
      ? interventions.filter((i) => selectedTeamIds.includes(i.assignedTeamId))
      : interventions;

    const map = new Map<string, { team: InterventionDetail["team"]; items: InterventionDetail[] }>();
    for (const i of filtered) {
      const existing = map.get(i.assignedTeamId);
      if (existing) {
        map.set(i.assignedTeamId, { ...existing, items: [...existing.items, i] });
      } else {
        map.set(i.assignedTeamId, { team: i.team, items: [i] });
      }
    }
    return Array.from(map.values());
  }, [interventions, selectedTeamIds]);

  const dateStr = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold capitalize text-gray-900">{dateStr}</h3>

      {byTeam.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
          Aucune intervention ce jour
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {byTeam.map(({ team, items }) => {
            const sorted = [...items].sort((a, b) => a.routeOrder - b.routeOrder);
            const totalDuration = sorted.reduce(
              (s, i) => s + i.estimatedDurationMinutes,
              0
            );
            const totalTravel = sorted.reduce(
              (s, i) => s + i.estimatedTravelTimeMinutes,
              0
            );

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Team header */}
                <div
                  className="flex items-center justify-between rounded-t-xl px-4 py-3 text-white"
                  style={{ backgroundColor: team.color }}
                >
                  <span className="font-medium">{team.name}</span>
                  <span className="text-sm opacity-80">
                    {sorted.length} intervention{sorted.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex gap-4 border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.round(totalDuration / 60)}h travail
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {totalTravel} min trajet
                  </span>
                </div>

                {/* Interventions */}
                <div className="divide-y divide-gray-50">
                  {sorted.map((intervention, idx) => {
                    const badge = STATUS_BADGE[intervention.status];
                    return (
                      <motion.div
                        key={intervention.id}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                        onClick={() => onInterventionClick(intervention)}
                        whileHover={{ x: 3 }}
                      >
                        {/* Route order */}
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: team.color }}
                        >
                          {idx + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium text-gray-900">
                              {intervention.client.name}
                            </span>
                            <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${badge?.class}`}>
                              {badge?.label}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {intervention.estimatedStartTime} -{" "}
                            {TYPE_LABELS[intervention.interventionType] ?? intervention.interventionType}
                            {" - "}
                            {intervention.estimatedDurationMinutes} min
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
