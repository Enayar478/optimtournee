"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import { Client, Team, Schedule, DailyRoute } from "@/types/domain";
import { generateSchedule } from "@/lib/domain/scheduler";
import { getMockWeather } from "@/lib/services/weather";
import { format, startOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const clientIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzIyYzU1ZSI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("week");
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
      async (date, loc) => getMockWeather(date)
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
                        style={{ backgroundColor: `${team?.color}20`, borderLeft: `3px solid ${team?.color}` }}
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
            <MapContainer center={[48.8566, 2.3522]} zoom={12} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {clients.map((c) => (
                <Marker key={c.id} position={[c.location.lat, c.location.lng]} icon={clientIcon}>
                  <Popup>{c.name}</Popup>
                </Marker>
              ))}
              {schedule?.routes.map((route, idx) => {
                const team = teams.find((t) => t.id === route.teamId);
                const positions = route.interventions.map((i) => {
                  const client = clients.find((c) => c.id === i.clientId);
                  return client ? [client.location.lat, client.location.lng] : null;
                }).filter(Boolean) as [number, number][];
                
                return (
                  <Polyline
                    key={route.teamId}
                    positions={positions}
                    color={team?.color || COLORS[idx % COLORS.length]}
                    weight={3}
                  />
                );
              })}
            </MapContainer>
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
