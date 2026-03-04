import {
  generateRecurringOccurrences,
  generateSchedule,
} from '../scheduler';
import {
  RecurringContract,
  Client,
  Team,
  SchedulingConstraints,
  WeatherForecast,
} from '../../../types/domain';

describe('generateRecurringOccurrences', () => {
  const baseContract: RecurringContract = {
    id: 'ctr-1',
    clientId: 'c-1',
    recurrence: 'weekly',
    dayOfWeek: 1, // Lundi
    durationMinutes: 120,
    interventionType: 'mowing',
    requiredEquipment: ['push_mower'],
    weatherConstraints: {
      maxWindSpeed: 30,
      noRainForecast: true,
      minTemperature: 5,
      maxTemperature: 35,
    },
    startDate: new Date('2024-03-01'),
    priority: 1,
  };

  it('genère les bonnes occurrences hebdomadaires', () => {
    const start = new Date('2024-03-04');
    const end = new Date('2024-03-31');
    
    const dates = generateRecurringOccurrences(baseContract, start, end);
    
    expect(dates.length).toBeGreaterThan(0);
    for (const date of dates) {
      expect(date.getDay()).toBe(1); // Lundi
    }
  });

  it('genère zero occurrence si fenêtre hors du contrat', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-12-31');
    
    const dates = generateRecurringOccurrences(baseContract, start, end);
    
    expect(dates).toHaveLength(0);
  });

  it('genère les bonnes occurrences mensuelles', () => {
    const contract: RecurringContract = {
      ...baseContract,
      recurrence: 'monthly',
      dayOfWeek: 1,
    };
    
    const start = new Date('2024-01-01');
    const end = new Date('2024-12-31');
    
    const dates = generateRecurringOccurrences(contract, start, end);
    
    // Environ 6 occurrences mensuelles sur l'année
    expect(dates.length).toBeGreaterThanOrEqual(6);
    expect(dates.length).toBeLessThanOrEqual(7);
  });

  it('respecte la date de fin de contrat', () => {
    const contract: RecurringContract = {
      ...baseContract,
      endDate: new Date('2024-03-15'),
    };
    
    const start = new Date('2024-03-01');
    const end = new Date('2024-12-31');
    
    const dates = generateRecurringOccurrences(contract, start, end);
    
    for (const date of dates) {
      expect(date.getTime()).toBeLessThanOrEqual(
        contract.endDate!.getTime()
      );
    }
  });
});

describe('generateSchedule', () => {
  const mockWeatherProvider = async ():
    Promise.resolve<WeatherForecast>({
      date: new Date(),
      temperature: 20,
      windSpeed: 10,
      rainProbability: 0,
      rainMm: 0,
      condition: 'clear',
      isSuitable: true,
    });

  const createMockClient = (id: string, name: string, lat: number, lng: number): Client => ({
    id,
    name,
    location: { lat, lng, address: `${name} Address` },
    contract: id === 'c1' ? {
      id: 'ctr-1',
      clientId: id,
      recurrence: 'weekly',
      dayOfWeek: 1,
      durationMinutes: 120,
      interventionType: 'mowing',
      requiredEquipment: ['push_mower'],
      weatherConstraints: {
        maxWindSpeed: 50,
        noRainForecast: true,
        minTemperature: 5,
        maxTemperature: 35,
      },
      startDate: new Date('2024-03-01'),
      priority: 1,
    } : undefined,
  });

  const mockTeam: Team = {
    id: 'team-1',
    name: 'Équipe Alpha',
    members: [{ id: 'm1', firstName: 'Jean', lastName: 'Dupont' }],
    assignedEquipment: ['push_mower'],
    defaultStartLocation: { lat: 48.8566, lng: 2.3522, address: 'Dépôt central' },
    skills: ['mowing', 'maintenance'],
    unavailableDates: [],
    workSchedule: {
      startTime: '08:00',
      endTime: '17:00',
      lunchBreakMinutes: 60,
      workingDays: [1, 2, 3, 4, 5],
    },
    color: '#3b82f6',
  };

  it('planif @3 clients avec 1 équipe', async () => {
    const clients: Client[] = [
      createMockClient('c1', 'Client A', 48.86, 2.35),
      createMockClient('c2', 'Client B', 48.87, 2.36),
      createMockClient('c3', 'Client C', 48.88, 2.37),
    ];

    const constraints: SchedulingConstraints = {
      startDate: new Date('2024-03-04'),
      endDate: new Date('2024-03-10'),
      teams: [mockTeam],
      equipment: [],
      clients,
      oneOffRequests: [],
      optimizationCriteria: 'distance',
      maxDrivingTimePerDayMinutes: 120,
      allowWeekendWork: false,
      weatherBufferDays: 1,
    };

    const schedule = await generateSchedule(constraints, mockWeatherProvider);

    expect(schedule.routes).toHaveLength(1);
    expect(schedule.routes[0].interventions).toHaveLength(3);
    expect(schedule.stats.totalInterventions).toBe(3);
  });

  it('respecte les contraintes météo (vent fort)', async () => {
    const windyWeatherProvider = async () => (_, _loc) =>
      Promise.resolve<WeatherForecast>({
        date: new Date(),
        temperature: 20,
        windSpeed: 60, // Trop fort!
        rainProbability: 0,
        rainMm: 0,
        condition: 'clear',
        isSuitable: false,
      });

    const clients: Client[] = [
      createMockClient('c1', 'Client Vent', 48.86, 2.35),
    ];

    const constraints: SchedulingConstraints = {
      startDate: new Date('2024-03-04'),
      endDate: new Date('2024-03-10'),
      teams: [mockTeam],
      equipment: [],
      clients,
      oneOffRequests: [],
      optimizationCriteria: 'distance',
      maxDrivingTimePerDayMinutes: 120,
      allowWeekendWork: false,
      weatherBufferDays: 1,
    };

    const schedule = await generateSchedule(constraints, windyWeatherProvider);

    // L'intervention devrait �tre reportée
    expect(schedule.stats.totalInterventions).toBe(0);
  });
});
