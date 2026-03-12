/**
 * Tests unitaires — /api/route/optimize
 * Pas de dépendances externes à mocker (algorithme pur)
 */

import { POST } from "../route";

const makeRequest = (body: unknown) =>
  new Request("http://localhost/api/route/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("/api/route/optimize POST", () => {
  it("retourne 400 si waypoints manquants", async () => {
    const req = makeRequest({});
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("retourne 400 si moins de 2 waypoints", async () => {
    const req = makeRequest({
      waypoints: [{ id: "w1", lat: 48.85, lng: 2.35 }],
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("retourne 400 si waypoints n'est pas un tableau", async () => {
    const req = makeRequest({ waypoints: "invalid" });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("optimise un itinéraire avec 2 points", async () => {
    const waypoints = [
      { id: "w1", lat: 48.85, lng: 2.35, address: "Paris" },
      { id: "w2", lat: 48.87, lng: 2.37, address: "Paris Nord" },
    ];
    const req = makeRequest({ waypoints });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.waypoints).toHaveLength(2);
    expect(data.totalDistance).toBeGreaterThan(0);
    expect(data.totalDuration).toBeGreaterThan(0);
  });

  it("optimise un itinéraire avec 3+ points et retourne le même nombre de waypoints", async () => {
    const waypoints = [
      { id: "w1", lat: 48.85, lng: 2.35 },
      { id: "w2", lat: 48.9, lng: 2.4 },
      { id: "w3", lat: 48.8, lng: 2.3 },
      { id: "w4", lat: 48.88, lng: 2.38 },
    ];
    const req = makeRequest({ waypoints });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.waypoints).toHaveLength(4);
    expect(data.totalDistance).toBeGreaterThan(0);
    // L'algorithme nearest-neighbor commence toujours par le premier point
    expect(data.waypoints[0].id).toBe("w1");
  });

  it("retourne 500 si JSON invalide", async () => {
    const req = new Request("http://localhost/api/route/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not valid json",
    });
    const response = await POST(req);
    expect(response.status).toBe(500);
  });
});
