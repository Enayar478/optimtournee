import { prisma } from '@/lib/prisma'

export async function getOrCreateUser(clerkId: string, email?: string, name?: string) {
  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email: email ?? `${clerkId}@unknown.local`,
      name: name ?? null,
    },
  })
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } })
}
