"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarDays,
  CalendarIcon,
  Filter,
  Loader2,
} from "lucide-react";
import { useSchedules } from "@/lib/hooks/useSchedules";
import { usePlanning } from "@/lib/hooks/usePlanning";
import { WeekCalendar } from "./WeekCalendar";
import { DayCalendar } from "./DayCalendar";
import { GenerateScheduleModal } from "./GenerateScheduleModal";
import { InterventionDetailModal } from "./InterventionDetailModal";
import { AddInterventionModal } from "./AddInterventionModal";
import { WeatherBar } from "./WeatherBar";
import type { InterventionDetail } from "@/lib/hooks/usePlanning";

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function PlanningView() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedIntervention, setSelectedIntervention] =
    useState<InterventionDetail | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addDefaultDate, setAddDefaultDate] = useState<string>();
  const [addDefaultTime, setAddDefaultTime] = useState<string>();
  const [showTeamFilter, setShowTeamFilter] = useState(false);

  const {
    schedules,
    loading: schedulesLoading,
    generateSchedule,
  } = useSchedules();

  // Find the schedule that covers the current week
  const activeSchedule = useMemo(() => {
    const weekEnd = addDays(weekStart, 6);
    return schedules.find((s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return start <= weekEnd && end >= weekStart;
    });
  }, [schedules, weekStart]);

  const {
    schedule: scheduleDetail,
    loading: planningLoading,
    updateIntervention,
    deleteIntervention,
    refresh,
  } = usePlanning(activeSchedule?.id ?? null);

  // Filter interventions for the current week
  const weekInterventions = useMemo(() => {
    if (!scheduleDetail) return [];
    const weekEnd = addDays(weekStart, 7);
    return scheduleDetail.interventions.filter((i) => {
      const d = new Date(i.scheduledDate);
      const inWeek = d >= weekStart && d < weekEnd;
      const matchTeam =
        selectedTeamIds.length === 0 ||
        selectedTeamIds.includes(i.assignedTeamId);
      return inWeek && matchTeam;
    });
  }, [scheduleDetail, weekStart, selectedTeamIds]);

  const selectedDay = addDays(weekStart, selectedDayOffset);

  const dayInterventions = useMemo(() => {
    const dayKey = selectedDay.toISOString().split("T")[0];
    return weekInterventions.filter(
      (i) => i.scheduledDate.split("T")[0] === dayKey
    );
  }, [weekInterventions, selectedDay]);

  const weekLabel = `${weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${addDays(weekStart, 4).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`;

  const handlePrevWeek = () => setWeekStart((prev) => addDays(prev, -7));
  const handleNextWeek = () => setWeekStart((prev) => addDays(prev, 7));

  const handleEmptySlotClick = (date: string, time: string) => {
    if (!activeSchedule) return;
    setAddDefaultDate(date);
    setAddDefaultTime(time);
    setShowAddModal(true);
  };

  const handleGenerate = async (
    startDate: string,
    endDate: string,
    name?: string
  ) => {
    await generateSchedule(startDate, endDate, name);
  };

  const loading = schedulesLoading || planningLoading;

  // All teams from all schedules for the filter
  const allTeams = useMemo(() => {
    if (!scheduleDetail) return [];
    const map = new Map<string, InterventionDetail["team"]>();
    for (const i of scheduleDetail.interventions) {
      map.set(i.team.id, i.team);
    }
    return Array.from(map.values());
  }, [scheduleDetail]);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Week navigation */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-2 py-1 shadow-sm">
          <button
            onClick={handlePrevWeek}
            className="rounded-lg p-1.5 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[180px] text-center text-sm font-medium text-gray-900">
            {weekLabel}
          </span>
          <button
            onClick={handleNextWeek}
            className="rounded-lg p-1.5 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* View toggle */}
        <div className="flex rounded-xl border border-gray-100 bg-white shadow-sm">
          <button
            onClick={() => setViewMode("week")}
            className={`flex items-center gap-1.5 rounded-l-xl px-3 py-2 text-sm ${
              viewMode === "week"
                ? "bg-[#2D5A3D] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Semaine
          </button>
          <button
            onClick={() => setViewMode("day")}
            className={`flex items-center gap-1.5 rounded-r-xl px-3 py-2 text-sm ${
              viewMode === "day"
                ? "bg-[#2D5A3D] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            Jour
          </button>
        </div>

        {/* Day selector (visible in day mode) */}
        {viewMode === "day" && (
          <div className="flex gap-1 rounded-xl border border-gray-100 bg-white px-1 py-1 shadow-sm">
            {["L", "M", "Me", "J", "V"].map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDayOffset(i)}
                className={`h-8 w-8 rounded-lg text-xs font-medium ${
                  selectedDayOffset === i
                    ? "bg-[#4A90A4] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Team filter */}
        <div className="relative">
          <button
            onClick={() => setShowTeamFilter(!showTeamFilter)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm shadow-sm ${
              selectedTeamIds.length > 0
                ? "border-[#4A90A4] bg-[#4A90A4]/5 text-[#4A90A4]"
                : "border-gray-100 bg-white text-gray-600"
            }`}
          >
            <Filter className="h-4 w-4" />
            Équipes
            {selectedTeamIds.length > 0 && ` (${selectedTeamIds.length})`}
          </button>
          {showTeamFilter && allTeams.length > 0 && (
            <div className="absolute top-full left-0 z-20 mt-1 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
              <button
                onClick={() => setSelectedTeamIds([])}
                className="w-full rounded-lg px-3 py-1.5 text-left text-sm text-gray-500 hover:bg-gray-50"
              >
                Toutes les équipes
              </button>
              {allTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setSelectedTeamIds((prev) =>
                      prev.includes(team.id)
                        ? prev.filter((id) => id !== team.id)
                        : [...prev, team.id]
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                  <span
                    className={
                      selectedTeamIds.includes(team.id) ? "font-medium" : ""
                    }
                  >
                    {team.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Generate button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          Générer un planning
        </motion.button>
      </div>

      {/* Weather bar */}
      <WeatherBar weekStart={weekStart} />

      {/* Schedule info */}
      {activeSchedule && (
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white/80 px-4 py-2 text-sm shadow-sm">
          <span className="font-medium text-gray-900">
            {activeSchedule.name}
          </span>
          <span className="text-gray-500">
            {activeSchedule.totalInterventions} interventions
          </span>
          <span className="text-gray-500">
            {activeSchedule.totalDistanceKm} km
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${
              activeSchedule.status === "active"
                ? "bg-green-100 text-green-700"
                : activeSchedule.status === "draft"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {activeSchedule.status === "draft"
              ? "Brouillon"
              : activeSchedule.status === "active"
                ? "Actif"
                : "Archivé"}
          </span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#4A90A4]" />
        </div>
      )}

      {/* No schedule */}
      {!loading && !activeSchedule && (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-lg">
          <CalendarDays className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-lg font-medium text-gray-900">
            Aucun planning pour cette semaine
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Générez un planning pour voir vos interventions
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGenerateModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2D5A3D] px-6 py-2.5 font-medium text-white"
          >
            <Sparkles className="h-5 w-5" />
            Générer un planning
          </motion.button>
        </div>
      )}

      {/* Calendar */}
      {!loading && activeSchedule && viewMode === "week" && (
        <WeekCalendar
          weekStart={weekStart}
          interventions={weekInterventions}
          onInterventionClick={setSelectedIntervention}
          onEmptySlotClick={handleEmptySlotClick}
        />
      )}

      {!loading && activeSchedule && viewMode === "day" && (
        <DayCalendar
          date={selectedDay}
          interventions={dayInterventions}
          selectedTeamIds={
            selectedTeamIds.length > 0 ? selectedTeamIds : undefined
          }
          onInterventionClick={setSelectedIntervention}
        />
      )}

      {/* Modals */}
      <GenerateScheduleModal
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerate}
      />

      {selectedIntervention && (
        <InterventionDetailModal
          intervention={selectedIntervention}
          teams={allTeams}
          onClose={() => setSelectedIntervention(null)}
          onUpdate={async (id, data) => {
            await updateIntervention(id, data as Record<string, string>);
          }}
          onDelete={async (id) => {
            await deleteIntervention(id);
          }}
        />
      )}

      {showAddModal && activeSchedule && (
        <AddInterventionModal
          open={showAddModal}
          defaultDate={addDefaultDate}
          defaultTime={addDefaultTime}
          teams={allTeams}
          scheduleId={activeSchedule.id}
          onClose={() => setShowAddModal(false)}
          onAdded={refresh}
        />
      )}
    </div>
  );
}
