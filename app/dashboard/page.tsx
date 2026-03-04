"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Client, Team, Schedule, DailyRoute } from "@/types/domain";
import { generateSchedule } from "@/lib/domain/scheduler";
import { getMockWeather } from "@/lib/services/weather";
import { format, startOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), { ssr: false });

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchTeams();
  }, []);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(data);
  };

  const generatePlanning = async () => {
    setIsLoading(true);
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = addDays(start, 6);

    const sched = await generateSchedule(
      {
        startDate: start,
        endDate: end,
        teams,
        equipment: [],
        clients,
        oneOffRequests: [],
        optimizationCriteria: "distance",
        maxDrivingTimePerDayMinutes: 120,
        allowWeekendWork: false,
        weatherBufferDays: 1,
      },
      async (_date, _loc) => getMockWeather(_date)
    );

    setSchedule(sched);
    setIsLoading(false);
  };

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getRoutesForDate = (date: Date): DailyRoute[] => {
    if (!schedule) return [];
    return schedule.routes.filter(
      (r) => format(r.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">
                {clients.length} clients • {teams.length} équipes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="border rounded-lg px-4 py-2"
              />
              <button
                onClick={generatePlanning}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? "Génération..." : "Générer planning"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {schedule && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Interventions" value={schedule.stats.totalInterventions} />
            <StatCard title="Distance" value={`${schedule.stats.totalDistanceKm} km`} />
            <StatCard title="Temps de route" value={`${schedule.stats.totalDrivingTimeHours}h`} />
            <StatCard title="Clients servis" value={schedule.stats.clientsServed} />
          </div>
        )}

        {/* Vue semaine */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-gray-200 border-b">
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`p-4 text-center ${
                  format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                    ? "bg-green-50"
                    : ""
                }`}
              >
                <div className="text-sm text-gray-500">
                  {format(day, "EEE", { locale: fr })}
                </div>
                <div className="font-bold text-lg">{format(day, "d")}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x divide-gray-200 min-h-[400px]">
            {weekDays.map((day) => {
              const routes = getRoutesForDate(day);
              return (
                <div key={day.toISOString()} className="p-2 space-y-2">
                  {routes.map((route) => {
                    const team = teams.find((t) => t.id === route.teamId);
                    return (
                      <div
                        key={route.teamId}
                        className="p-2 rounded text-sm"
                        style={{
                          backgroundColor: `${team?.color}20`,
                          borderLeft: `3px solid ${team?.color}`,
                        }}
                      >
                        <div className="font-medium" style={{ color: team?.color }}>
                          {team?.name}
                        </div>
                        <div className="text-gray-600">{route.interventions.length} tâches</div>
                        <div className="text-xs text-gray-500">{route.totalDistanceKm}km</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Carte */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-[400px]">
            <DashboardMap clients={clients} teams={teams} schedule={schedule} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
