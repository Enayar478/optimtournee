/**
 * Tests unitaires — /api/weather
 * Mocks: @clerk/nextjs/server (auth), @/lib/db/user (getOrCreateUser),
 *        global fetch (OpenWeather API)
 */

const mockAuth = jest.fn();
const mockGetOrCreateUser = jest.fn();
const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

jest.mock("@/lib/db/user", () => ({
  getOrCreateUser: (...args: unknown[]) => mockGetOrCreateUser(...args),
}));

import { GET } from "../route";

const makeRequest = (params: Record<string, string>) => {
  const url = new URL("http://localhost/api/weather");
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(key, val);
  }
  return new Request(url.toString());
};

describe("/api/weather GET", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, OPENWEATHER_API_KEY: "test_api_key" };
    mockAuth.mockResolvedValue({ userId: "clerk_test" });
    mockGetOrCreateUser.mockResolvedValue({
      id: "db_user_id",
      companyLat: null,
      companyLng: null,
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("fallback aux coords de l'entreprise si lat manquant", async () => {
    mockGetOrCreateUser.mockResolvedValue({
      id: "u1",
      companyLat: 50.0,
      companyLng: 3.0,
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        weather: [{ description: "ok" }],
        main: { temp: 18 },
      }),
    });
    const req = makeRequest({ lon: "2.35" });
    const response = await GET(req);
    expect(response.status).toBe(200);
    // The fetch URL should contain the user's companyLat, not the param's lon
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("lat=50");
  });

  it("fallback à Paris si ni params ni companyLat/Lng", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        weather: [{ description: "ok" }],
        main: { temp: 18 },
      }),
    });
    const req = makeRequest({});
    const response = await GET(req);
    expect(response.status).toBe(200);
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("lat=48.8566");
    expect(calledUrl).toContain("lon=2.3522");
  });

  it("retourne 401 si non authentifié", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const req = makeRequest({ lat: "48.85", lon: "2.35" });
    const response = await GET(req);
    expect(response.status).toBe(401);
  });

  it("retourne 500 si OPENWEATHER_API_KEY manquant", async () => {
    delete process.env.OPENWEATHER_API_KEY;
    const req = makeRequest({ lat: "48.85", lon: "2.35" });
    const response = await GET(req);
    expect(response.status).toBe(500);
  });

  it("retourne les données météo si la clé API est présente", async () => {
    const weatherData = {
      weather: [{ description: "ciel dégagé" }],
      main: { temp: 20 },
    };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => weatherData,
    });

    const req = makeRequest({ lat: "48.85", lon: "2.35" });
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(weatherData);
  });

  it("retourne 500 si l'API OpenWeather retourne une erreur", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
    });

    const req = makeRequest({ lat: "48.85", lon: "2.35" });
    const response = await GET(req);
    expect(response.status).toBe(500);
  });

  it("retourne 500 si fetch lève une exception réseau", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const req = makeRequest({ lat: "48.85", lon: "2.35" });
    const response = await GET(req);
    expect(response.status).toBe(500);
  });
});
