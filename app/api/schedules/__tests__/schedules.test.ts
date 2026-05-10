/**
 * Tests unitaires — /api/schedules
 * Verifies BUG-C1 fix: empty scheduling input is rejected with 422 instead
 * of producing a silent zero-intervention schedule.
 */

const mockAuth = jest.fn();
const mockGetOrCreateUser = jest.fn();
const mockGenerateAndPersist = jest.fn();
const mockScheduleFindUnique = jest.fn();
const mockScheduleFindMany = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    schedule: {
      findMany: (...args: unknown[]) => mockScheduleFindMany(...args),
      findUnique: (...args: unknown[]) => mockScheduleFindUnique(...args),
    },
  },
}));

jest.mock("@/lib/db/user", () => ({
  getOrCreateUser: (...args: unknown[]) => mockGetOrCreateUser(...args),
}));

// Re-export the real EmptySchedulingInputError class so `instanceof` checks
// in the route still match. We only mock generateAndPersistSchedule.
jest.mock("@/lib/domain/scheduler-persistence", () => {
  const actual = jest.requireActual("@/lib/domain/scheduler-persistence");
  return {
    ...actual,
    generateAndPersistSchedule: (...args: unknown[]) =>
      mockGenerateAndPersist(...args),
  };
});

import { POST, GET } from "../route";
import { EmptySchedulingInputError } from "@/lib/domain/scheduler-persistence";

const DB_USER = { id: "db_user_id", clerkId: "clerk_test", email: "u@e.fr" };

const makeReq = (body: unknown) =>
  new Request("http://localhost/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const validBody = {
  startDate: "2026-06-01",
  endDate: "2026-06-07",
  name: "Semaine 23",
};

describe("/api/schedules POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: "clerk_test" });
    mockGetOrCreateUser.mockResolvedValue(DB_USER);
  });

  it("retourne 401 si non authentifié", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(401);
  });

  it("retourne 400 si dates invalides", async () => {
    const res = await POST(makeReq({ startDate: "not-a-date", endDate: "x" }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si endDate <= startDate", async () => {
    const res = await POST(
      makeReq({ startDate: "2026-06-07", endDate: "2026-06-01" })
    );
    expect(res.status).toBe(400);
  });

  it("retourne 422 quand l'utilisateur n'a aucune équipe (BUG-C1)", async () => {
    mockGenerateAndPersist.mockRejectedValue(
      new EmptySchedulingInputError("no_teams")
    );

    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe("no_teams");
    expect(body.error).toMatch(/équipe/i);
  });

  it("retourne 422 quand pas de clients/demandes à planifier (BUG-C1)", async () => {
    mockGenerateAndPersist.mockRejectedValue(
      new EmptySchedulingInputError("no_clients_or_requests")
    );

    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe("no_clients_or_requests");
  });

  it("retourne 201 + le schedule créé sur succès", async () => {
    mockGenerateAndPersist.mockResolvedValue("sch_123");
    mockScheduleFindUnique.mockResolvedValue({
      id: "sch_123",
      name: "Semaine 23",
      _count: { interventions: 12 },
    });

    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe("sch_123");
    expect(mockGenerateAndPersist).toHaveBeenCalledWith(
      DB_USER.id,
      expect.any(Date),
      expect.any(Date),
      "Semaine 23"
    );
  });

  it("retourne 500 sur erreur interne non-typée", async () => {
    mockGenerateAndPersist.mockRejectedValue(new Error("DB connection lost"));
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(500);
  });
});

describe("/api/schedules GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: "clerk_test" });
    mockGetOrCreateUser.mockResolvedValue(DB_USER);
  });

  it("retourne 401 si non authentifié", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("retourne la liste filtrée sur l'utilisateur", async () => {
    mockScheduleFindMany.mockResolvedValue([
      { id: "s1", name: "Sem 22" },
      { id: "s2", name: "Sem 23" },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(mockScheduleFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: DB_USER.id } })
    );
  });
});
