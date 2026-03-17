import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { z } from "zod";

const createRequestSchema = z.object({
  clientId: z.string().min(1),
  preferredDateStart: z.string().optional(),
  preferredDateEnd: z.string().optional(),
  interventionType: z.enum([
    "mowing",
    "hedge_trimming",
    "pruning",
    "weeding",
    "planting",
    "maintenance",
    "emergency",
  ]),
  description: z.string().min(1).max(500),
  durationEstimate: z.number().int().min(15).max(480),
  priority: z.number().int().min(1).max(5).optional(),
});

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const VALID_STATUSES = [
      "pending",
      "scheduled",
      "completed",
      "cancelled",
    ] as const;
    type ValidStatus = (typeof VALID_STATUSES)[number];
    const isValidStatus = (s: string): s is ValidStatus =>
      (VALID_STATUSES as readonly string[]).includes(s);

    const statusFilter =
      statusParam && isValidStatus(statusParam) ? { status: statusParam } : {};

    const requests = await prisma.oneOffRequest.findMany({
      where: {
        userId: user.id,
        ...statusFilter,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("[API /one-off-requests GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);

    const body = await request.json();
    const parsed = createRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: { id: parsed.data.clientId, userId: user.id },
    });
    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    const oneOffRequest = await prisma.oneOffRequest.create({
      data: {
        userId: user.id,
        clientId: parsed.data.clientId,
        interventionType: parsed.data.interventionType,
        description: parsed.data.description,
        durationEstimate: parsed.data.durationEstimate,
        priority: parsed.data.priority ?? 1,
        preferredDateStart: parsed.data.preferredDateStart
          ? new Date(parsed.data.preferredDateStart)
          : null,
        preferredDateEnd: parsed.data.preferredDateEnd
          ? new Date(parsed.data.preferredDateEnd)
          : null,
      },
    });

    return NextResponse.json(oneOffRequest, { status: 201 });
  } catch (error) {
    console.error("[API /one-off-requests POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
