"use client";

import { useWeather } from "@/lib/hooks/useWeather";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets } from "lucide-react";

const weatherIcons: Record<string, React.ReactNode> = {
  "01d": <Sun className="h-8 w-8 text-yellow-500" />,
  "01n": <Sun className="h-8 w-8 text-yellow-500" />,
  "02d": <Cloud className="h-8 w-8 text-gray-400" />,
  "02n": <Cloud className="h-8 w-8 text-gray-400" />,
  "03d": <Cloud className="h-8 w-8 text-gray-400" />,
  "03n": <Cloud className="h-8 w-8 text-gray-400" />,
  "04d": <Cloud className="h-8 w-8 text-gray-600" />,
  "04n": <Cloud className="h-8 w-8 text-gray-600" />,
  "09d": <CloudRain className="h-8 w-8 text-blue-500" />,
  "09n": <CloudRain className="h-8 w-8 text-blue-500" />,
  "10d": <CloudRain className="h-8 w-8 text-blue-500" />,
  "10n": <CloudRain className="h-8 w-8 text-blue-500" />,
  "13d": <CloudSnow className="h-8 w-8 text-blue-300" />,
  "13n": <CloudSnow className="h-8 w-8 text-blue-300" />,
};

export function WeatherOverlay() {
  const {
    latitude,
    longitude,
    loading: geoLoading,
    error: geoError,
  } = useGeolocation();
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather(latitude, longitude);

  if (geoLoading || weatherLoading) {
    return (
      <div className="rounded-lg border bg-white/90 p-4 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
          <div className="space-y-1">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (geoError || weatherError || !weather) {
    return (
      <div className="rounded-lg border bg-white/90 p-4 shadow-lg backdrop-blur">
        <p className="text-sm text-gray-500">Météo indisponible</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white/90 p-4 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3">
        {weatherIcons[weather.icon] || <Cloud className="h-8 w-8" />}

        <div>
          <p className="text-2xl font-bold">{weather.temperature}°C</p>
          <p className="text-sm text-gray-600 capitalize">
            {weather.description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-4 border-t pt-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Droplets className="h-4 w-4" />
          {weather.humidity}%
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-4 w-4" />
          {weather.windSpeed} m/s
        </div>
      </div>
    </div>
  );
}
