import { useState, useEffect, useCallback } from "react";

export interface InterventionDetail {
  id: string;
  scheduleId: string;
  sourceType: string;
  clientId: string;
  interventionType: string;
  scheduledDate: string;
  estimatedStartTime: string;
  estimatedDurationMinutes: number;
  assignedTeamId: string;
  assignedEquipment: string[];
  status: string;
  routeOrder: number;
  estimatedTravelTimeMinutes: number;
  estimatedTravelDistanceKm: number;
  notes: string | null;
  weatherTemperature: number | null;
  weatherWindSpeed: number | null;
  weatherCondition: string | null;
  weatherIsSuitable: boolean | null;
  client: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    contactPhone: string | null;
  };
  team: {
    id: string;
    name: string;
    color: string;
  };
}

export interface ScheduleDetail {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  totalInterventions: number;
  interventions: InterventionDetail[];
}

export function usePlanning(scheduleId: string | null) {
  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    if (!scheduleId) {
      setSchedule(null);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/schedules/${scheduleId}`);
      if (!res.ok) throw new Error("Erreur chargement planning");
      const data = await res.json();
      setSchedule(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const updateIntervention = useCallback(
    async (
      interventionId: string,
      data: {
        assignedTeamId?: string;
        estimatedStartTime?: string;
        status?: string;
        notes?: string;
      }
    ) => {
      if (!scheduleId) return;
      const res = await fetch(
        `/api/schedules/${scheduleId}/interventions/${interventionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Erreur mise à jour intervention");
      await fetchSchedule();
    },
    [scheduleId, fetchSchedule]
  );

  const deleteIntervention = useCallback(
    async (interventionId: string) => {
      if (!scheduleId) return;
      const res = await fetch(
        `/api/schedules/${scheduleId}/interventions/${interventionId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Erreur suppression intervention");
      await fetchSchedule();
    },
    [scheduleId, fetchSchedule]
  );

  // Grouper par date
  const interventionsByDate = schedule?.interventions.reduce(
    (acc, intervention) => {
      const dateKey = intervention.scheduledDate.split("T")[0];
      const existing = acc.get(dateKey) ?? [];
      acc.set(dateKey, [...existing, intervention]);
      return acc;
    },
    new Map<string, InterventionDetail[]>()
  );

  // Grouper par équipe
  const interventionsByTeam = schedule?.interventions.reduce(
    (acc, intervention) => {
      const teamId = intervention.assignedTeamId;
      const existing = acc.get(teamId) ?? [];
      acc.set(teamId, [...existing, intervention]);
      return acc;
    },
    new Map<string, InterventionDetail[]>()
  );

  // Extraire les équipes uniques
  const teams = schedule
    ? Array.from(
        new Map(
          schedule.interventions.map((i) => [i.team.id, i.team])
        ).values()
      )
    : [];

  return {
    schedule,
    loading,
    error,
    interventionsByDate: interventionsByDate ?? new Map(),
    interventionsByTeam: interventionsByTeam ?? new Map(),
    teams,
    updateIntervention,
    deleteIntervention,
    refresh: fetchSchedule,
  };
}
