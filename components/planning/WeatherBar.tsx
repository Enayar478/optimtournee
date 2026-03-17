"use client";

import { useState, useEffect, useMemo } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Thermometer } from "lucide-react";

interface ForecastDay {
  date: string;
  temperature: number;
  windSpeed: number;
  condition: string;
  description: string;
}

const CONDITION_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  storm: CloudLightning,
  snow: CloudSnow,
};

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

interface Props {
  weekStart: Date;
}

export function WeatherBar({ weekStart }: Props) {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await fetch(`/api/weather?mode=forecast`);
        if (!res.ok) throw new Error("Weather API error");
        const data = await res.json();
        setForecast(Array.isArray(data) ? data : []);
      } catch {
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [weekStart]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const d = addDays(weekStart, i);
        const dateKey = d.toISOString().split("T")[0];
        const dayForecast = forecast.find((f) => f.date === dateKey);
        return { date: d, dateKey, forecast: dayForecast };
      }),
    [weekStart, forecast]
  );

  if (loading || forecast.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 px-3 py-2 border border-blue-100/50">
      {weekDays.map(({ date, dateKey, forecast: dayForecast }) => {
        if (!dayForecast) {
          return (
            <div key={dateKey} className="flex min-w-[80px] flex-col items-center gap-1 px-2 py-1 text-xs text-gray-400">
              <span>{DAY_NAMES[date.getDay()]}</span>
              <span>--</span>
            </div>
          );
        }

        const Icon = CONDITION_ICON[dayForecast.condition] ?? Cloud;
        const isWarning = dayForecast.windSpeed > 40 || dayForecast.condition === "storm";

        return (
          <div
            key={dateKey}
            className={`flex min-w-[80px] flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-xs ${
              isWarning ? "bg-amber-100/60 text-amber-800" : "text-gray-700"
            }`}
          >
            <span className="font-medium">{DAY_NAMES[date.getDay()]}</span>
            <Icon className="h-5 w-5" />
            <div className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              {dayForecast.temperature}°C
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              {dayForecast.windSpeed} km/h
            </div>
          </div>
        );
      })}
    </div>
  );
}
