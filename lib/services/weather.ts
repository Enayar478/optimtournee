/**
 * Service météo - OpenWeatherMap
 */

import { WeatherForecast } from '../../types/domain';

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
      rainMm: data.rain?.['1h'] || 0,
      condition: mapWeatherCondition(data.weather[0]?.main),
      isSuitable: true,
    };
  } catch (err) {
    console.error('Weather fetch error:', err);
    return undefined;
  }
}

function mapWeatherCondition(owmCondition: string): WeatherForecast['condition'] {
  const map: Record<string, WeatherForecast['condition']> = {
    'Clear': 'clear',
    'Clouds': 'cloudy',
    'Rain': 'rain',
    'Drizzle': 'rain',
    'Thunderstorm': 'storm',
    'Snow': 'snow',
    'Mist': 'cloudy',
    'Fog': 'cloudy',
  };
  return map[owmCondition] || 'clear';
}

// Mock pour démo sans API
export function getMockWeather(date: Date): WeatherForecast {
  const conditions: WeatherForecast['condition'][] = ['clear', 'cloudy', 'rain', 'clear', 'clear'];
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
