"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { DivIcon } from "leaflet";
import type { Client, Team, Schedule } from "@/types/domain";

interface DashboardMapProps {
  clients: Client[];
  teams: Team[];
  schedule: Schedule | null;
  showWeather?: boolean;
  teamColors: { base: string; gradient: string; bg: string; light: string; text: string }[];
}

export default function DashboardMap({ 
  clients, 
  teams, 
  schedule,
  showWeather = true,
  teamColors
}: DashboardMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create pulsing icons for teams
  const createTeamIcon = (color: string) => {
    return new DivIcon({
      className: "custom-team-marker",
      html: `
        <div style="
          position: relative;
          width: 24px;
          height: 24px;
        ">
          <div style="
            position: absolute;
            inset: 0;
            background: ${color};
            border-radius: 50%;
            opacity: 0.3;
            animation: pulse 2s ease-in-out infinite;
          "></div>
          <div style="
            position: absolute;
            inset: 4px;
            background: ${color};
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 0.1; }
          }
        </style>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Client icon
  const createClientIcon = (number?: number) => {
    return new DivIcon({
      className: "custom-client-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #2D5A3D, #3D7A52);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(45, 90, 61, 0.4);
        ">
          ${number ? `<span style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 12px;">${number}</span>` : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  if (!mounted) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-forest-surface/30 to-sky-surface/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-forest/20 border-t-forest rounded-full animate-spin" />
          <span className="text-forest font-medium">Chargement de la carte...</span>
        </div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[48.8566, 2.3522]} 
      zoom={12} 
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
        url={showWeather 
          ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
      />
      
      {/* Client markers */}
      {clients.map((client, idx) => (
        <Marker 
          key={client.id} 
          position={[client.location.lat, client.location.lng]} 
          icon={createClientIcon(idx + 1)}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-[200px]">
              <p className="font-bold text-slate-800">{client.name}</p>
              <p className="text-sm text-slate-600">{client.address}</p>
              {client.serviceType && (
                <span className="inline-block mt-2 px-2 py-1 bg-forest/10 text-forest text-xs rounded-full">
                  {client.serviceType}
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Team routes */}
      {schedule?.routes.map((route, idx) => {
        const team = teams.find((t) => t.id === route.teamId);
        const color = team?.color || teamColors[idx % teamColors.length].base;
        const positions = route.interventions
          .map((i) => {
            const client = clients.find((c) => c.id === i.clientId);
            return client ? [client.location.lat, client.location.lng] : null;
          })
          .filter(Boolean) as [number, number][];

        return (
          <div key={route.teamId}>
            {/* Route line */}
            <Polyline
              positions={positions}
              color={color}
              weight={4}
              opacity={0.8}
              dashArray="10, 10"
            />
            
            {/* Team marker */}
            {positions.length > 0 && (
              <Marker
                position={positions[positions.length - 1]}
                icon={createTeamIcon(color)}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold" style={{ color }}>{team?.name}</p>
                    <p className="text-sm text-slate-600">
                      {route.interventions.length} interventions
                    </p>
                    <p className="text-sm text-slate-500">
                      {route.totalDistanceKm} km • {route.estimatedDurationMinutes} min
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </div>
        );
      })}
    </MapContainer>
  );
}
