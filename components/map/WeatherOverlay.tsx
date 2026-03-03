"use client";

import { useWeather } from "@/lib/hooks/useWeather";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets } from "lucide-react";

const weatherIcons: Record<string, React.ReactNode> = {
  "01d": <Sun className="w-8 h-8 text-yellow-500" />,
  "01n": <Sun className="w-8 h-8 text-yellow-500" />,
  "02d": <Cloud className="w-8 h-8 text-gray-400" />,
  "02n": <Cloud className="w-8 h-8 text-gray-400" />,
  "03d": <Cloud className="w-8 h-8 text-gray-400" />,
  "03n": <Cloud className="w-8 h-8 text-gray-400" />,
  "04d": <Cloud className="w-8 h-8 text-gray-600" />,
  "04n": <Cloud className="w-8 h-8 text-gray-600" />,
  "09d": <CloudRain className="w-8 h-8 text-blue-500" />,
  "09n": <CloudRain className="w-8 h-8 text-blue-500" />,
  "10d": <CloudRain className="w-8 h-8 text-blue-500" />,
  "10n": <CloudRain className="w-8 h-8 text-blue-500" />,
  "13d": <CloudSnow className="w-8 h-8 text-blue-300" />,
  "13n": <CloudSnow className="w-8 h-8 text-blue-300" />,
};

export function WeatherOverlay() {
  const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather(latitude, longitude);

  if (geoLoading || weatherLoading) {
    return (
      <div className="bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg border">
        <div className="flex items-center gap-3">
          <div className="animate-pulse w-8 h-8 bg-gray-200 rounded" />
          <div className="space-y-1">
            <div className="animate-pulse h-4 w-20 bg-gray-200 rounded" />
            <div className="animate-pulse h-3 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (geoError || weatherError || !weather) {
    return (
      <div className="bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg border">
        <p className="text-sm text-gray-500">
          Météo indisponible
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg border">
      <div className="flex items-center gap-3">
        {weatherIcons[weather.icon] || <Cloud className="w-8 h-8" />}
        
        <div>
          <p className="text-2xl font-bold">{weather.temperature}°C</p>
          <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
        </div>
      </div>
      
      <div className="flex gap-4 mt-3 pt-3 border-t text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Droplets className="w-4 h-4" />
          {weather.humidity}%
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4" />
          {weather.windSpeed} m/s
        </div>
      </div>
    </div>
  );
}
