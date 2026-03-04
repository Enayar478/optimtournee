"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import type { Client, Team, Schedule } from "@/types/domain";

const clientIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzIyYzU1ZSI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

interface DashboardMapProps {
  clients: Client[];
  teams: Team[];
  schedule: Schedule | null;
}

export default function DashboardMap({ clients, teams, schedule }: DashboardMapProps) {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={12} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clients.map((c) => (
        <Marker key={c.id} position={[c.location.lat, c.location.lng]} icon={clientIcon}>
          <Popup>{c.name}</Popup>
        </Marker>
      ))}
      {schedule?.routes.map((route, idx) => {
        const team = teams.find((t) => t.id === route.teamId);
        const positions = route.interventions
          .map((i) => {
            const client = clients.find((c) => c.id === i.clientId);
            return client ? [client.location.lat, client.location.lng] : null;
          })
          .filter(Boolean) as [number, number][];

        return (
          <Polyline
            key={route.teamId}
            positions={positions}
            color={team?.color || COLORS[idx % COLORS.length]}
            weight={3}
          />
        );
      })}
    </MapContainer>
  );
}
