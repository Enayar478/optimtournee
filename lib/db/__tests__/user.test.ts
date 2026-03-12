/**
 * Tests unitaires — lib/db/user
 * Mock: @/lib/prisma
 */

const mockUserUpsert = jest.fn();
const mockUserFindUnique = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      upsert: (...args: unknown[]) => mockUserUpsert(...args),
      findUnique: (...args: unknown[]) => mockUserFindUnique(...args),
    },
  },
}));

import { getOrCreateUser, getUserByClerkId } from "../user";

describe("lib/db/user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrCreateUser", () => {
    it("crée un utilisateur avec email par défaut si non fourni", async () => {
      const fakeUser = {
        id: "db_u1",
        clerkId: "clerk_abc",
        email: "clerk_abc@unknown.local",
        name: null,
      };
      mockUserUpsert.mockResolvedValue(fakeUser);

      const result = await getOrCreateUser("clerk_abc");

      expect(result).toEqual(fakeUser);
      expect(mockUserUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clerkId: "clerk_abc" },
          create: expect.objectContaining({
            clerkId: "clerk_abc",
            email: "clerk_abc@unknown.local",
            name: null,
          }),
        })
      );
    });

    it("utilise l'email fourni si disponible", async () => {
      const fakeUser = {
        id: "db_u2",
        clerkId: "clerk_xyz",
        email: "user@example.com",
        name: "Alice",
      };
      mockUserUpsert.mockResolvedValue(fakeUser);

      const result = await getOrCreateUser(
        "clerk_xyz",
        "user@example.com",
        "Alice"
      );

      expect(result).toEqual(fakeUser);
      expect(mockUserUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            email: "user@example.com",
            name: "Alice",
          }),
        })
      );
    });

    it("retourne null pour le nom si non fourni", async () => {
      mockUserUpsert.mockResolvedValue({
        id: "db_u3",
        clerkId: "clerk_def",
        email: "test@test.com",
        name: null,
      });

      await getOrCreateUser("clerk_def", "test@test.com");

      expect(mockUserUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ name: null }),
        })
      );
    });
  });

  describe("getUserByClerkId", () => {
    it("retourne l'utilisateur si trouvé", async () => {
      const fakeUser = {
        id: "db_u1",
        clerkId: "clerk_abc",
        email: "user@test.com",
        name: "Bob",
      };
      mockUserFindUnique.mockResolvedValue(fakeUser);

      const result = await getUserByClerkId("clerk_abc");

      expect(result).toEqual(fakeUser);
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { clerkId: "clerk_abc" },
      });
    });

    it("retourne null si l'utilisateur n'existe pas", async () => {
      mockUserFindUnique.mockResolvedValue(null);

      const result = await getUserByClerkId("clerk_unknown");

      expect(result).toBeNull();
    });
  });
});
