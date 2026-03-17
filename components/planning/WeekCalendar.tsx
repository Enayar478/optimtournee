"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { InterventionDetail } from "@/lib/hooks/usePlanning";

const HOURS = Array.from({ length: 22 }, (_, i) => 7 + i * 0.5); // 07:00 to 18:00
const SLOT_HEIGHT = 48; // px per 30min

const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const TYPE_LABELS: Record<string, string> = {
  mowing: "Tonte",
  hedge_trimming: "Haies",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Entretien",
  emergency: "Urgence",
};

interface Props {
  weekStart: Date;
  interventions: InterventionDetail[];
  allowWeekend?: boolean;
  onInterventionClick: (intervention: InterventionDetail) => void;
  onEmptySlotClick: (date: string, time: string) => void;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function WeekCalendar({
  weekStart,
  interventions,
  allowWeekend = false,
  onInterventionClick,
  onEmptySlotClick,
}: Props) {
  const daysCount = allowWeekend ? 7 : 5;

  const days = useMemo(
    () =>
      Array.from({ length: daysCount }, (_, i) => {
        const d = addDays(weekStart, i);
        return { date: d, key: formatDate(d), name: DAY_NAMES[i] };
      }),
    [weekStart, daysCount]
  );

  // Group interventions by date
  const byDate = useMemo(() => {
    const map = new Map<string, InterventionDetail[]>();
    for (const intervention of interventions) {
      const dateKey = intervention.scheduledDate.split("T")[0];
      const list = map.get(dateKey) ?? [];
      map.set(dateKey, [...list, intervention]);
    }
    return map;
  }, [interventions]);

  const STATUS_OPACITY: Record<string, string> = {
    planned: "opacity-100",
    in_progress: "opacity-100 ring-2 ring-amber-400",
    completed: "opacity-60",
    cancelled: "opacity-30 line-through",
    postponed: "opacity-40",
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="sticky top-0 z-10 grid bg-gray-50 border-b border-gray-100" style={{ gridTemplateColumns: `60px repeat(${daysCount}, 1fr)` }}>
        <div className="p-2 text-center text-xs text-gray-400">Heure</div>
        {days.map((day) => (
          <div key={day.key} className="border-l border-gray-100 p-2 text-center">
            <div className="text-xs font-medium text-gray-500">{day.name}</div>
            <div className="text-sm font-bold text-gray-900">
              {day.date.getDate()}/{day.date.getMonth() + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="relative grid" style={{ gridTemplateColumns: `60px repeat(${daysCount}, 1fr)` }}>
        {/* Time labels */}
        <div>
          {HOURS.map((h) => (
            <div
              key={h}
              className="flex items-start justify-end pr-2 text-xs text-gray-400"
              style={{ height: SLOT_HEIGHT }}
            >
              {Number.isInteger(h)
                ? `${String(h).padStart(2, "0")}:00`
                : ""}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day) => {
          const dayInterventions = byDate.get(day.key) ?? [];
          return (
            <div
              key={day.key}
              className="relative border-l border-gray-100"
              style={{ height: HOURS.length * SLOT_HEIGHT }}
            >
              {/* Grid lines */}
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="absolute w-full border-t border-gray-50 cursor-pointer hover:bg-[#4A90A4]/5"
                  style={{
                    top: (h - 7) * 2 * SLOT_HEIGHT,
                    height: SLOT_HEIGHT,
                  }}
                  onClick={() => {
                    const hour = Math.floor(h);
                    const min = Number.isInteger(h) ? "00" : "30";
                    onEmptySlotClick(day.key, `${String(hour).padStart(2, "0")}:${min}`);
                  }}
                />
              ))}

              {/* Intervention blocks */}
              {dayInterventions.map((intervention) => {
                const startMins = timeToMinutes(intervention.estimatedStartTime);
                const topPx = ((startMins - 420) / 30) * SLOT_HEIGHT; // 420 = 7*60
                const heightPx = Math.max(
                  (intervention.estimatedDurationMinutes / 30) * SLOT_HEIGHT,
                  24
                );

                return (
                  <motion.div
                    key={intervention.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute left-1 right-1 cursor-pointer overflow-hidden rounded-lg px-2 py-1 text-xs text-white shadow-sm transition-shadow hover:shadow-md ${STATUS_OPACITY[intervention.status] ?? ""}`}
                    style={{
                      top: Math.max(topPx, 0),
                      height: heightPx,
                      backgroundColor: intervention.team.color,
                      zIndex: 5,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onInterventionClick(intervention);
                    }}
                  >
                    <div className="font-medium truncate">
                      {intervention.client.name}
                    </div>
                    {heightPx > 30 && (
                      <div className="truncate opacity-80">
                        {TYPE_LABELS[intervention.interventionType] ?? intervention.interventionType}
                        {" - "}
                        {intervention.estimatedStartTime}
                      </div>
                    )}
                    {heightPx > 48 && (
                      <div className="truncate opacity-70">
                        {intervention.team.name}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
