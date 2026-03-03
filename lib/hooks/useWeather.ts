import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(lat: number | null, lon: number | null): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la météo");
        }

        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0]?.description || "",
          icon: data.weather[0]?.icon || "",
          humidity: data.main.humidity,
          windSpeed: data.wind?.speed || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { weather, loading, error };
}
