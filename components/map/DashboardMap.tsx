"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import type { Client, Team, Schedule } from "@/types/domain";
import { motion } from "framer-motion";

// Animated markers component
function AnimatedMarkers({ 
  clients, 
  teams, 
  schedule,
  teamColors 
}: { 
  clients: Client[]; 
  teams: Team[]; 
  schedule: Schedule | null;
  teamColors: any[];
}) {
  const map = useMap();

  // Create pulsing icons for teams
  const createTeamIcon = (color: string, isActive: boolean) => {
    return new DivIcon({
      className: "custom-team-marker",
      html: `
        \u003cdiv style="
          position: relative;
          width: 24px;
          height: 24px;
        "\u003e
          \u003cdiv style="
            position: absolute;
            inset: 0;
            background: ${color};
            border-radius: 50%;
            opacity: 0.3;
            animation: pulse 2s ease-in-out infinite;
          "\u003e\u003c/div\u003e
          \u003cdiv style="
            position: absolute;
            inset: 4px;
            background: ${color};
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "\u003e\u003c/div\u003e
        \u003c/div\u003e
        \u003cstyle\u003e
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 0.1; }
          }
        \u003c/style\u003e
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Client icon with number badge
  const createClientIcon = (number?: number) => {
    return new DivIcon({
      className: "custom-client-marker",
      html: `
        \u003cdiv style="
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
        "\u003e
          ${number ? `\u003cspan style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 12px;"\u003e${number}\u003c/span\u003e` : ''}
        \u003c/div\u003e
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  return (
    \u003c\u003e
      {/* Client markers */}
      {clients.map((client, idx) => (
        \u003cMarker 
          key={client.id} 
          position={[client.location.lat, client.location.lng]} 
          icon={createClientIcon(idx + 1)}
        \u003e
          \u003cPopup className="custom-popup"\u003e
            \u003cdiv className="p-2 min-w-[200px]"\u003e
              \u003cp className="font-bold text-slate-800"\u003e{client.name}\u003c/p\u003e
              \u003cp className="text-sm text-slate-600"\u003e{client.address}\u003c/p\u003e
              {client.serviceType \u0026\u0026 (
                \u003cspan className="inline-block mt-2 px-2 py-1 bg-forest/10 text-forest text-xs rounded-full"\u003e
                  {client.serviceType}
                \u003c/span\u003e
              )}
            \u003c/div\u003e
          \u003c/Popup\u003e
        \u003c/Marker\u003e
      ))}

      {/* Team routes with animations */}
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
          \u003c\u003e
            {/* Animated route line */}
            \u003cPolyline
              key={`route-${route.teamId}`}
              positions={positions}
              color={color}
              weight={4}
              opacity={0.8}
              dashArray="10, 10"
              className="animate-dash"
            /\u003e
            
            {/* Team position marker (last position) */}
            {positions.length > 0 \u0026\u0026 (
              \u003cMarker
                position={positions[positions.length - 1]}
                icon={createTeamIcon(color, true)}
              \u003e
                \u003cPopup\u003e
                  \u003cdiv className="p-2"\u003e
                    \u003cp className="font-bold" style={{ color }}\u003e{team?.name}\u003c/p\u003e
                    \u003cp className="text-sm text-slate-600"\u003e
                      {route.interventions.length} interventions
                    \u003c/p\u003e
                    \u003cp className="text-sm text-slate-500"\u003e
                      {route.totalDistanceKm} km • {route.estimatedDurationMinutes} min
                    \u003c/p\u003e
                  \u003c/div\u003e
                \u003c/Popup\u003e
              \u003c/Marker\u003e
            )}
          \u003c/\u003e
        );
      })}
    \u003c/\u003e
  );
}

interface DashboardMapProps {
  clients: Client[];
  teams: Team[];
  schedule: Schedule | null;
  showWeather?: boolean;
  teamColors: any[];
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

  if (!mounted) {
    return (
      \u003cdiv className="h-full w-full bg-gradient-to-br from-forest-surface/30 to-sky-surface/30 flex items-center justify-center"\u003e
        \u003cdiv className="flex flex-col items-center gap-4"\u003e
          \u003cdiv className="w-12 h-12 border-4 border-forest/20 border-t-forest rounded-full animate-spin" /\u003e
          \u003cspan className="text-forest font-medium"\u003eChargement de la carte...\u003c/span\u003e
        \u003c/div\u003e
      \u003c/div\u003e
    );
  }

  return (
    \u003cMapContainer 
      center={[48.8566, 2.3522]} 
      zoom={12} 
      className="h-full w-full"
      zoomControl={false}
    \u003e
      \u003cTileLayer
        attribution='\u0026copy; \u003ca href="https://www.openstreetmap.org">OSM\u003c/a\u003e'
        url={showWeather 
          ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
      /\u003e
      
      \u003cAnimatedMarkers 
        clients={clients} 
        teams={teams} 
        schedule={schedule}
        teamColors={teamColors}
      /\u003e
    \u003c/MapContainer\u003e
  );
}
