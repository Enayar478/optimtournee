/**
 * Moteur de planification intelligent avec contraintes météo
 */

import {
  Client, Team, Equipment, RecurringContract, OneOffRequest,
  PlannedIntervention, DailyRoute, Schedule, ScheduleStats,
  SchedulingConstraints, WeatherForecast, GeoLocation
} from '../../types/domain';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.toDateString() === d2.toDateString();
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function calculateDistance(p1: GeoLocation, p2: GeoLocation): number {
  const R = 6371e3;
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function estimateTravelTime(distanceMeters: number): number {
  return Math.round(distanceMeters / 12.5);
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  return `${Math.floor(minutes/60).toString().padStart(2,'0')}:${(minutes%60).toString().padStart(2,'0')}`;
}

export function generateRecurringOccurrences(
  contract: RecurringContract, startDate: Date, endDate: Date
): Date[] {
  const dates: Date[] = [];
  let current = new Date(contract.startDate);
  
  const increments: Record<string, number> = {
    weekly: 7, biweekly: 14, monthly: 30, bimonthly: 60, quarterly: 90
  };
  
  while (current < startDate) {
    current = addDays(current, increments[contract.recurrence] || 7);
  }
  
  while (current <= endDate && (!contract.endDate || current <= contract.endDate)) {
    if (current.getDay() === contract.dayOfWeek) {
      dates.push(new Date(current));
    }
    current = addDays(current, 1);
  }
  
  return dates;
}

export async function generateSchedule(
  constraints: SchedulingConstraints,
  weatherProvider: (date: Date, loc: GeoLocation) => Promise<WeatherForecast | undefined>
): Promise<Schedule> {
  const { startDate, endDate, teams, clients, oneOffRequests } = constraints;
  const clientMap = new Map(clients.map(c => [c.id, c]));
  
  const toSchedule: Array<{
    type: 'recurring' | 'oneoff';
    id: string;
    clientId: string;
    date: Date;
    duration: number;
    interventionType: import("@/types/domain").InterventionType;
    requiredEquipment: import("@/types/domain").EquipmentType[];
    priority: number;
    weatherConstraints: any;
    sourceId: string;
  }> = [];
  
  // Collecter interventions récurrentes
  for (const client of clients) {
    if (client.contract) {
      const dates = generateRecurringOccurrences(client.contract, startDate, endDate);
      for (const date of dates) {
        toSchedule.push({
          type: 'recurring',
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
    if (req.status === 'pending') {
      toSchedule.push({
        type: 'oneoff',
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
  
  toSchedule.sort((a, b) => b.priority - a.priority || a.date.getTime() - b.date.getTime());
  
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
  
  for (const task of toSchedule) {
    const client = clientMap.get(task.clientId);
    if (!client) continue;
    
    const availableTeams = teams.filter(t => {
      if (!t.workSchedule.workingDays.includes(task.date.getDay())) return false;
      if (t.unavailableDates.some(d => isSameDay(d, task.date))) return false;
      return true;
    });
    
    if (availableTeams.length === 0) {
      task.date = addDays(task.date, 1);
      continue;
    }
    
    const weather = await weatherProvider(task.date, client.location);
    const wc = task.weatherConstraints;
    if (weather && (
      weather.windSpeed > wc.maxWindSpeed ||
      (wc.noRainForecast && weather.rainProbability > 40) ||
      weather.temperature > wc.maxTemperature ||
      weather.temperature < wc.minTemperature
    )) {
      task.date = addDays(task.date, 1);
      continue;
    }
    
    let bestTeam: Team | null = null;
    let minDistance = Infinity;
    
    for (const team of availableTeams) {
      if (!team.skills.includes(task.interventionType) && !team.skills.includes('maintenance')) continue;
      
      const route = getRoute(task.date, team);
      const availableMins = timeToMinutes(team.workSchedule.endTime) - 
        timeToMinutes(team.workSchedule.startTime) - team.workSchedule.lunchBreakMinutes;
      const usedMins = route.interventions.reduce((s, i) => 
        s + i.estimatedDurationMinutes + i.estimatedTravelTimeMinutes, 0);
      
      if (usedMins + task.duration > availableMins) continue;
      
      const lastLoc = route.interventions.length 
        ? clientMap.get(route.interventions[route.interventions.length-1].clientId)?.location 
        : team.defaultStartLocation;
      
      const dist = lastLoc ? calculateDistance(lastLoc, client.location) : 0;
      if (dist < minDistance) {
        minDistance = dist;
        bestTeam = team;
      }
    }
    
    if (bestTeam) {
      const route = getRoute(task.date, bestTeam);
      const lastInt = route.interventions[route.interventions.length-1];
      const prevLoc = lastInt 
        ? clientMap.get(lastInt.clientId)?.location 
        : bestTeam.defaultStartLocation;
      
      const travelDist = prevLoc ? calculateDistance(prevLoc, client.location) : 0;
      const travelTime = estimateTravelTime(travelDist);
      
      let startMins = timeToMinutes(bestTeam.workSchedule.startTime);
      if (lastInt) {
        startMins = timeToMinutes(lastInt.estimatedStartTime) + 
          lastInt.estimatedDurationMinutes + lastInt.estimatedTravelTimeMinutes;
      }
      
      route.interventions.push({
        id: task.id,
        sourceType: task.type,
        sourceContractId: task.type === 'recurring' ? task.sourceId : undefined,
        sourceRequestId: task.type === 'oneoff' ? task.sourceId : undefined,
        clientId: task.clientId,
        interventionType: task.interventionType as any,
        scheduledDate: new Date(task.date),
        estimatedStartTime: minutesToTime(startMins),
        estimatedDurationMinutes: task.duration,
        assignedTeamId: bestTeam.id,
        assignedEquipment: task.requiredEquipment as any,
        status: 'planned',
        routeOrder: route.interventions.length,
        estimatedTravelTimeMinutes: Math.round(travelTime/60),
        estimatedTravelDistanceKm: Math.round(travelDist/100)/10,
        weatherForecast: weather,
      });
      
      route.totalDistanceKm += Math.round(travelDist/100)/10;
      route.totalDrivingTimeMinutes += Math.round(travelTime/60);
      route.totalWorkTimeMinutes += task.duration;
    }
  }
  
  const routeList = Array.from(routes.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  
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

function calculateStats(routes: DailyRoute[]): ScheduleStats {
  const totalInt = routes.reduce((s, r) => s + r.interventions.length, 0);
  const totalDist = routes.reduce((s, r) => s + r.totalDistanceKm, 0);
  const totalDrive = routes.reduce((s, r) => s + r.totalDrivingTimeMinutes, 0);
  
  return {
    totalInterventions: totalInt,
    totalDistanceKm: Math.round(totalDist * 10) / 10,
    totalDrivingTimeHours: Math.round(totalDrive / 6) / 10,
    clientsServed: new Set(routes.flatMap(r => r.interventions.map(i => i.clientId))).size,
    teamsUtilized: new Set(routes.map(r => r.teamId)).size,
    equipmentUtilization: {} as any,
  };
}
