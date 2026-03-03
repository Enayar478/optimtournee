/**
 * Domaine métier - OptimTournée
 * Les entités fondamentales du système de planification paysagiste
 */

export type RecurrenceType = 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly';

export type InterventionType = 
  | 'mowing' | 'hedge_trimming' | 'pruning' | 'weeding' 
  | 'planting' | 'maintenance' | 'emergency';

export type InterventionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

export type EquipmentType = 
  | 'lawn_tractor' | 'push_mower' | 'hedge_trimmer' | 'chainsaw' 
  | 'blower' | 'trailer' | 'utility_vehicle';

export interface WeatherConstraints {
  maxWindSpeed: number;
  noRainForecast: boolean;
  minTemperature: number;
  maxTemperature: number;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Client {
  id: string;
  name: string;
  location: GeoLocation;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  contract?: RecurringContract;
}

export interface RecurringContract {
  id: string;
  clientId: string;
  recurrence: RecurrenceType;
  dayOfWeek: number;
  durationMinutes: number;
  interventionType: InterventionType;
  requiredEquipment: EquipmentType[];
  weatherConstraints: WeatherConstraints;
  startDate: Date;
  endDate?: Date;
  priority: number;
}

export interface OneOffRequest {
  id: string;
  clientId: string;
  requestDate: Date;
  preferredDateStart?: Date;
  preferredDateEnd?: Date;
  interventionType: InterventionType;
  description: string;
  durationEstimate: number;
  requiredEquipment: EquipmentType[];
  priority: number;
  weatherConstraints: WeatherConstraints;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  assignedEquipment: EquipmentType[];
  defaultStartLocation: GeoLocation;
  skills: InterventionType[];
  unavailableDates: Date[];
  workSchedule: WorkSchedule;
  color: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  licenseTypes?: string[];
}

export interface WorkSchedule {
  startTime: string;
  endTime: string;
  lunchBreakMinutes: number;
  workingDays: number[];
}

export interface Equipment {
  id: string;
  type: EquipmentType;
  name: string;
  requiresTrailer: boolean;
  maintenanceDates: Date[];
}

export interface PlannedIntervention {
  id: string;
  sourceType: 'recurring' | 'oneoff';
  sourceContractId?: string;
  sourceRequestId?: string;
  clientId: string;
  interventionType: InterventionType;
  scheduledDate: Date;
  estimatedStartTime: string;
  estimatedDurationMinutes: number;
  assignedTeamId: string;
  assignedEquipment: EquipmentType[];
  status: InterventionStatus;
  routeOrder: number;
  estimatedTravelTimeMinutes: number;
  estimatedTravelDistanceKm: number;
  weatherForecast?: WeatherForecast;
}

export interface WeatherForecast {
  date: Date;
  temperature: number;
  windSpeed: number;
  rainProbability: number;
  rainMm: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow';
  isSuitable: boolean;
}

export interface DailyRoute {
  date: Date;
  teamId: string;
  interventions: PlannedIntervention[];
  totalDistanceKm: number;
  totalDrivingTimeMinutes: number;
  totalWorkTimeMinutes: number;
  startLocation: GeoLocation;
  endLocation: GeoLocation;
}

export interface Schedule {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  routes: DailyRoute[];
  stats: ScheduleStats;
  generatedAt: Date;
  version: number;
}

export interface ScheduleStats {
  totalInterventions: number;
  totalDistanceKm: number;
  totalDrivingTimeHours: number;
  clientsServed: number;
  teamsUtilized: number;
  equipmentUtilization: Record<EquipmentType, number>;
  estimatedTimeSavedHours?: number;
  estimatedFuelSavedLiters?: number;
}

export interface SchedulingConstraints {
  startDate: Date;
  endDate: Date;
  teams: Team[];
  equipment: Equipment[];
  clients: Client[];
  oneOffRequests: OneOffRequest[];
  optimizationCriteria: 'distance' | 'time' | 'balanced';
  maxDrivingTimePerDayMinutes: number;
  allowWeekendWork: boolean;
  weatherBufferDays: number;
}
