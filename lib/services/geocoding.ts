/**
 * Geocoding service using Nominatim (OpenStreetMap)
 * Centralized — used by AddressInput and import utilities
 */

export interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "OptimTournee/1.0";

/**
 * Search for addresses with autocomplete results
 */
export async function searchAddress(
  query: string,
  limit = 5
): Promise<GeoResult[]> {
  if (query.trim().length < 3) return [];

  try {
    const params = new URLSearchParams({
      format: "json",
      q: query,
      limit: String(limit),
      addressdetails: "1",
      countrycodes: "fr,be,ch,lu",
    });

    const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) return [];

    const data: NominatimResult[] = await res.json();

    return data.map((item) => {
      const addr = item.address;
      const houseNumber = addr.house_number ?? "";
      const road = addr.road ?? addr.pedestrian ?? "";
      const street = [houseNumber, road].filter(Boolean).join(" ");
      const city =
        addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? "";

      return {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
        street,
        city,
        postcode: addr.postcode ?? "",
        country: addr.country ?? "France",
      };
    });
  } catch {
    return [];
  }
}

/**
 * Geocode a full address string (legacy helper)
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const results = await searchAddress(address, 1);
  if (results.length > 0) {
    return { lat: results[0].lat, lng: results[0].lng };
  }
  return null;
}

/**
 * Build a full address string from structured parts
 */
export function buildFullAddress(parts: {
  street: string;
  city: string;
  postcode: string;
  country: string;
}): string {
  return [parts.street, [parts.postcode, parts.city].filter(Boolean).join(" "), parts.country]
    .filter(Boolean)
    .join(", ");
}
