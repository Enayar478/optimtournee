"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import type { Client, Team, Schedule } from "@/types/domain";
import { format } from "date-fns";

const clientIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzIyYzU1ZSI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const createNumberedIcon = (number: number, color: string) => {
  return new DivIcon({
    className: "custom-numbered-marker",
    html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

interface DashboardMapProps {
  showWeather?: boolean;
  teamColors?: { base: string; gradient: string; bg: string; light: string; text: string; }[];
  clients: Client[];
  teams: Team[];
  schedule: Schedule | null;
  selectedDay?: Date | null;
  onDaySelect?: (day: Date) => void;
}

function MapController({ schedule, selectedDay, clients }: { schedule: Schedule | null; selectedDay?: Date | null; clients: Client[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedDay && schedule) {
      const dayRoutes = schedule.routes.filter(
        r => format(r.date, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
      );
      
      if (dayRoutes.length > 0) {
        const allPositions: [number, number][] = [];
        dayRoutes.forEach(route => {
          route.interventions.forEach(i => {
            const client = clients.find(c => c.id === i.clientId);
            if (client) {
              allPositions.push([client.location.lat, client.location.lng]);
            }
          });
        });
        
        if (allPositions.length > 0) {
          map.fitBounds(allPositions, { padding: [50, 50] });
        }
      }
    }
  }, [selectedDay, schedule, clients, map]);
  
  return null;
}

export default function DashboardMap({ clients, teams, schedule, selectedDay }: DashboardMapProps) {
  const visibleRoutes = selectedDay && schedule
    ? schedule.routes.filter(r => format(r.date, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd"))
    : schedule?.routes || [];

  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={11} className="h-full w-full" style={{ background: "#f0f0f0" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController schedule={schedule} selectedDay={selectedDay} clients={clients} />
      
      {clients.map((client) => (
        <Marker key={client.id} position={[client.location.lat, client.location.lng]} icon={clientIcon} opacity={0.6}>
          <Popup>
            <div className="p-2">
              <div className="font-semibold">{client.name}</div>
              <div className="text-sm text-gray-600">{client.location.address}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {visibleRoutes.map((route) => {
        const team = teams.find((t) => t.id === route.teamId);
        const color = team?.color || "#666";
        
        const positions = route.interventions
          .map((i) => {
            const client = clients.find((c) => c.id === i.clientId);
            return client ? [client.location.lat, client.location.lng] : null;
          })
          .filter(Boolean) as [number, number][];

        return (
          <div key={route.teamId}>
            {positions.length > 1 && (
              <Polyline positions={positions} color={color} weight={4} opacity={0.8} />
            )}
            
            {route.interventions.map((intervention, idx) => {
              const client = clients.find((c) => c.id === intervention.clientId);
              if (!client) return null;
              
              return (
                <Marker
                  key={`${route.teamId}-${intervention.id}`}
                  position={[client.location.lat, client.location.lng]}
                  icon={createNumberedIcon(idx + 1, color)}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="font-bold text-lg mb-1" style={{ color }}>
                        Etape {idx + 1}
                      </div>
                      <div className="font-semibold">{client.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{client.location.address}</div>
                      <div className="text-sm bg-gray-100 rounded p-2">
                        <div>🕐 {intervention.estimatedStartTime}</div>
                        <div>⏱️ {intervention.estimatedDurationMinutes} minutes</div>
                        {intervention.estimatedTravelDistanceKm > 0 && (
                          <div>🚗 {intervention.estimatedTravelDistanceKm} km depuis precedent</div>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Equipe: {team?.name}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </div>
        );
      })}
    </MapContainer>
  );
}
