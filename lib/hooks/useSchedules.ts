import { useState, useEffect, useCallback } from "react";

export interface ScheduleSummary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  totalInterventions: number;
  totalDistanceKm: number;
  totalDrivingTimeHours: number;
  clientsServed: number;
  teamsUtilized: number;
  createdAt: string;
  _count: { interventions: number };
}

export function useSchedules() {
  const [schedules, setSchedules] = useState<ScheduleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/schedules");
      if (!res.ok) throw new Error("Erreur chargement schedules");
      const data = await res.json();
      setSchedules(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const generateSchedule = useCallback(
    async (startDate: string, endDate: string, name?: string) => {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, name }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erreur génération");
      }
      const schedule = await res.json();
      await fetchSchedules();
      return schedule;
    },
    [fetchSchedules]
  );

  const deleteSchedule = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      await fetchSchedules();
    },
    [fetchSchedules]
  );

  const updateScheduleStatus = useCallback(
    async (id: string, status: string) => {
      const res = await fetch(`/api/schedules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erreur mise à jour");
      await fetchSchedules();
    },
    [fetchSchedules]
  );

  return {
    schedules,
    loading,
    error,
    generateSchedule,
    deleteSchedule,
    updateScheduleStatus,
    refresh: fetchSchedules,
  };
}
