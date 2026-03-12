"use client";

import { useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Schedule } from "@/types/domain";
import { generateSchedule } from "@/lib/domain/scheduler";
import { getMockWeather } from "@/lib/services/weather";
import { DEMO_CLIENTS, DEMO_TEAMS } from "@/lib/demo/mock-data";
import {
  MapPin,
  Zap,
  Clock,
  Route,
  CloudRain,
  CheckCircle2,
} from "lucide-react";

const clientIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzIyYzU1ZSI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface DemoState {
  schedule: Schedule | null;
  isGenerating: boolean;
  selectedDate: string;
}

export default function RouteOptimizerDemo() {
  const [state, setState] = useState<DemoState>({
    schedule: null,
    isGenerating: false,
    selectedDate: new Date().toISOString().split("T")[0],
  });

  const generatePlanning = useCallback(async () => {
    setState((s) => ({ ...s, isGenerating: true }));

    const startDate = new Date(state.selectedDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const schedule = await generateSchedule(
      {
        startDate,
        endDate,
        teams: DEMO_TEAMS,
        equipment: [],
        clients: DEMO_CLIENTS,
        oneOffRequests: [],
        optimizationCriteria: "distance",
        maxDrivingTimePerDayMinutes: 120,
        allowWeekendWork: false,
        weatherBufferDays: 1,
      },
      async (date) => getMockWeather(date)
    );

    setState((s) => ({ ...s, schedule, isGenerating: false }));
  }, [state.selectedDate]);

  const selectedDateRoutes =
    state.schedule?.routes.filter(
      (r) => r.date.toISOString().split("T")[0] === state.selectedDate
    ) || [];

  const stats = state.schedule?.stats;

  return (
    <div className="space-y-6">
      {/* Step 1: Clients on map */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] text-sm font-bold text-white">
            1
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Vos clients sur la carte</h3>
            <p className="text-sm text-gray-500">
              {DEMO_CLIENTS.length} clients avec contrats récurrents
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            {DEMO_CLIENTS.map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-[#E8F5EC] px-3 py-1 text-xs font-medium text-[#2D5A3D]"
              >
                {c.name.split(" - ")[0].split(" ").slice(0, 2).join(" ")}
              </span>
            ))}
          </div>
        </div>
        <div className="h-[400px]">
          <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {DEMO_CLIENTS.map((client) => (
              <Marker
                key={client.id}
                position={[client.location.lat, client.location.lng]}
                icon={clientIcon}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold">{client.name}</h3>
                    <p className="text-sm text-gray-600">
                      {client.location.address}
                    </p>
                    {client.contract && (
                      <div className="mt-2 text-sm">
                        <span className="rounded bg-green-100 px-2 py-1 text-green-800">
                          {client.contract.recurrence}
                        </span>
                        <span className="ml-2 text-gray-500">
                          {client.contract.durationMinutes}min
                        </span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedDateRoutes.map((route) => {
              const team = DEMO_TEAMS.find((t) => t.id === route.teamId);
              const positions = [
                [route.startLocation.lat, route.startLocation.lng],
                ...route.interventions
                  .map((i) => {
                    const client = DEMO_CLIENTS.find(
                      (c) => c.id === i.clientId
                    );
                    return client
                      ? [client.location.lat, client.location.lng]
                      : null;
                  })
                  .filter(Boolean),
              ];
              return (
                <Polyline
                  key={route.teamId}
                  positions={positions as [number, number][]}
                  color={team?.color || "#666"}
                  weight={4}
                  opacity={0.7}
                />
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Step 2: Generate */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] text-sm font-bold text-white">
            2
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Génération automatique</h3>
            <p className="text-sm text-gray-500">
              L&apos;algorithme optimise les trajets en tenant compte de la météo, des compétences et de la proximité
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Semaine du
            </label>
            <input
              type="date"
              value={state.selectedDate}
              onChange={(e) =>
                setState((s) => ({ ...s, selectedDate: e.target.value }))
              }
              className="rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
            />
          </div>
          <button
            onClick={generatePlanning}
            disabled={state.isGenerating}
            className="rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {state.isGenerating ? "Génération..." : "Générer le planning"}
            </span>
          </button>

          <div className="ml-auto flex gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CloudRain className="h-4 w-4 text-[#4A90A4]" />
              Météo vérifiée
            </span>
            <span className="flex items-center gap-1.5">
              <Route className="h-4 w-4 text-[#2D5A3D]" />
              Trajets optimisés
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#E07B39]" />
              Compétences assignées
            </span>
          </div>
        </div>
      </div>

      {/* Step 3: Results */}
      {state.schedule && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                label: "Interventions",
                value: stats?.totalInterventions ?? 0,
                icon: CheckCircle2,
                color: "from-[#2D5A3D] to-[#3D7A52]",
              },
              {
                label: "Distance totale",
                value: `${stats?.totalDistanceKm ?? 0} km`,
                icon: MapPin,
                color: "from-[#4A90A4] to-[#6BB3C7]",
              },
              {
                label: "Temps de route",
                value: `${stats?.totalDrivingTimeHours ?? 0}h`,
                icon: Clock,
                color: "from-[#E07B39] to-[#F5A572]",
              },
              {
                label: "Équipes mobilisées",
                value: stats?.teamsUtilized ?? 0,
                icon: Route,
                color: "from-[#8B5CF6] to-[#A78BFA]",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`rounded-lg bg-gradient-to-br ${s.color} p-2`}
                  >
                    <s.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-500">{s.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Detailed planning */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] text-sm font-bold text-white">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Planning détaillé
                </h3>
                <p className="text-sm text-gray-500">
                  Tournées optimisées pour le {state.selectedDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              {selectedDateRoutes.map((route) => {
                const team = DEMO_TEAMS.find((t) => t.id === route.teamId);
                return (
                  <div
                    key={route.teamId}
                    className="rounded-xl border border-gray-100 p-5"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: team?.color }}
                      />
                      <h4 className="text-lg font-bold">{team?.name}</h4>
                      <span className="ml-auto text-sm text-gray-500">
                        {route.totalDistanceKm}km ·{" "}
                        {Math.round(
                          (route.totalWorkTimeMinutes / 60) * 10
                        ) / 10}
                        h travail
                      </span>
                    </div>
                    <div className="space-y-3">
                      {route.interventions.map((intervention, idx) => {
                        const client = DEMO_CLIENTS.find(
                          (c) => c.id === intervention.clientId
                        );
                        return (
                          <div
                            key={intervention.id}
                            className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {client?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {intervention.estimatedStartTime} ·{" "}
                                {intervention.estimatedDurationMinutes}min
                                {intervention.estimatedTravelDistanceKm >
                                  0 && (
                                  <span className="ml-2 text-blue-600">
                                    (
                                    {
                                      intervention.estimatedTravelDistanceKm
                                    }
                                    km)
                                  </span>
                                )}
                              </div>
                              {intervention.weatherForecast && (
                                <div className="mt-1 text-xs">
                                  {intervention.weatherForecast.condition ===
                                  "rain" ? (
                                    <span className="text-orange-600">
                                      Pluie prévue
                                    </span>
                                  ) : intervention.weatherForecast
                                      .windSpeed > 25 ? (
                                    <span className="text-orange-600">
                                      Vent{" "}
                                      {
                                        intervention.weatherForecast
                                          .windSpeed
                                      }
                                      km/h
                                    </span>
                                  ) : (
                                    <span className="text-green-600">
                                      Météo OK
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {selectedDateRoutes.length === 0 && (
                <div className="col-span-2 py-8 text-center text-gray-500">
                  Aucune tournée planifiée pour cette date. Essayez un jour
                  ouvré.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
