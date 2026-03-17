"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ClipboardList,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { OneOffRequestModal } from "@/components/requests/OneOffRequestModal";
import { useToast } from "@/components/ui/Toast";
import { INTERVENTION_LABELS } from "@/lib/validation/onboarding";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface OneOffRequest {
  id: string;
  clientId: string;
  interventionType: string;
  description: string;
  durationEstimate: number;
  priority: number;
  status: string;
  preferredDateStart: string | null;
  preferredDateEnd: string | null;
  createdAt: string;
  client: { name: string; address: string };
}

const STATUS_TABS = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: "En attente" },
  { key: "scheduled", label: "Planifiees" },
  { key: "completed", label: "Terminees" },
  { key: "cancelled", label: "Annulees" },
] as const;

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700",
  },
  scheduled: {
    label: "Planifiee",
    className: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Terminee",
    className: "bg-green-100 text-green-700",
  },
  cancelled: {
    label: "Annulee",
    className: "bg-gray-100 text-gray-500",
  },
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-gray-200 text-gray-600",
  2: "bg-blue-100 text-blue-600",
  3: "bg-amber-100 text-amber-600",
  4: "bg-orange-100 text-orange-600",
  5: "bg-red-100 text-red-600",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DemandesPage() {
  const toast = useToast();
  const [requests, setRequests] = useState<OneOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<OneOffRequest | null>(
    null
  );

  const fetchRequests = useCallback(async () => {
    try {
      const statusParam = activeTab === "all" ? "" : `?status=${activeTab}`;
      const res = await fetch(`/api/one-off-requests${statusParam}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch {
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  }, [activeTab, toast]);

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/one-off-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur serveur");
      }
      toast.success(
        status === "scheduled"
          ? "Demande planifiee"
          : status === "completed"
            ? "Demande terminee"
            : "Demande annulee"
      );
      fetchRequests();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la mise a jour";
      toast.error(message);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/one-off-requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur serveur");
      }
      toast.success("Demande supprimee");
      fetchRequests();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast.error(message);
    }
  };

  const handleModalSave = () => {
    setModalOpen(false);
    setEditingRequest(null);
    fetchRequests();
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingRequest(null);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Demandes ponctuelles
            </h1>
            <p className="mt-1 text-gray-500">
              Gerez les demandes d&apos;intervention hors contrat
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/planning"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              Planning
            </Link>
            <motion.button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#2D5A3D]/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              Nouvelle demande
            </motion.button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#2D5A3D] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2D5A3D] border-t-transparent" />
          </div>
        ) : requests.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ClipboardList className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-600">
              Aucune demande
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              {activeTab === "all"
                ? "Creez votre premiere demande ponctuelle"
                : "Aucune demande avec ce statut"}
            </p>
            {activeTab === "all" && (
              <motion.button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-5 py-2.5 text-sm font-medium text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-4 w-4" />
                Nouvelle demande
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {requests.map((req, index) => {
                const badge = STATUS_BADGES[req.status] ?? STATUS_BADGES.pending;
                const priorityColor =
                  PRIORITY_COLORS[req.priority] ?? PRIORITY_COLORS[1];

                return (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="mb-3 flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-900">
                          {req.client.name}
                        </h3>
                        <p className="truncate text-sm text-gray-500">
                          {INTERVENTION_LABELS[req.interventionType] ??
                            req.interventionType}
                        </p>
                      </div>
                      <span
                        className={`ml-2 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {req.description}
                    </p>

                    {/* Meta */}
                    <div className="mb-4 flex flex-wrap gap-2 text-xs">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-3 w-3" />
                        {req.durationEstimate} min
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${priorityColor}`}
                      >
                        P{req.priority}
                      </span>
                      {req.preferredDateStart && (
                        <span className="text-gray-500">
                          {formatDate(req.preferredDateStart)}
                          {req.preferredDateEnd &&
                            ` - ${formatDate(req.preferredDateEnd)}`}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-gray-50 pt-3">
                      {req.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(req.id, "scheduled")}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[#4A90A4] transition-colors hover:bg-[#4A90A4]/10"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Planifier
                          </button>
                          <button
                            onClick={() => updateStatus(req.id, "cancelled")}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100"
                          >
                            <XCircle className="h-3 w-3" />
                            Annuler
                          </button>
                        </>
                      )}
                      {req.status === "scheduled" && (
                        <button
                          onClick={() => updateStatus(req.id, "completed")}
                          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-50"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Terminer
                        </button>
                      )}
                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Modal */}
        {(modalOpen || editingRequest) && (
          <OneOffRequestModal
            request={editingRequest}
            onClose={handleModalClose}
            onSave={handleModalSave}
          />
        )}
      </div>
    </AdminLayout>
  );
}
