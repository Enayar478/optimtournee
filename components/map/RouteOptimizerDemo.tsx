'use client';

import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Client, Team, Schedule, InterventionType, EquipmentType } from '@/types/domain';
import { generateSchedule } from '@/lib/domain/scheduler';
import { getMockWeather } from '@/lib/services/weather';

const clientIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzIyYzU1ZSI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface DemoState {
  clients: Client[];
  teams: Team[];
  schedule: Schedule | null;
  isGenerating: boolean;
  selectedDate: string;
}

// Données de démo
const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'M. Dupont - Villa Les Roses',
    location: { lat: 48.8566, lng: 2.3522, address: '12 Rue de la Paix, Paris' },
    contract: {
      id: 'ctr1',
      clientId: 'c1',
      recurrence: 'weekly',
      dayOfWeek: 2,
      durationMinutes: 120,
      interventionType: 'mowing',
      requiredEquipment: ['lawn_tractor', 'blower'],
      weatherConstraints: { maxWindSpeed: 30, noRainForecast: true, minTemperature: 5, maxTemperature: 35 },
      startDate: new Date('2025-01-01'),
      priority: 3,
    },
  },
  {
    id: 'c2',
    name: 'Entreprise Verte SA',
    location: { lat: 48.8589, lng: 2.3470, address: '45 Av des Champs-Élysées, Paris' },
    contract: {
      id: 'ctr2',
      clientId: 'c2',
      recurrence: 'biweekly',
      dayOfWeek: 3,
      durationMinutes: 180,
      interventionType: 'hedge_trimming',
      requiredEquipment: ['hedge_trimmer', 'utility_vehicle'],
      weatherConstraints: { maxWindSpeed: 25, noRainForecast: true, minTemperature: 5, maxTemperature: 35 },
      startDate: new Date('2025-01-01'),
      priority: 4,
    },
  },
  {
    id: 'c3',
    name: 'Parc Municipal',
    location: { lat: 48.8550, lng: 2.3600, address: 'Jardin des Plantes, Paris' },
    contract: {
      id: 'ctr3',
      clientId: 'c3',
      recurrence: 'weekly',
      dayOfWeek: 1,
      durationMinutes: 240,
      interventionType: 'maintenance',
      requiredEquipment: ['lawn_tractor', 'push_mower', 'blower'],
      weatherConstraints: { maxWindSpeed: 35, noRainForecast: false, minTemperature: 0, maxTemperature: 40 },
      startDate: new Date('2025-01-01'),
      priority: 3,
    },
  },
  {
    id: 'c4',
    name: 'Mme Martin - Résidence',
    location: { lat: 48.8520, lng: 2.3450, address: '8 Rue de Rivoli, Paris' },
    contract: {
      id: 'ctr4',
      clientId: 'c4',
      recurrence: 'monthly',
      dayOfWeek: 4,
      durationMinutes: 90,
      interventionType: 'pruning',
      requiredEquipment: ['chainsaw'],
      weatherConstraints: { maxWindSpeed: 20, noRainForecast: true, minTemperature: 5, maxTemperature: 35 },
      startDate: new Date('2025-01-01'),
      priority: 2,
    },
  },
  {
    id: 'c5',
    name: 'Café des Jardins',
    location: { lat: 48.8600, lng: 2.3400, address: '25 Quai des Orfèvres, Paris' },
    contract: {
      id: 'ctr5',
      clientId: 'c5',
      recurrence: 'weekly',
      dayOfWeek: 5,
      durationMinutes: 60,
      interventionType: 'weeding',
      requiredEquipment: ['push_mower'],
      weatherConstraints: { maxWindSpeed: 40, noRainForecast: false, minTemperature: 0, maxTemperature: 40 },
      startDate: new Date('2025-01-01'),
      priority: 2,
    },
  },
];

const MOCK_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Équipe Alpha',
    members: [{ id: 'm1', firstName: 'Jean', lastName: 'Martin' }, { id: 'm2', firstName: 'Paul', lastName: 'Dubois' }],
    assignedEquipment: ['lawn_tractor', 'push_mower', 'blower'],
    defaultStartLocation: { lat: 48.8500, lng: 2.3500, address: 'Dépôt central' },
    skills: ['mowing', 'weeding', 'maintenance'],
    unavailableDates: [],
    workSchedule: { startTime: '07:00', endTime: '17:00', lunchBreakMinutes: 60, workingDays: [1, 2, 3, 4, 5] },
    color: '#22c55e',
  },
  {
    id: 't2',
    name: 'Équipe Beta',
    members: [{ id: 'm3', firstName: 'Pierre', lastName: 'Bernard' }],
    assignedEquipment: ['hedge_trimmer', 'chainsaw', 'utility_vehicle'],
    defaultStartLocation: { lat: 48.8500, lng: 2.3500, address: 'Dépôt central' },
    skills: ['hedge_trimming', 'pruning', 'maintenance'],
    unavailableDates: [],
    workSchedule: { startTime: '07:00', endTime: '17:00', lunchBreakMinutes: 60, workingDays: [1, 2, 3, 4, 5] },
    color: '#3b82f6',
  },
];

export default function RouteOptimizerDemo() {
  const [state, setState] = useState<DemoState>({
    clients: MOCK_CLIENTS,
    teams: MOCK_TEAMS,
    schedule: null,
    isGenerating: false,
    selectedDate: new Date().toISOString().split('T')[0],
  });

  const generatePlanning = useCallback(async () => {
    setState(s => ({ ...s, isGenerating: true }));
    
    const startDate = new Date(state.selectedDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    
    const schedule = await generateSchedule(
      {
        startDate,
        endDate,
        teams: state.teams,
        equipment: [],
        clients: state.clients,
        oneOffRequests: [],
        optimizationCriteria: 'distance',
        maxDrivingTimePerDayMinutes: 120,
        allowWeekendWork: false,
        weatherBufferDays: 1,
      },
      async (date, loc) => getMockWeather(date)
    );
    
    setState(s => ({ ...s, schedule, isGenerating: false }));
  }, [state.selectedDate, state.clients, state.teams]);

  const selectedDateRoutes = state.schedule?.routes.filter(
    r => r.date.toISOString().split('T')[0] === state.selectedDate
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Optimiseur de tournées</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <input
              type="date"
              value={state.selectedDate}
              onChange={e => setState(s => ({ ...s, selectedDate: e.target.value }))}
              className="border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={generatePlanning}
            disabled={state.isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {state.isGenerating ? 'Génération...' : 'Générer le planning'}
          </button>
          {state.schedule && (
            <div className="text-sm text-gray-600">
              {state.schedule.stats.totalInterventions} interventions • {state.schedule.stats.totalDistanceKm}km • {state.schedule.stats.totalDrivingTimeHours}h de route
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-[500px]">
          <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {state.clients.map(client => (
              <Marker
                key={client.id}
                position={[client.location.lat, client.location.lng]}
                icon={clientIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.location.address}</p>
                    {client.contract && (
                      <div className="mt-2 text-sm">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {client.contract.recurrence}
                        </span>
                        <span className="ml-2 text-gray-500">{client.contract.durationMinutes}min</span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedDateRoutes.map(route => {
              const team = state.teams.find(t => t.id === route.teamId);
              const positions = [
                [route.startLocation.lat, route.startLocation.lng],
                ...route.interventions.map(i => {
                  const client = state.clients.find(c => c.id === i.clientId);
                  return client ? [client.location.lat, client.location.lng] : null;
                }).filter(Boolean),
              ];
              return (
                <Polyline
                  key={route.teamId}
                  positions={positions as [number, number][]}
                  color={team?.color || '#666'}
                  weight={4}
                  opacity={0.7}
                />
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Planning détaillé */}
      {state.schedule && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedDateRoutes.map(route => {
            const team = state.teams.find(t => t.id === route.teamId);
            return (
              <div key={route.teamId} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: team?.color }}
                  />
                  <h3 className="font-bold text-lg">{team?.name}</h3>
                  <span className="text-sm text-gray-500 ml-auto">
                    {route.totalDistanceKm}km • {Math.round(route.totalWorkTimeMinutes / 60 * 10) / 10}h travail
                  </span>
                </div>
                <div className="space-y-3">
                  {route.interventions.map((intervention, idx) => {
                    const client = state.clients.find(c => c.id === intervention.clientId);
                    return (
                      <div
                        key={intervention.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{client?.name}</div>
                          <div className="text-sm text-gray-500">
                            {intervention.estimatedStartTime} • {intervention.estimatedDurationMinutes}min
                            {intervention.estimatedTravelDistanceKm > 0 && (
                              <span className="ml-2 text-blue-600">
                                ({intervention.estimatedTravelDistanceKm}km depuis précédent)
                              </span>
                            )}
                          </div>
                          {intervention.weatherForecast && (
                            <div className="text-xs mt-1">
                              {intervention.weatherForecast.condition === 'rain' ? (
                                <span className="text-orange-600">⚠️ Pluie prévue</span>
                              ) : intervention.weatherForecast.windSpeed > 25 ? (
                                <span className="text-orange-600">⚠️ Vent {intervention.weatherForecast.windSpeed}km/h</span>
                              ) : (
                                <span className="text-green-600">✓ Météo OK</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Légende */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h4 className="font-medium mb-2">Comment ça marche :</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Les clients avec contrats récurrents sont automatiquement planifiés selon leur fréquence</li>
          <li>L'algorithme optimise les trajets (plus proche voisin) pour minimiser la distance</li>
          <li>La météo est vérifiée pour chaque intervention (pas de taille si vent fort)</li>
          <li>Les contraintes d'équipes (congés, compétences) sont respectées</li>
          <li>Les urgences sont priorisées et peuvent décaler d'autres interventions</li>
        </ul>
      </div>
    </div>
  );
}
