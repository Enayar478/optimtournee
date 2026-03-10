import { PrismaClient } from "./generated/prisma/client";

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = global as unknown as { prisma: PrismaClientInstance };

export const prisma: PrismaClientInstance =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
