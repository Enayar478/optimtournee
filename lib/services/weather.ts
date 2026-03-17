/**
 * Service météo - OpenWeatherMap
 */

import { WeatherForecast } from "../../types/domain";

export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherForecast | undefined> {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error(`Weather API: ${res.status}`);

    const data = await res.json();

    return {
      date: new Date(),
      temperature: Math.round(data.main.temp),
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      rainProbability: data.rain ? 100 : 0,
      rainMm: data.rain?.["1h"] || 0,
      condition: mapWeatherCondition(data.weather[0]?.main),
      isSuitable: true,
    };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return undefined;
  }
}

function mapWeatherCondition(
  owmCondition: string
): WeatherForecast["condition"] {
  const map: Record<string, WeatherForecast["condition"]> = {
    Clear: "clear",
    Clouds: "cloudy",
    Rain: "rain",
    Drizzle: "rain",
    Thunderstorm: "storm",
    Snow: "snow",
    Mist: "cloudy",
    Fog: "cloudy",
  };
  return map[owmCondition] || "clear";
}

/**
 * Forecast 5 jours — utilise l'endpoint /forecast de OWM
 * Retourne un tableau de WeatherForecast groupé par jour
 */
export async function fetchWeatherForecast5Day(
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherForecast[]> {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`,
      { next: { revalidate: 1800 } }
    );

    if (!res.ok) throw new Error(`Forecast API: ${res.status}`);
    const data = await res.json();

    const dayMap = new Map<
      string,
      { temps: number[]; winds: number[]; rain: number[]; condition: string }
    >();

    for (const item of data.list) {
      const dateKey = item.dt_txt.split(" ")[0] as string;
      const entry = dayMap.get(dateKey) ?? {
        temps: [],
        winds: [],
        rain: [],
        condition: "clear",
      };
      entry.temps.push(item.main.temp);
      entry.winds.push(item.wind.speed * 3.6);
      entry.rain.push(item.pop * 100);
      const hour = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);
      if (hour >= 11 && hour <= 14) {
        entry.condition = mapWeatherCondition(item.weather[0]?.main);
      }
      dayMap.set(dateKey, entry);
    }

    return Array.from(dayMap.entries()).map(([dateStr, entry]) => ({
      date: new Date(dateStr),
      temperature: Math.round(
        entry.temps.reduce((a, b) => a + b, 0) / entry.temps.length
      ),
      windSpeed: Math.round(Math.max(...entry.winds)),
      rainProbability: Math.round(Math.max(...entry.rain)),
      rainMm: 0,
      condition: entry.condition as WeatherForecast["condition"],
      isSuitable: true,
    }));
  } catch (err) {
    console.error("Forecast fetch error:", err);
    return [];
  }
}

// Mock pour démo sans API
export function getMockWeather(date: Date): WeatherForecast {
  const conditions: WeatherForecast["condition"][] = [
    "clear",
    "cloudy",
    "rain",
    "clear",
    "clear",
  ];
  return {
    date,
    temperature: 15 + Math.floor(Math.random() * 15),
    windSpeed: 5 + Math.floor(Math.random() * 25),
    rainProbability: Math.random() * 100,
    rainMm: 0,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    isSuitable: true,
  };
}
