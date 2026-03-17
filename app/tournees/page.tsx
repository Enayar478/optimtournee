"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Circle,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipForward,
  Loader2,
  RefreshCw,
  XCircle,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

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

interface TourneeIntervention {
  id: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string | null;
  interventionType: string;
  estimatedStartTime: string;
  estimatedDurationMinutes: number;
  status: string;
  routeOrder: number;
  weatherCondition?: string;
  weatherTemperature?: number;
  scheduleId?: string;
}

interface Tournee {
  id: string;
  nom: string;
  equipe: string;
  couleur: string;
  clients: number;
  km: number;
  heureDebut: string;
  statut: string;
  interventions: TourneeIntervention[];
}

function ProgressBar({ interventions, color }: { interventions: TourneeIntervention[]; color: string }) {
  const total = interventions.length;
  const completed = interventions.filter((i) => i.status === "completed").length;
  const inProgress = interventions.filter((i) => i.status === "in_progress").length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="px-6 pb-3">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>{completed}/{total} terminés{inProgress > 0 ? ` · ${inProgress} en cours` : ""}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

function TourneesContent() {
  const toast = useToast();
  const [tournees, setTournees] = useState<Tournee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchTournees();
  }, []);

  const fetchTournees = async () => {
    try {
      const res = await fetch("/api/tournees");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setTournees(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erreur lors du chargement des tournées");
      setTournees([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTournees();
  };

  const updateStatus = async (interventionId: string, status: string) => {
    if (status === "postponed" && !confirm("Reporter cette intervention ?")) return;
    if (status === "cancelled" && !confirm("Annuler cette intervention ?")) return;

    setUpdatingStatus(interventionId);
    try {
      const res = await fetch(`/api/interventions/${interventionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur serveur");
      }
      toast.success("Statut mis à jour");
      await fetchTournees();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur mise à jour statut");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-3xl font-bold text-transparent">
            Tournées du jour
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Rafraîchir
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#4A90A4]" />
        </div>
      ) : tournees.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-lg">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-lg font-medium text-gray-900">
            Aucune tournée planifiée pour aujourd&apos;hui
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Les tournées apparaissent ici lorsque des interventions sont planifiées.
          </p>
          <Link
            href="/planning"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-6 py-3 font-medium text-white shadow-lg"
          >
            <Calendar className="h-5 w-5" />
            Aller au planning
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tournees.map((tournee, index) => {
            const isExpanded = expandedTeam === tournee.id;
            return (
              <motion.div
                key={tournee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-xl"
              >
                {/* Team header */}
                <button
                  onClick={() =>
                    setExpandedTeam(isExpanded ? null : tournee.id)
                  }
                  className="flex w-full items-center justify-between p-6"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="rounded-xl p-3"
                      style={{
                        backgroundColor: `${tournee.couleur}15`,
                        color: tournee.couleur,
                      }}
                    >
                      {tournee.statut === "active" ? (
                        <Circle className="h-6 w-6 animate-pulse" />
                      ) : tournee.statut === "terminee" ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Clock className="h-6 w-6" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{tournee.nom}</h3>
                      <p className="text-muted-foreground text-sm">
                        {tournee.equipe} · {tournee.heureDebut}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{tournee.clients}</p>
                      <p className="text-muted-foreground text-xs">clients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{tournee.km} km</p>
                      <p className="text-muted-foreground text-xs">distance</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Progress bar */}
                <ProgressBar interventions={tournee.interventions} color={tournee.couleur} />

                {/* Expanded interventions */}
                {isExpanded && tournee.interventions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-gray-100"
                  >
                    <div className="divide-y divide-gray-50">
                      {tournee.interventions
                        .sort((a, b) => a.routeOrder - b.routeOrder)
                        .map((intervention, idx) => {
                          const badge = STATUS_BADGE[intervention.status];
                          const isUpdating = updatingStatus === intervention.id;
                          return (
                            <div
                              key={intervention.id}
                              className="flex items-center gap-4 px-6 py-4"
                            >
                              {/* Route number */}
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                                style={{ backgroundColor: tournee.couleur }}
                              >
                                {idx + 1}
                              </div>

                              {/* Info */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">
                                    {intervention.clientName}
                                  </span>
                                  <span
                                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${badge?.class}`}
                                  >
                                    {badge?.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span>
                                    {intervention.estimatedStartTime} -{" "}
                                    {TYPE_LABELS[intervention.interventionType] ?? intervention.interventionType}
                                  </span>
                                  <span>{intervention.estimatedDurationMinutes} min</span>
                                </div>
                                <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {intervention.clientAddress}
                                  </span>
                                  {intervention.clientPhone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {intervention.clientPhone}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Quick status buttons */}
                              <div className="flex shrink-0 gap-1">
                                {isUpdating ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                ) : (
                                  <>
                                    {intervention.status === "planned" && (
                                      <>
                                        <button
                                          onClick={() => updateStatus(intervention.id, "in_progress")}
                                          className="rounded-lg bg-amber-50 p-1.5 text-amber-600 hover:bg-amber-100"
                                          title="Démarrer"
                                        >
                                          <Play className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => updateStatus(intervention.id, "cancelled")}
                                          className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                                          title="Annuler"
                                        >
                                          <XCircle className="h-4 w-4" />
                                        </button>
                                      </>
                                    )}
                                    {intervention.status === "in_progress" && (
                                      <>
                                        <button
                                          onClick={() => updateStatus(intervention.id, "completed")}
                                          className="rounded-lg bg-green-50 p-1.5 text-green-600 hover:bg-green-100"
                                          title="Terminer"
                                        >
                                          <CheckCircle2 className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => updateStatus(intervention.id, "postponed")}
                                          className="rounded-lg bg-gray-50 p-1.5 text-gray-600 hover:bg-gray-100"
                                          title="Reporter"
                                        >
                                          <SkipForward className="h-4 w-4" />
                                        </button>
                                      </>
                                    )}
                                    {(intervention.status === "completed" ||
                                      intervention.status === "postponed" ||
                                      intervention.status === "cancelled") && (
                                      <button
                                        onClick={() => updateStatus(intervention.id, "planned")}
                                        className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100"
                                        title="Replanifier"
                                      >
                                        <Pause className="h-4 w-4" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TourneesPage() {
  return (
    <AdminLayout>
      <TourneesContent />
    </AdminLayout>
  );
}
