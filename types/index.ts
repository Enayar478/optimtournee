export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  clientName?: string;
  duration?: number; // Durée estimée sur place (minutes)
}

export interface RouteSegment {
  from: Waypoint;
  to: Waypoint;
  distance: number; // mètres
  duration: number; // secondes
}

export interface OptimizedRoute {
  waypoints: Waypoint[];
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  totalWorkTime: number; // Temps de travail total (minutes)
}

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
