/**
 * Moteur de planification intelligent avec contraintes météo
 *
 * CORRECTIONS APPORTÉES (Argos):
 * - Types stricts au lieu de `any`
 * - Fix calcul récurrence mensuelle (30j → vrai mois)
 * - Null safety sur clientMap.get()
 * - Type guards sur les enums
 */

import {
  Team,
  RecurringContract,
  DailyRoute,
  Schedule,
  ScheduleStats,
  SchedulingConstraints,
  WeatherForecast,
  GeoLocation,
  InterventionType,
  EquipmentType,
  WeatherConstraints,
  RecurrenceType,
} from "../../types/domain";
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.toDateString() === d2.toDateString();
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function calculateDistance(p1: GeoLocation, p2: GeoLocation): number {
  const R = 6371e3;
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateTravelTime(distanceMeters: number): number {
  return Math.round(distanceMeters / 12.5);
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  return `${Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
}

// Type guard pour vérifier si une valeur est un InterventionType valide
function isValidInterventionType(value: string): value is InterventionType {
  const validTypes: InterventionType[] = [
    "mowing",
    "hedge_trimming",
    "pruning",
    "weeding",
    "planting",
    "maintenance",
    "emergency",
  ];
  return validTypes.includes(value as InterventionType);
}

// Type guard pour vérifier si un équipement est valide
function isValidEquipmentType(value: string): value is EquipmentType {
  const validTypes: EquipmentType[] = [
    "lawn_tractor",
    "push_mower",
    "hedge_trimmer",
    "chainsaw",
    "blower",
    "trailer",
    "utility_vehicle",
  ];
  return validTypes.includes(value as EquipmentType);
}

/**
 * Génère les dates d'occurrences pour un contrat récurrent
 * FIX: Utilise vrai calcul de mois au lieu de 30j fixes
 */
export function generateRecurringOccurrences(
  contract: RecurringContract,
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = [];
  let current = new Date(contract.startDate);

  // Avancer jusqu'à la fenêtre de planification
  while (current < startDate) {
    current = advanceDate(current, contract.recurrence);
  }

  // Collecter toutes les dates dans la fenêtre
  while (
    current <= endDate &&
    (!contract.endDate || current <= contract.endDate)
  ) {
    if (current.getDay() === contract.dayOfWeek) {
      dates.push(new Date(current));
    }
    current = advanceDate(current, contract.recurrence);
  }

  return dates;
}

/**
 * Avance une date selon le type de récurrence
 * FIX: Gestion correcte des mois (variable 28-31j)
 */
function advanceDate(date: Date, recurrence: RecurrenceType): Date {
  switch (recurrence) {
    case "weekly":
      return addDays(date, 7);
    case "biweekly":
      return addDays(date, 14);
    case "monthly":
      return addMonths(date, 1);
    case "bimonthly":
      return addMonths(date, 2);
    case "quarterly":
      return addMonths(date, 3);
    default:
      return addDays(date, 7);
  }
}

// Interface interne pour les tâches à planifier
interface TaskToSchedule {
  type: "recurring" | "oneoff";
  id: string;
  clientId: string;
  date: Date;
  duration: number;
  interventionType: InterventionType;
  requiredEquipment: EquipmentType[];
  priority: number;
  weatherConstraints: WeatherConstraints;
  sourceId: string;
}

/**
 * Génère un planning optimisé avec contraintes météo
 *
 * TODO: Cette fonction mute les objets task.date — à refactorer pour immutabilité
 */
export async function generateSchedule(
  constraints: SchedulingConstraints,
  weatherProvider: (
    date: Date,
    _loc: GeoLocation
  ) => Promise<WeatherForecast | undefined>
): Promise<Schedule> {
  const { startDate, endDate, teams, clients, oneOffRequests } = constraints;
  const clientMap = new Map(clients.map((c) => [c.id, c]));

  const toSchedule: TaskToSchedule[] = [];

  // Collecter interventions récurrentes
  for (const client of clients) {
    if (client.contract) {
      const dates = generateRecurringOccurrences(
        client.contract,
        startDate,
        endDate
      );
      for (const date of dates) {
        toSchedule.push({
          type: "recurring",
          id: `rec-${client.contract.id}-${formatDateKey(date)}`,
          clientId: client.id,
          date,
          duration: client.contract.durationMinutes,
          interventionType: client.contract.interventionType,
          requiredEquipment: client.contract.requiredEquipment,
          priority: client.contract.priority,
          weatherConstraints: client.contract.weatherConstraints,
          sourceId: client.contract.id,
        });
      }
    }
  }

  // Ajouter demandes ponctuelles
  for (const req of oneOffRequests) {
    if (req.status === "pending") {
      toSchedule.push({
        type: "oneoff",
        id: `req-${req.id}`,
        clientId: req.clientId,
        date: req.preferredDateStart || addDays(new Date(), 1),
        duration: req.durationEstimate,
        interventionType: req.interventionType,
        requiredEquipment: req.requiredEquipment,
        priority: req.priority,
        weatherConstraints: req.weatherConstraints,
        sourceId: req.id,
      });
    }
  }

  // Trier par priorité puis par date
  toSchedule.sort(
    (a, b) => b.priority - a.priority || a.date.getTime() - b.date.getTime()
  );

  const routes = new Map<string, DailyRoute>();

  function getRoute(date: Date, team: Team): DailyRoute {
    const key = `${formatDateKey(date)}-${team.id}`;
    if (!routes.has(key)) {
      routes.set(key, {
        date: new Date(date),
        teamId: team.id,
        interventions: [],
        totalDistanceKm: 0,
        totalDrivingTimeMinutes: 0,
        totalWorkTimeMinutes: 0,
        startLocation: team.defaultStartLocation,
        endLocation: team.defaultStartLocation,
      });
    }
    return routes.get(key)!;
  }

  // Traiter chaque tâche
  for (const task of toSchedule) {
    const client = clientMap.get(task.clientId);
    if (!client) {
      console.warn(`Client non trouvé: ${task.clientId}`);
      continue;
    }

    // Filtrer les équipes disponibles ce jour-là
    const availableTeams = teams.filter((t) => {
      if (!t.workSchedule.workingDays.includes(task.date.getDay()))
        return false;
      if (t.unavailableDates.some((d) => isSameDay(d, task.date))) return false;
      return true;
    });

    if (availableTeams.length === 0) {
      // NOTE: Mutation de task.date — à améliorer pour immutabilité
      task.date = addDays(task.date, 1);
      continue;
    }

    // Vérifier la météo
    const weather = await weatherProvider(task.date, client.location);
    const wc = task.weatherConstraints;
    if (
      weather &&
      (weather.windSpeed > wc.maxWindSpeed ||
        (wc.noRainForecast && weather.rainProbability > 40) ||
        weather.temperature > wc.maxTemperature ||
        weather.temperature < wc.minTemperature)
    ) {
      // NOTE: Mutation de task.date — à améliorer pour immutabilité
      task.date = addDays(task.date, 1);
      continue;
    }

    // Trouver la meilleure équipe (plus proche)
    let bestTeam: Team | null = null;
    let minDistance = Infinity;

    for (const team of availableTeams) {
      // Vérifier compétences
      if (
        !team.skills.includes(task.interventionType) &&
        !team.skills.includes("maintenance")
      ) {
        continue;
      }

      const route = getRoute(task.date, team);
      const availableMins =
        timeToMinutes(team.workSchedule.endTime) -
        timeToMinutes(team.workSchedule.startTime) -
        team.workSchedule.lunchBreakMinutes;
      const usedMins = route.interventions.reduce(
        (s, i) => s + i.estimatedDurationMinutes + i.estimatedTravelTimeMinutes,
        0
      );

      // Vérifier capacité horaire
      if (usedMins + task.duration > availableMins) continue;

      // Calculer distance depuis dernière intervention
      const lastLoc = route.interventions.length
        ? clientMap.get(
            route.interventions[route.interventions.length - 1].clientId
          )?.location
        : team.defaultStartLocation;

      if (!lastLoc) continue; // FIX: Null safety

      const dist = calculateDistance(lastLoc, client.location);
      if (dist < minDistance) {
        minDistance = dist;
        bestTeam = team;
      }
    }

    if (bestTeam) {
      const route = getRoute(task.date, bestTeam);
      const lastInt = route.interventions[route.interventions.length - 1];
      const prevLoc = lastInt
        ? clientMap.get(lastInt.clientId)?.location
        : bestTeam.defaultStartLocation;

      if (!prevLoc) continue; // FIX: Null safety

      const travelDist = calculateDistance(prevLoc, client.location);
      const travelTime = estimateTravelTime(travelDist);

      // Calculer heure de début
      let startMins = timeToMinutes(bestTeam.workSchedule.startTime);
      if (lastInt) {
        startMins =
          timeToMinutes(lastInt.estimatedStartTime) +
          lastInt.estimatedDurationMinutes +
          lastInt.estimatedTravelTimeMinutes;
      }

      // Validation du type d'intervention
      if (!isValidInterventionType(task.interventionType)) {
        console.warn(`Type d'intervention invalide: ${task.interventionType}`);
      }

      // Validation des équipements
      const validEquipment = task.requiredEquipment.filter((eq) =>
        isValidEquipmentType(eq)
      );

      route.interventions.push({
        id: task.id,
        sourceType: task.type,
        sourceContractId: task.type === "recurring" ? task.sourceId : undefined,
        sourceRequestId: task.type === "oneoff" ? task.sourceId : undefined,
        clientId: task.clientId,
        interventionType: task.interventionType,
        scheduledDate: new Date(task.date),
        estimatedStartTime: minutesToTime(startMins),
        estimatedDurationMinutes: task.duration,
        assignedTeamId: bestTeam.id,
        assignedEquipment: validEquipment,
        status: "planned",
        routeOrder: route.interventions.length,
        estimatedTravelTimeMinutes: Math.round(travelTime / 60),
        estimatedTravelDistanceKm: Math.round(travelDist / 100) / 10,
        weatherForecast: weather,
      });

      route.totalDistanceKm += Math.round(travelDist / 100) / 10;
      route.totalDrivingTimeMinutes += Math.round(travelTime / 60);
      route.totalWorkTimeMinutes += task.duration;
    }
  }

  const routeList = Array.from(routes.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return {
    id: `sched-${Date.now()}`,
    name: `Planning ${formatDateKey(startDate)} - ${formatDateKey(endDate)}`,
    startDate,
    endDate,
    routes: routeList,
    stats: calculateStats(routeList),
    generatedAt: new Date(),
    version: 1,
  };
}

/**
 * Calcule les statistiques du planning
 * FIX: Initialisation propre de equipmentUtilization
 */
function calculateStats(routes: DailyRoute[]): ScheduleStats {
  const totalInt = routes.reduce((s, r) => s + r.interventions.length, 0);
  const totalDist = routes.reduce((s, r) => s + r.totalDistanceKm, 0);
  const totalDrive = routes.reduce((s, r) => s + r.totalDrivingTimeMinutes, 0);

  // FIX: Initialiser equipmentUtilization avec tous les types à 0
  const equipmentUtilization: Record<EquipmentType, number> = {
    lawn_tractor: 0,
    push_mower: 0,
    hedge_trimmer: 0,
    chainsaw: 0,
    blower: 0,
    trailer: 0,
    utility_vehicle: 0,
  };

  // Compter l'utilisation réelle
  for (const route of routes) {
    for (const intervention of route.interventions) {
      for (const eq of intervention.assignedEquipment) {
        if (eq in equipmentUtilization) {
          equipmentUtilization[eq]++;
        }
      }
    }
  }

  return {
    totalInterventions: totalInt,
    totalDistanceKm: Math.round(totalDist * 10) / 10,
    totalDrivingTimeHours: Math.round(totalDrive / 6) / 10,
    clientsServed: new Set(
      routes.flatMap((r) => r.interventions.map((i) => i.clientId))
    ).size,
    teamsUtilized: new Set(routes.map((r) => r.teamId)).size,
    equipmentUtilization,
  };
}
