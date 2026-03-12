/**
 * Tests unitaires — /api/clients
 * Mocks: @clerk/nextjs/server, @/lib/prisma, @/lib/db/user
 */

const mockAuth = jest.fn();
const mockClientFindMany = jest.fn();
const mockClientCreate = jest.fn();
const mockClientUpdate = jest.fn();
const mockClientDelete = jest.fn();
const mockGetOrCreateUser = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    client: {
      findMany: (...args: unknown[]) => mockClientFindMany(...args),
      create: (...args: unknown[]) => mockClientCreate(...args),
      update: (...args: unknown[]) => mockClientUpdate(...args),
      delete: (...args: unknown[]) => mockClientDelete(...args),
    },
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
  url = "http://localhost/api/clients"
) =>
  new Request(url, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    headers:
      body !== undefined ? { "Content-Type": "application/json" } : undefined,
  });

describe("/api/clients", () => {
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

    it("retourne la liste des clients", async () => {
      const fakeClients = [
        { id: "c1", name: "Client A" },
        { id: "c2", name: "Client B" },
      ];
      mockClientFindMany.mockResolvedValue(fakeClients);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(mockClientFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: DB_USER.id } })
      );
    });
  });

  // ─── POST ──────────────────────────────────────────────────────────────────

  describe("POST", () => {
    it("retourne 401 si non authentifié", async () => {
      mockAuth.mockResolvedValue({ userId: null });
      const req = makeRequest("POST", { name: "Test" });
      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it("crée un nouveau client et retourne 201", async () => {
      const newClient = {
        id: "c3",
        name: "Nouveau Client",
        address: "123 rue Test",
        lat: 48.85,
        lng: 2.35,
      };
      mockClientCreate.mockResolvedValue(newClient);

      const req = makeRequest("POST", {
        name: "Nouveau Client",
        address: "123 rue Test",
        lat: 48.85,
        lng: 2.35,
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe("Nouveau Client");
      expect(mockClientCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: DB_USER.id,
            name: "Nouveau Client",
          }),
        })
      );
    });

    it("retourne 500 si Prisma lève une exception", async () => {
      mockClientCreate.mockRejectedValue(new Error("DB error"));
      const req = makeRequest("POST", { name: "Client X" });
      const response = await POST(req);
      expect(response.status).toBe(500);
    });
  });

  // ─── PUT ───────────────────────────────────────────────────────────────────

  describe("PUT", () => {
    it("retourne 401 si non authentifié", async () => {
      mockAuth.mockResolvedValue({ userId: null });
      const req = makeRequest("PUT", { id: "c1", name: "Updated" });
      const response = await PUT(req);
      expect(response.status).toBe(401);
    });

    it("retourne 400 si id manquant", async () => {
      const req = makeRequest("PUT", { name: "No ID" });
      const response = await PUT(req);
      expect(response.status).toBe(400);
    });

    it("met à jour un client existant", async () => {
      const updated = { id: "c1", name: "Client Mis à Jour" };
      mockClientUpdate.mockResolvedValue(updated);

      const req = makeRequest("PUT", {
        id: "c1",
        name: "Client Mis à Jour",
        address: "456 avenue Test",
        lat: 48.9,
        lng: 2.4,
      });
      const response = await PUT(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe("Client Mis à Jour");
      expect(mockClientUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "c1", userId: DB_USER.id } })
      );
    });

    it("retourne 500 si Prisma lève une exception", async () => {
      mockClientUpdate.mockRejectedValue(new Error("Not found"));
      const req = makeRequest("PUT", { id: "c99", name: "Ghost" });
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
        "http://localhost/api/clients?id=c1"
      );
      const response = await DELETE(req);
      expect(response.status).toBe(401);
    });

    it("retourne 400 si id manquant", async () => {
      const req = makeRequest(
        "DELETE",
        undefined,
        "http://localhost/api/clients"
      );
      const response = await DELETE(req);
      expect(response.status).toBe(400);
    });

    it("supprime un client et retourne success", async () => {
      mockClientDelete.mockResolvedValue({ id: "c1" });

      const req = makeRequest(
        "DELETE",
        undefined,
        "http://localhost/api/clients?id=c1"
      );
      const response = await DELETE(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockClientDelete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "c1", userId: DB_USER.id } })
      );
    });

    it("retourne 500 si Prisma lève une exception", async () => {
      mockClientDelete.mockRejectedValue(new Error("Not found"));
      const req = makeRequest(
        "DELETE",
        undefined,
        "http://localhost/api/clients?id=c99"
      );
      const response = await DELETE(req);
      expect(response.status).toBe(500);
    });
  });
});
