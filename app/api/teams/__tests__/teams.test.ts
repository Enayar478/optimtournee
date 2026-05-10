/**
 * Tests unitaires — /api/teams
 * Mocks: @clerk/nextjs/server, @/lib/prisma, @/lib/db/user
 */

const mockAuth = jest.fn();
const mockTeamFindMany = jest.fn();
const mockTeamFindFirst = jest.fn();
const mockTeamCreate = jest.fn();
const mockTeamUpdate = jest.fn();
const mockTeamDelete = jest.fn();
const mockTeamMemberDeleteMany = jest.fn();
const mockTeamMemberCreateMany = jest.fn();
const mockTransaction = jest.fn();
const mockGetOrCreateUser = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    team: {
      findMany: (...args: unknown[]) => mockTeamFindMany(...args),
      findFirst: (...args: unknown[]) => mockTeamFindFirst(...args),
      create: (...args: unknown[]) => mockTeamCreate(...args),
      update: (...args: unknown[]) => mockTeamUpdate(...args),
      delete: (...args: unknown[]) => mockTeamDelete(...args),
    },
    teamMember: {
      deleteMany: (...args: unknown[]) => mockTeamMemberDeleteMany(...args),
      createMany: (...args: unknown[]) => mockTeamMemberCreateMany(...args),
    },
    $transaction: (...args: unknown[]) => mockTransaction(...args),
  },
}));

jest.mock("@/lib/db/user", () => ({
  getOrCreateUser: (...args: unknown[]) => mockGetOrCreateUser(...args),
}));

import { GET, POST, PUT, DELETE } from "../route";

const DB_USER = {
  id: "db_user_id",
  clerkId: "user_test123",
  email: "test@test.com",
  name: null,
};

const makeRequest = (
  method: string,
  body?: unknown,
  url = "http://localhost/api/teams"
) =>
  new Request(url, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    headers:
      body !== undefined ? { "Content-Type": "application/json" } : undefined,
  });

describe("/api/teams", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: "user_test123" });
    mockGetOrCreateUser.mockResolvedValue(DB_USER);
  });

  // ─── GET ───────────────────────────────────────────────────────────────────

  describe("GET", () => {
    it("retourne 401 si non authentifié", async () => {
      mockAuth.mockResolvedValue({ userId: null });
      const response = await GET();
      expect(response.status).toBe(401);
    });

    it("retourne la liste des équipes", async () => {
      const fakeTeams = [
        { id: "t1", name: "Équipe Alpha", members: [] },
        { id: "t2", name: "Équipe Beta", members: [] },
      ];
      mockTeamFindMany.mockResolvedValue(fakeTeams);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(mockTeamFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: DB_USER.id } })
      );
    });
  });

  // ─── POST ──────────────────────────────────────────────────────────────────

  describe("POST", () => {
    it("retourne 401 si non authentifié", async () => {
      mockAuth.mockResolvedValue({ userId: null });
      const req = makeRequest("POST", { name: "Test Team" });
      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it("crée une nouvelle équipe et retourne 201", async () => {
      const newTeam = {
        id: "t3",
        name: "Équipe Gamma",
        color: "#22c55e",
        members: [{ id: "m1", firstName: "Jean", lastName: "Dupont" }],
      };
      mockTeamCreate.mockResolvedValue(newTeam);

      const req = makeRequest("POST", {
        name: "Équipe Gamma",
        color: "#22c55e",
        members: [{ firstName: "Jean", lastName: "Dupont" }],
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe("Équipe Gamma");
      expect(mockTeamCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: DB_USER.id,
            name: "Équipe Gamma",
          }),
        })
      );
    });

    it("rejette une équipe sans membres (validation schema: min 1)", async () => {
      const req = makeRequest("POST", {
        name: "Équipe Solo",
        color: "#2D5A3D",
        members: [],
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
      expect(mockTeamCreate).not.toHaveBeenCalled();
    });

    it("retourne 500 si Prisma lève une exception", async () => {
      mockTeamCreate.mockRejectedValue(new Error("DB error"));
      const req = makeRequest("POST", {
        name: "Broken Team",
        color: "#2D5A3D",
        members: [{ firstName: "Jean", lastName: "Dupont" }],
      });
      const response = await POST(req);
      expect(response.status).toBe(500);
    });
  });

  // ─── PUT ───────────────────────────────────────────────────────────────────

  describe("PUT", () => {
    it("retourne 401 si non authentifié", async () => {
      mockAuth.mockResolvedValue({ userId: null });
      const req = makeRequest("PUT", { id: "t1", name: "Updated" });
      const response = await PUT(req);
      expect(response.status).toBe(401);
    });

    it("retourne 400 si id manquant", async () => {
      const req = makeRequest("PUT", { name: "No ID" });
      const response = await PUT(req);
      expect(response.status).toBe(400);
    });

    it("met à jour une équipe existante", async () => {
      const updated = {
        id: "t1",
        name: "Équipe Mise à Jour",
        color: "#ff0000",
        members: [{ firstName: "Jean", lastName: "Dupont" }],
      };
      mockTeamFindFirst.mockResolvedValue({ id: "t1" });
      mockTeamUpdate.mockResolvedValue(updated);
      mockTransaction.mockImplementation(async (cb) => {
        const tx = {
          teamMember: {
            deleteMany: mockTeamMemberDeleteMany,
            createMany: mockTeamMemberCreateMany,
          },
          team: { update: mockTeamUpdate },
        };
        return cb(tx);
      });

      const req = makeRequest("PUT", {
        id: "t1",
        name: "Équipe Mise à Jour",
        color: "#ff0000",
        members: [{ firstName: "Jean", lastName: "Dupont" }],
      });
      const response = await PUT(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe("Équipe Mise à Jour");
      expect(mockTeamFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "t1", userId: DB_USER.id } })
      );
      expect(mockTeamUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "t1" } })
      );
    });

    it("retourne 404 si l'équipe n'appartient pas à l'utilisateur", async () => {
      mockTeamFindFirst.mockResolvedValue(null);
      const req = makeRequest("PUT", {
        id: "t1",
        name: "Foreign Team",
        color: "#2D5A3D",
        members: [{ firstName: "X", lastName: "Y" }],
      });
      const response = await PUT(req);
      expect(response.status).toBe(404);
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    it("retourne 500 si la transaction échoue", async () => {
      mockTeamFindFirst.mockResolvedValue({ id: "t99" });
      mockTransaction.mockRejectedValue(new Error("DB error"));
      const req = makeRequest("PUT", {
        id: "t99",
        name: "Ghost Team",
        color: "#2D5A3D",
        members: [{ firstName: "X", lastName: "Y" }],
      });
      const response = await PUT(req);
      expect(response.status).toBe(500);
    });
  });

  // ─── DELETE ────────────────────────────────────────────────────────────────

  describe("DELETE", () => {
    it("retourne 401 si non authentifié", async () => {
      mockAuth.mockResolvedValue({ userId: null });
      const req = makeRequest(
        "DELETE",
        undefined,
        "http://localhost/api/teams?id=t1"
      );
      const response = await DELETE(req);
      expect(response.status).toBe(401);
    });

    it("retourne 400 si id manquant", async () => {
      const req = makeRequest(
        "DELETE",
        undefined,
        "http://localhost/api/teams"
      );
      const response = await DELETE(req);
      expect(response.status).toBe(400);
    });

    it("supprime une équipe et retourne success", async () => {
      mockTeamDelete.mockResolvedValue({ id: "t1" });

      const req = makeRequest(
        "DELETE",
        undefined,
        "http://localhost/api/teams?id=t1"
      );
      const response = await DELETE(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockTeamDelete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "t1", userId: DB_USER.id } })
      );
    });

    it("retourne 500 si Prisma lève une exception", async () => {
      mockTeamDelete.mockRejectedValue(new Error("Not found"));
      const req = makeRequest(
        "DELETE",
        undefined,
        "http://localhost/api/teams?id=t99"
      );
      const response = await DELETE(req);
      expect(response.status).toBe(500);
    });
  });
});
