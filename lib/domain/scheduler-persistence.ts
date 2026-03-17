/**
 * Pont entre le scheduler in-memory et la base de données Prisma.
 * Charge les données, exécute le scheduler, puis persiste les résultats.
 */

import { prisma } from "@/lib/prisma";
import type {
  Team,
  Client,
  OneOffRequest,
  Schedule as DomainSchedule,
  SchedulingConstraints,
  WeatherForecast,
  GeoLocation,
} from "@/types/domain";
import { generateSchedule } from "./scheduler";
import { fetchWeatherForecast } from "@/lib/services/weather";

/**
 * Charge toutes les données nécessaires au scheduling depuis Prisma
 */
export async function loadSchedulingData(userId: string): Promise<{
  teams: Team[];
  clients: Client[];
  oneOffRequests: OneOffRequest[];
}> {
  const [dbTeams, dbClients, dbOneOffRequests] = await Promise.all([
    prisma.team.findMany({
      where: { userId },
      include: { members: true },
    }),
    prisma.client.findMany({
      where: { userId },
      include: { contract: true },
    }),
    prisma.oneOffRequest.findMany({
      where: { userId, status: "pending" },
    }),
  ]);

  const teams: Team[] = dbTeams.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
    members: t.members.map((m) => ({
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      phone: m.phone ?? undefined,
      licenseTypes: m.licenseTypes,
    })),
    assignedEquipment: t.assignedEquipment as Team["assignedEquipment"],
    defaultStartLocation: {
      lat: t.defaultStartLat ?? 48.8566,
      lng: t.defaultStartLng ?? 2.3522,
      address: t.defaultStartAddress ?? "",
    },
    skills: t.skills as Team["skills"],
    unavailableDates: t.unavailableDates,
    workSchedule: {
      startTime: t.workScheduleStart,
      endTime: t.workScheduleEnd,
      lunchBreakMinutes: t.lunchBreakMinutes,
      workingDays: t.workingDays,
    },
  }));

  const clients: Client[] = dbClients.map((c) => ({
    id: c.id,
    name: c.name,
    location: { lat: c.lat, lng: c.lng, address: c.address },
    contactPhone: c.contactPhone ?? undefined,
    contactEmail: c.contactEmail ?? undefined,
    notes: c.notes ?? undefined,
    contract: c.contract
      ? {
          id: c.contract.id,
          clientId: c.contract.clientId,
          recurrence: c.contract.recurrence as NonNullable<
            Client["contract"]
          >["recurrence"],
          dayOfWeek: c.contract.dayOfWeek,
          durationMinutes: c.contract.durationMinutes,
          interventionType: c.contract.interventionType as NonNullable<
            Client["contract"]
          >["interventionType"],
          requiredEquipment: c.contract.requiredEquipment as NonNullable<
            Client["contract"]
          >["requiredEquipment"],
          weatherConstraints: {
            maxWindSpeed: c.contract.maxWindSpeed,
            noRainForecast: c.contract.noRainForecast,
            minTemperature: c.contract.minTemperature,
            maxTemperature: c.contract.maxTemperature,
          },
          startDate: c.contract.startDate,
          endDate: c.contract.endDate ?? undefined,
          priority: c.contract.priority,
        }
      : undefined,
  }));

  const oneOffRequests: OneOffRequest[] = dbOneOffRequests.map((r) => ({
    id: r.id,
    clientId: r.clientId,
    requestDate: r.requestDate,
    preferredDateStart: r.preferredDateStart ?? undefined,
    preferredDateEnd: r.preferredDateEnd ?? undefined,
    interventionType: r.interventionType as OneOffRequest["interventionType"],
    description: r.description,
    durationEstimate: r.durationEstimate,
    requiredEquipment:
      r.requiredEquipment as OneOffRequest["requiredEquipment"],
    priority: r.priority,
    weatherConstraints: {
      maxWindSpeed: r.maxWindSpeed,
      noRainForecast: r.noRainForecast,
      minTemperature: r.minTemperature,
      maxTemperature: r.maxTemperature,
    },
    status: r.status as OneOffRequest["status"],
  }));

  return { teams, clients, oneOffRequests };
}

/**
 * Génère et persiste un schedule complet dans une transaction Prisma
 */
export async function generateAndPersistSchedule(
  userId: string,
  startDate: Date,
  endDate: Date,
  name?: string
): Promise<string> {
  const { teams, clients, oneOffRequests } = await loadSchedulingData(userId);

  // Charger les préférences utilisateur
  const prefs = await prisma.schedulingPreferences.findUnique({
    where: { userId },
  });

  const constraints: SchedulingConstraints = {
    startDate,
    endDate,
    teams,
    clients,
    oneOffRequests,
    equipment: [],
    optimizationCriteria: (prefs?.optimizationCriteria ??
      "balanced") as SchedulingConstraints["optimizationCriteria"],
    maxDrivingTimePerDayMinutes: prefs?.maxDrivingTimePerDay ?? 120,
    allowWeekendWork: prefs?.allowWeekendWork ?? false,
    weatherBufferDays: prefs?.weatherBufferDays ?? 1,
  };

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const weatherProvider = async (
    date: Date,
    loc: GeoLocation
  ): Promise<WeatherForecast | undefined> => {
    if (!apiKey) return undefined;
    return fetchWeatherForecast(loc.lat, loc.lng, apiKey);
  };

  const domainSchedule: DomainSchedule = await generateSchedule(
    constraints,
    weatherProvider
  );

  const scheduleName =
    name ??
    `Planning ${startDate.toLocaleDateString("fr-FR")} - ${endDate.toLocaleDateString("fr-FR")}`;

  // Persister dans une transaction
  const scheduleId = await prisma.$transaction(async (tx) => {
    const schedule = await tx.schedule.create({
      data: {
        userId,
        name: scheduleName,
        startDate,
        endDate,
        status: "draft",
        totalInterventions: domainSchedule.stats.totalInterventions,
        totalDistanceKm: domainSchedule.stats.totalDistanceKm,
        totalDrivingTimeHours: domainSchedule.stats.totalDrivingTimeHours,
        clientsServed: domainSchedule.stats.clientsServed,
        teamsUtilized: domainSchedule.stats.teamsUtilized,
      },
    });

    // Créer toutes les interventions
    const interventionData = domainSchedule.routes.flatMap((route) =>
      route.interventions.map((intervention) => ({
        scheduleId: schedule.id,
        sourceType: intervention.sourceType as "recurring" | "oneoff",
        sourceContractId: intervention.sourceContractId ?? null,
        sourceRequestId: intervention.sourceRequestId ?? null,
        clientId: intervention.clientId,
        interventionType: intervention.interventionType,
        scheduledDate: intervention.scheduledDate,
        estimatedStartTime: intervention.estimatedStartTime,
        estimatedDurationMinutes: intervention.estimatedDurationMinutes,
        assignedTeamId: intervention.assignedTeamId,
        assignedEquipment: intervention.assignedEquipment,
        status: "planned" as const,
        routeOrder: intervention.routeOrder,
        estimatedTravelTimeMinutes: intervention.estimatedTravelTimeMinutes,
        estimatedTravelDistanceKm: intervention.estimatedTravelDistanceKm,
        weatherTemperature: intervention.weatherForecast?.temperature ?? null,
        weatherWindSpeed: intervention.weatherForecast?.windSpeed ?? null,
        weatherRainProbability:
          intervention.weatherForecast?.rainProbability ?? null,
        weatherRainMm: intervention.weatherForecast?.rainMm ?? null,
        weatherCondition: intervention.weatherForecast?.condition ?? null,
        weatherIsSuitable: intervention.weatherForecast?.isSuitable ?? null,
      }))
    );

    if (interventionData.length > 0) {
      await tx.plannedIntervention.createMany({ data: interventionData });
    }

    return schedule.id;
  });

  return scheduleId;
}
