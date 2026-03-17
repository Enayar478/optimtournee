import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db/user";

function mapCondition(owmMain: string): string {
  const map: Record<string, string> = {
    Clear: "clear",
    Clouds: "cloudy",
    Rain: "rain",
    Drizzle: "rain",
    Thunderstorm: "storm",
    Snow: "snow",
    Mist: "cloudy",
    Fog: "cloudy",
  };
  return map[owmMain] || "clear";
}

export async function GET(request: Request) {
  // Auth obligatoire
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Clé API non configurée" },
      { status: 500 }
    );
  }

  // Resolve coordinates: from params (validated), or from user's company address
  let useLat: number | null = null;
  let useLon: number | null = null;

  if (lat && lon) {
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    // Validate coordinate bounds
    if (
      !isNaN(parsedLat) &&
      !isNaN(parsedLon) &&
      parsedLat >= -90 &&
      parsedLat <= 90 &&
      parsedLon >= -180 &&
      parsedLon <= 180
    ) {
      useLat = parsedLat;
      useLon = parsedLon;
    }
  }

  if (useLat === null || useLon === null) {
    const user = await getOrCreateUser(userId);
    if (user.companyLat && user.companyLng) {
      useLat = user.companyLat;
      useLon = user.companyLng;
    }
  }

  // Fallback to Paris
  if (useLat === null || useLon === null) {
    useLat = 48.8566;
    useLon = 2.3522;
  }

  try {
    if (mode === "forecast") {
      // 5-day / 3-hour forecast
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${useLat}&lon=${useLon}&appid=${apiKey}&units=metric&lang=fr`,
        { next: { revalidate: 1800 } }
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      const data = await response.json();

      // Group by day and compute daily aggregates
      const dayMap = new Map<
        string,
        {
          temps: number[];
          winds: number[];
          condition: string;
          description: string;
        }
      >();

      for (const item of data.list) {
        const dateKey = item.dt_txt.split(" ")[0];
        const entry = dayMap.get(dateKey) ?? {
          temps: [],
          winds: [],
          condition: "clear",
          description: "",
        };
        entry.temps.push(item.main.temp);
        entry.winds.push(item.wind.speed * 3.6); // m/s to km/h
        // Use the midday condition as representative
        const hour = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);
        if (hour >= 11 && hour <= 14) {
          entry.condition = mapCondition(item.weather[0]?.main);
          entry.description = item.weather[0]?.description ?? "";
        }
        dayMap.set(dateKey, entry);
      }

      const forecast = Array.from(dayMap.entries()).map(([date, entry]) => ({
        date,
        temperature: Math.round(
          entry.temps.reduce((a, b) => a + b, 0) / entry.temps.length
        ),
        windSpeed: Math.round(Math.max(...entry.winds)),
        condition: entry.condition,
        description: entry.description,
      }));

      return NextResponse.json(forecast);
    }

    // Current weather (default)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${useLat}&lon=${useLon}&appid=${apiKey}&units=metric&lang=fr`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la météo" },
      { status: 500 }
    );
  }
}
