"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Client, Team, Schedule, DailyRoute } from "@/types/domain";
import { generateSchedule } from "@/lib/domain/scheduler";
import { getMockWeather } from "@/lib/services/weather";
import { format, startOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Users, Calendar, Route, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), { ssr: false });

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchClients();
    fetchTeams();
  }, []);

  useEffect(() => {
    if (schedule) {
      setSelectedDay(new Date());
    }
  }, [schedule]);

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

  const selectedRoutes = selectedDay ? getRoutesForDate(selectedDay) : [];

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header moderne */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-2 rounded-xl shadow-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {clients.length} clients</span>
              <span className="text-gray-300">•</span>
              <span>{teams.length} équipes</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              className="p-2 hover:bg-white rounded-md transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="bg-transparent border-none text-sm font-medium px-2 py-1 focus:outline-none"
            />
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              className="p-2 hover:bg-white rounded-md transition-all duration-200 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={generatePlanning}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Génération...
              </>
            ) : (
              <><Calendar className="w-4 h-4" /> Générer</>
            )}
          </button>
        </div>
      </header>

      {/* Stats rapides */}
      {schedule && (
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6 overflow-x-auto shrink-0">
          <StatBadge icon={Calendar} label="Interventions" value={schedule.stats.totalInterventions} color="blue" />
          <StatBadge icon={Route} label="Distance" value={`${schedule.stats.totalDistanceKm} km`} color="green" />
          <StatBadge icon={Clock} label="Conduite" value={`${schedule.stats.totalDrivingTimeHours}h`} color="orange" />
          <StatBadge icon={Users} label="Clients" value={schedule.stats.clientsServed} color="purple" />
        </div>
      )}

      {/* Layout principal : Carte 70% + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Carte plein écran - 70% */}
        <div className={`transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-[70%]' : 'w-full'}`}>
          <div className="h-full relative">
            <DashboardMap 
              clients={clients} 
              teams={teams} 
              schedule={schedule} 
              selectedDay={selectedDay}
              onDaySelect={setSelectedDay}
            />
            
            {/* Bouton toggle sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg hover:bg-white transition-all duration-200"
            >
              {sidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sidebar planning - 30% */}
        {sidebarOpen && (
          <div className="w-[30%] bg-white border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Sélecteur de semaine */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Semaine du {format(weekStart, "d MMM", { locale: fr })}</h3>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => {
                  const isSelected = selectedDay && format(day, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd");
                  const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                  const routes = getRoutesForDate(day);
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDay(day)}
                      className={`p-2 rounded-xl text-center transition-all duration-200 ${
                        isSelected 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105' 
                          : isToday 
                            ? 'bg-green-50 text-green-700 border-2 border-green-200' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="text-xs opacity-70">{format(day, "EEE", { locale: fr })}</div>
                      <div className="font-bold text-lg">{format(day, "d")}</div>
                      {routes.length > 0 && (
                        <div className={`text-[10px] mt-1 ${isSelected ? 'text-white/80' : 'text-green-600'}`}>
                          {routes.reduce((acc, r) => acc + r.interventions.length, 0)} tâches
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Détail du jour sélectionné */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedDay ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      {format(selectedDay, "EEEE d MMMM", { locale: fr })}
                    </h4>
                  </div>
                  
                  {selectedRoutes.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      Aucune intervention ce jour
                    </div>
                  ) : (
                    selectedRoutes.map((route) => {
                      const team = teams.find((t) => t.id === route.teamId);
                      return (
                        <div
                          key={route.teamId}
                          className="rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-lg"
                          style={{ borderColor: team?.color }}
                        >
                          <div 
                            className="p-3 text-white font-semibold flex items-center justify-between"
                            style={{ backgroundColor: team?.color }}
                          >
                            <span>{team?.name}</span>
                            <span className="text-sm opacity-80">{route.interventions.length} tâches</span>
                          </div>
                          
                          <div className="p-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Route className="w-4 h-4" />
                              {route.totalDistanceKm} km • {Math.round(route.totalDrivingTimeMinutes / 60 * 10) / 10}h de route
                            </div>
                            
                            <div className="space-y-1 mt-2">
                              {route.interventions.map((intervention, idx) => {
                                const client = clients.find((c) => c.id === intervention.clientId);
                                return (
                                  <div
                                    key={intervention.id}
                                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 text-sm"
                                  >
                                    <div 
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                      style={{ backgroundColor: team?.color }}
                                    >
                                      {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">{client?.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {intervention.estimatedStartTime} • {intervention.estimatedDurationMinutes}min
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  Sélectionnez un jour pour voir le détail
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBadge({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
  color: "blue" | "green" | "orange" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${colors[color]} shrink-0`}>
      <Icon className="w-5 h-5 opacity-70" />
      <div>
        <div className="text-xs opacity-70">{label}</div>
        <div className="font-bold text-lg">{value}</div>
      </div>
    </div>
  );
}
