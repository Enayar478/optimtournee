"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { InterventionDetail } from "@/lib/hooks/usePlanning";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

const TYPE_LABELS: Record<string, string> = {
  mowing: "Tonte",
  hedge_trimming: "Haies",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Entretien",
  emergency: "Urgence",
};

interface Props {
  interventions: InterventionDetail[];
  className?: string;
}

export function PlanningMap({ interventions, className }: Props) {
  // Group by team and build polylines
  const teamRoutes = useMemo(() => {
    const map = new Map<
      string,
      {
        team: InterventionDetail["team"];
        points: [number, number][];
        interventions: InterventionDetail[];
      }
    >();

    for (const i of interventions) {
      const entry = map.get(i.assignedTeamId) ?? {
        team: i.team,
        points: [],
        interventions: [],
      };
      entry.points.push([i.client.lat, i.client.lng]);
      entry.interventions.push(i);
      map.set(i.assignedTeamId, entry);
    }

    return Array.from(map.values());
  }, [interventions]);

  // Calculate center
  const center = useMemo<[number, number]>(() => {
    if (interventions.length === 0) return [48.8566, 2.3522];
    const lats = interventions.map((i) => i.client.lat);
    const lngs = interventions.map((i) => i.client.lng);
    return [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ];
  }, [interventions]);

  if (typeof window === "undefined") return null;

  return (
    <div className={`overflow-hidden rounded-xl border border-gray-100 ${className ?? ""}`}>
      <MapContainer
        center={center}
        zoom={11}
        className="h-full w-full"
        style={{ minHeight: 300 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Polylines per team */}
        {teamRoutes.map((route) => (
          <Polyline
            key={route.team.id}
            positions={route.points}
            pathOptions={{
              color: route.team.color,
              weight: 3,
              opacity: 0.7,
              dashArray: "8 4",
            }}
          />
        ))}

        {/* Markers */}
        {teamRoutes.flatMap((route) =>
          route.interventions.map((intervention, idx) => (
            <Marker
              key={intervention.id}
              position={[intervention.client.lat, intervention.client.lng]}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-bold">{intervention.client.name}</div>
                  <div className="text-gray-600">
                    #{idx + 1} - {route.team.name}
                  </div>
                  <div className="text-gray-500">
                    {intervention.estimatedStartTime} -{" "}
                    {TYPE_LABELS[intervention.interventionType] ?? intervention.interventionType}
                  </div>
                  <div className="text-gray-500">
                    {intervention.estimatedDurationMinutes} min
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
}
