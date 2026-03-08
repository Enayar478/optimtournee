"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Client, Team, Schedule, DailyRoute } from "@/types/domain";
import { generateSchedule } from "@/lib/domain/scheduler";
import { getMockWeather } from "@/lib/services/weather";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Route, 
  Clock, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Navigation,
  Zap,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Thermometer,
  Maximize2,
  Minimize2,
  Filter,
  MoreVertical
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Dynamic import for map (no SSR)
const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gradient-to-br from-forest-surface/30 to-sky-surface/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-forest/20 border-t-forest rounded-full animate-spin" />
        <span className="text-forest font-medium">Chargement de la carte...</span>
      </div>
    </div>
  )
});

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Team colors with gradients
const TEAM_COLORS = [
  { base: "#22c55e", gradient: "from-green-500 to-emerald-600", bg: "bg-green-500", light: "bg-green-100", text: "text-green-700" },
  { base: "#3b82f6", gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-700" },
  { base: "#f59e0b", gradient: "from-amber-500 to-orange-600", bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-700" },
  { base: "#ef4444", gradient: "from-red-500 to-rose-600", bg: "bg-red-500", light: "bg-red-100", text: "text-red-700" },
  { base: "#8b5cf6", gradient: "from-violet-500 to-purple-600", bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-700" },
  { base: "#14b8a6", gradient: "from-teal-500 to-cyan-600", bg: "bg-teal-500", light: "bg-teal-100", text: "text-teal-700" },
];

// Weather icon component
function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  switch (condition) {
    case "sunny": return <Sun className={className} />;
    case "rainy": return <CloudRain className={className} />;
    case "windy": return <Wind className={className} />;
    default: return <Droplets className={className} />;
  }
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"planning" | "map" | "stats">("planning");
  const [showWeather, setShowWeather] = useState(true);

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
    // Assign colors to teams
    const teamsWithColors = data.map((t: Team, i: number) => ({
      ...t,
      color: t.color || TEAM_COLORS[i % TEAM_COLORS.length].base,
    }));
    setTeams(teamsWithColors);
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
  const weekDays = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const getRoutesForDate = (date: Date): DailyRoute[] => {
    if (!schedule) return [];
    return schedule.routes.filter(
      (r) => format(r.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const currentWeather = useMemo(() => getMockWeather(selectedDate), [selectedDate]);

  const stats = useMemo(() => {
    if (!schedule) return null;
    return {
      totalInterventions: schedule.stats.totalInterventions,
      totalDistance: schedule.stats.totalDistanceKm,
      totalTime: schedule.stats.totalDrivingTimeHours,
      clientsServed: schedule.stats.clientsServed,
      co2Saved: Math.round(schedule.stats.totalDistanceKm * 0.12 * 0.2), // 20% optimization
    };
  }, [schedule]);

  // Filter routes by selected team
  const filteredRoutes = useMemo(() => {
    if (!schedule) return null;
    if (!selectedTeam) return schedule;
    return {
      ...schedule,
      routes: schedule.routes.filter(r => r.teamId === selectedTeam)
    };
  }, [schedule, selectedTeam]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-forest-surface/20">
      {/* Floating Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5"
      >
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-forest to-forest-dark rounded-xl flex items-center justify-center shadow-lg shadow-forest/20"
            >
              <Navigation className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-forest to-forest-light bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                {clients.length} clients • {teams.length} équipes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Date Navigation */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1">
              <button 
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                className="p-2 hover:bg-white rounded-lg transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-medium text-slate-700">
                {format(weekStart, "MMMM yyyy", { locale: fr })}
              </span>
              <button 
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="p-2 hover:bg-white rounded-lg transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePlanning}
              disabled={isLoading}
              className={cn(
                "flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all",
                isLoading 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-forest to-forest-light hover:shadow-forest/30 hover:shadow-xl"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Optimisation...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Optimiser</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20 pb-6 px-4 lg:px-6">
        <div className={cn(
          "grid gap-4 lg:gap-6 transition-all duration-500",
          isMapExpanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
        )}>
          
          {/* Left Panel - Stats & Planning */}
          <AnimatePresence mode="wait">
            {!isMapExpanded && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-4 xl:col-span-3 space-y-4 lg:space-y-6"
              >
                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard 
                      icon={Route} 
                      label="Distance" 
                      value={`${stats.totalDistance} km`}
                      trend="-20%"
                      color="forest"
                    />
                    <StatCard 
                      icon={Clock} 
                      label="Temps" 
                      value={`${stats.totalTime}h`}
                      trend="-15%"
                      color="sky"
                    />
                    <StatCard 
                      icon={Users} 
                      label="Clients" 
                      value={stats.clientsServed}
                      color="economy"
                    />
                    <StatCard 
                      icon={Wind} 
                      label="CO₂ économisé" 
                      value={`${stats.co2Saved} kg`}
                      color="teal"
                    />
                  </div>
                )}

                {/* Weather Widget */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-4 text-white shadow-lg shadow-sky/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sky-100 text-sm">Météo aujourd&apos;hui</p>
                      <p className="text-2xl font-bold">{currentWeather.temperature}°C</p>
                      <p className="text-sm text-sky-100 capitalize">{currentWeather.condition}</p>
                    </div>
                    <WeatherIcon 
                      condition={currentWeather.condition} 
                      className="w-12 h-12 text-white/90" 
                    />
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20 flex gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      {currentWeather.rainProbability || 0}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3" />
                      {currentWeather.windSpeed} km/h
                    </span>
                  </div>
                </motion.div>

                {/* Teams Filter */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-forest" />
                      Équipes
                    </h3>
                    {selectedTeam && (
                      <button 
                        onClick={() => setSelectedTeam(null)}
                        className="text-xs text-forest hover:underline"
                      >
                        Tout voir
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {teams.map((team, idx) => {
                      const color = TEAM_COLORS[idx % TEAM_COLORS.length];
                      const isSelected = selectedTeam === team.id;
                      return (
                        <motion.button
                          key={team.id}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedTeam(isSelected ? null : team.id)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                            isSelected 
                              ? color.light + " ring-2 ring-offset-1" 
                              : "hover:bg-slate-50"
                          )}
                          style={{ 
                          }}
                        >
                          <div 
                            className={cn("w-3 h-3 rounded-full", color.bg)}
                            style={{ backgroundColor: team.color }}
                          />
                          <span className={cn(
                            "flex-1 text-left font-medium",
                            isSelected ? color.text : "text-slate-700"
                          )}>
                            {team.name}
                          </span>
                          {isSelected && <Zap className="w-4 h-4" style={{ color: team.color }} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Weekly Calendar */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-forest" />
                    Semaine du {format(weekStart, "d MMM", { locale: fr })}
                  </h3>
                  <div className="space-y-2">
                    {weekDays.map((day) => {
                      const routes = getRoutesForDate(day);
                      const isToday = isSameDay(day, new Date());
                      return (
                        <motion.div
                          key={day.toISOString()}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "p-3 rounded-xl cursor-pointer transition-all",
                            isToday 
                              ? "bg-forest-surface ring-1 ring-forest/20" 
                              : "hover:bg-slate-50",
                            isSameDay(day, selectedDate) && "ring-2 ring-forest"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                                isToday ? "bg-forest text-white" : "bg-slate-100 text-slate-600"
                              )}>
                                {format(day, "d")}
                              </span>
                              <span className={cn(
                                "text-sm font-medium",
                                isToday ? "text-forest" : "text-slate-600"
                              )}>
                                {format(day, "EEEE", { locale: fr })}
                              </span>
                            </div>
                            {routes.length > 0 && (
                              <span className="text-xs font-medium text-forest bg-forest-surface px-2 py-1 rounded-full">
                                {routes.reduce((acc, r) => acc + r.interventions.length, 0)} tâches
                              </span>
                            )}
                          </div>
                          {routes.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {routes.map((route, idx) => {
                                const team = teams.find(t => t.id === route.teamId);
                                return (
                                  <span
                                    key={route.teamId}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: team?.color || TEAM_COLORS[idx].base }}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Panel - Map */}
          <motion.div 
            layout
            className={cn(
              "relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500",
              isMapExpanded ? "h-[calc(100vh-100px)]" : "lg:col-span-8 xl:col-span-9 h-[600px] lg:h-[calc(100vh-120px)]"
            )}
          >
            {/* Map Controls */}
            <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMapExpanded(!isMapExpanded)}
                  className="bg-white/90 backdrop-blur shadow-lg p-2.5 rounded-xl hover:bg-white transition-all"
                >
                  {isMapExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWeather(!showWeather)}
                  className={cn(
                    "shadow-lg p-2.5 rounded-xl transition-all",
                    showWeather ? "bg-sky text-white" : "bg-white/90 backdrop-blur"
                  )}
                >
                  <CloudRain className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Quick Stats Overlay */}
              {stats && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hidden lg:flex items-center gap-4 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-lg pointer-events-auto"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-forest/10 rounded-lg flex items-center justify-center">
                      <Route className="w-4 h-4 text-forest" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Distance</p>
                      <p className="text-sm font-bold">{stats.totalDistance} km</p>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-economy/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-economy" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Économie</p>
                      <p className="text-sm font-bold text-economy">-20%</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Map Component */}
            <DashboardMap 
              clients={clients} 
              teams={teams} 
              schedule={filteredRoutes}
              showWeather={showWeather}
              teamColors={TEAM_COLORS}
            />

            {/* Bottom Legend */}
            <div className="absolute bottom-4 left-4 right-4 z-[400]">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-medium text-slate-600">Légende:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-forest" />
                    <span className="text-sm text-slate-600">Client</span>
                  </div>
                  {teams.slice(0, 4).map((team, idx) => (
                    <div key={team.id} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-1 rounded-full"
                        style={{ backgroundColor: team.color || TEAM_COLORS[idx].base }}
                      />
                      <span className="text-sm text-slate-600">{team.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Enhanced Stat Card Component
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
  trend?: string;
  color: "forest" | "sky" | "economy" | "teal";
}) {
  const colorClasses = {
    forest: "from-forest/10 to-forest/5 text-forest",
    sky: "from-sky/10 to-sky/5 text-sky",
    economy: "from-economy/10 to-economy/5 text-economy",
    teal: "from-teal/10 to-teal/5 text-teal",
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "bg-gradient-to-br rounded-2xl p-4 shadow-sm border border-white/50",
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm",
          color === "forest" && "text-forest",
          color === "sky" && "text-sky",
          color === "economy" && "text-economy",
          color === "teal" && "text-teal",
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-xs font-bold bg-white/80 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm opacity-70">{label}</p>
      </div>
    </motion.div>
  );
}
