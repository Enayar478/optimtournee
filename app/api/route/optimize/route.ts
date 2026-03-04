import { NextResponse } from "next/server";

export interface Waypoint {
  lat: number;
  lng: number;
  id: string;
  address?: string;
}

export interface OptimizedRoute {
  waypoints: Waypoint[];
  totalDistance: number; // en mètres
  totalDuration: number; // en secondes
  geometry?: object; // GeoJSON pour Leaflet
}

// Algorithme simple du plus proche voisin (TSP approximatif)
// Pour la demo, on utilise cette approximation côté serveur
function calculateDistance(p1: Waypoint, p2: Waypoint): number {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function optimizeRouteNearestNeighbor(waypoints: Waypoint[]): OptimizedRoute {
  if (waypoints.length <= 2) {
    const totalDistance =
      waypoints.length === 2
        ? calculateDistance(waypoints[0], waypoints[1])
        : 0;
    return {
      waypoints,
      totalDistance,
      totalDuration: Math.round(totalDistance / 13.8), // ~50km/h moyenne
    };
  }

  const unvisited = [...waypoints];
  const optimized: Waypoint[] = [];

  // Commencer par le premier point
  let current = unvisited.shift()!;
  optimized.push(current);

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(current, unvisited[i]);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    current = unvisited.splice(nearestIndex, 1)[0];
    optimized.push(current);
  }

  // Calculer la distance totale
  let totalDistance = 0;
  for (let i = 0; i < optimized.length - 1; i++) {
    totalDistance += calculateDistance(optimized[i], optimized[i + 1]);
  }

  return {
    waypoints: optimized,
    totalDistance: Math.round(totalDistance),
    totalDuration: Math.round(totalDistance / 13.8), // ~50km/h en moyenne
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { waypoints }: { waypoints: Waypoint[] } = body;

    if (!waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return NextResponse.json(
        { error: "Au moins 2 points sont requis" },
        { status: 400 }
      );
    }

    const optimizedRoute = optimizeRouteNearestNeighbor(waypoints);

    return NextResponse.json(optimizedRoute);
  } catch (error) {
    console.error("Route optimization error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'optimisation de l'itinéraire" },
      { status: 500 }
    );
  }
}
