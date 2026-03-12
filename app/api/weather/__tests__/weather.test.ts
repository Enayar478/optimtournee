/**
 * Tests unitaires — /api/weather
 * Mock: global fetch
 */

const mockFetch = jest.fn();
global.fetch = mockFetch;

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
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("retourne 400 si lat manquant", async () => {
    const req = makeRequest({ lon: "2.35" });
    const response = await GET(req);
    expect(response.status).toBe(400);
  });

  it("retourne 400 si lon manquant", async () => {
    const req = makeRequest({ lat: "48.85" });
    const response = await GET(req);
    expect(response.status).toBe(400);
  });

  it("retourne 400 si lat et lon manquants", async () => {
    const req = makeRequest({});
    const response = await GET(req);
    expect(response.status).toBe(400);
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
