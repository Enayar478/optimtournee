/**
 * Tests unitaires — /api/interventions/[id]/status
 * Verifies the state machine guard (BUG-C11) is enforced at the API layer.
 */

const mockAuth = jest.fn();
const mockGetOrCreateUser = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    plannedIntervention: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

jest.mock("@/lib/db/user", () => ({
  getOrCreateUser: (...args: unknown[]) => mockGetOrCreateUser(...args),
}));

import { PATCH } from "../route";

const DB_USER = { id: "db_user_id", clerkId: "clerk_test", email: "u@e.fr" };

const makeReq = (body: unknown) =>
  new Request("http://localhost/api/interventions/i1/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const ctx = (id = "i1") => ({ params: Promise.resolve({ id }) });

describe("/api/interventions/[id]/status PATCH", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: "clerk_test" });
    mockGetOrCreateUser.mockResolvedValue(DB_USER);
  });

  it("retourne 401 si non authentifié", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await PATCH(makeReq({ status: "completed" }), ctx());
    expect(res.status).toBe(401);
  });

  it("retourne 400 si statut absent du body", async () => {
    const res = await PATCH(makeReq({}), ctx());
    expect(res.status).toBe(400);
  });

  it("retourne 404 si l'intervention appartient à un autre utilisateur", async () => {
    mockFindUnique.mockResolvedValue({
      id: "i1",
      status: "planned",
      schedule: { userId: "another_user" },
    });
    const res = await PATCH(makeReq({ status: "in_progress" }), ctx());
    expect(res.status).toBe(404);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("autorise planned → in_progress et persiste", async () => {
    mockFindUnique.mockResolvedValue({
      id: "i1",
      status: "planned",
      schedule: { userId: DB_USER.id },
    });
    mockUpdate.mockResolvedValue({ id: "i1", status: "in_progress" });

    const res = await PATCH(makeReq({ status: "in_progress" }), ctx());
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "i1" },
        data: { status: "in_progress" },
      })
    );
  });

  it("rejette completed → planned avec 409 et liste les transitions valides", async () => {
    mockFindUnique.mockResolvedValue({
      id: "i1",
      status: "completed",
      schedule: { userId: DB_USER.id },
    });

    const res = await PATCH(makeReq({ status: "planned" }), ctx());
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.code).toBe("invalid_status_transition");
    expect(body.allowedTransitions).toEqual(["completed"]);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("rejette in_progress → planned (pas de retour arrière)", async () => {
    mockFindUnique.mockResolvedValue({
      id: "i1",
      status: "in_progress",
      schedule: { userId: DB_USER.id },
    });

    const res = await PATCH(makeReq({ status: "planned" }), ctx());
    expect(res.status).toBe(409);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("autorise une self-transition idempotente (planned → planned)", async () => {
    mockFindUnique.mockResolvedValue({
      id: "i1",
      status: "planned",
      schedule: { userId: DB_USER.id },
    });
    mockUpdate.mockResolvedValue({ id: "i1", status: "planned" });

    const res = await PATCH(makeReq({ status: "planned" }), ctx());
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();
  });
});
