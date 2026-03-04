/**
 * Tests unitaires du moteur de planification
 * @argos_qa_bot — Coverage: génération occurrences, scheduling basique, contraintes météo
 */

import { generateRecurringOccurrences, generateSchedule } from "../scheduler";
import {
  RecurringContract,
  Client,
  Team,
  SchedulingConstraints,
  WeatherForecast,
} from "../../../types/domain";

describe("generateRecurringOccurrences", () => {
  const baseContract: RecurringContract = {
    id: "contract-1",
    clientId: "client-1",
    recurrence: "weekly",
    dayOfWeek: 2, // Mardi
    durationMinutes: 120,
    interventionType: "mowing",
    requiredEquipment: ["lawn_tractor", "push_mower"],
    weatherConstraints: {
      maxWindSpeed: 50,
      noRainForecast: true,
      minTemperature: 5,
      maxTemperature: 35,
    },
    startDate: new Date("2024-03-01"),
    priority: 1,
  };

  it("génère les bonnes occurrences hebdomadaires", () => {
    const start = new Date("2024-03-01");
    const end = new Date("2024-03-31");

    const dates = generateRecurringOccurrences(baseContract, start, end);

    expect(dates.length).toBeGreaterThan(0);
    for (const date of dates) {
      expect(date.getDay()).toBe(2);
    }
  });

  it("génère zéro occurrence si la fenêtre est avant le contrat", () => {
    const start = new Date("2023-01-01");
    const end = new Date("2023-12-31");

    const dates = generateRecurringOccurrences(baseContract, start, end);

    expect(dates).toHaveLength(0);
  });
});

describe("generateSchedule", () => {
  const mockWeatherProvider = async (): Promise<WeatherForecast> => ({
    date: new Date(),
    temperature: 20,
    windSpeed: 10,
    rainProbability: 0,
    rainMm: 0,
    condition: "clear",
    isSuitable: true,
  });

  const createMockClient = (
    id: string,
    name: string,
    lat: number,
    lng: number
  ): Client => ({
    id,
    name,
    location: { lat, lng, address: `${name} Address` },
    contract: {
      id: `contract-${id}`,
      clientId: id,
      recurrence: "weekly",
      dayOfWeek: 1,
      durationMinutes: 120,
      interventionType: "mowing",
      requiredEquipment: ["push_mower"],
      weatherConstraints: {
        maxWindSpeed: 50,
        noRainForecast: true,
        minTemperature: 5,
        maxTemperature: 35,
      },
      startDate: new Date("2024-03-01"),
      priority: 1,
    },
  });

  const mockTeam: Team = {
    id: "team-1",
    name: "Équipe Alpha",
    members: [{ id: "m1", firstName: "Jean", lastName: "Dupont" }],
    assignedEquipment: ["push_mower", "lawn_tractor"],
    defaultStartLocation: {
      lat: 48.8566,
      lng: 2.3522,
      address: "Dépôt central",
    },
    skills: ["mowing", "maintenance"],
    unavailableDates: [],
    workSchedule: {
      startTime: "08:00",
      endTime: "17:00",
      lunchBreakMinutes: 60,
      workingDays: [1, 2, 3, 4, 5],
    },
    color: "#3b82f6",
  };

  it("planifie 3 clients avec 1 équipe sur une semaine", async () => {
    const clients: Client[] = [
      createMockClient("c1", "Client A", 48.86, 2.35),
      createMockClient("c2", "Client B", 48.87, 2.36),
      createMockClient("c3", "Client C", 48.88, 2.37),
    ];

    const constraints: SchedulingConstraints = {
      startDate: new Date("2024-03-04"),
      endDate: new Date("2024-03-10"),
      teams: [mockTeam],
      equipment: [],
      clients,
      oneOffRequests: [],
      optimizationCriteria: "distance",
      maxDrivingTimePerDayMinutes: 120,
      allowWeekendWork: false,
      weatherBufferDays: 2,
    };

    const schedule = await generateSchedule(constraints, mockWeatherProvider);

    expect(schedule.routes).toHaveLength(1);
    expect(schedule.routes[0].interventions).toHaveLength(3);
    expect(schedule.stats.totalInterventions).toBe(3);
  });
});
