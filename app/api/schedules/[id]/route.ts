import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { updateScheduleSchema } from "@/lib/validation/schedule";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);
    const { id } = await params;

    const schedule = await prisma.schedule.findFirst({
      where: { id, userId: user.id },
      include: {
        interventions: {
          orderBy: [{ scheduledDate: "asc" }, { routeOrder: "asc" }],
          include: {
            client: { select: { id: true, name: true, address: true, lat: true, lng: true, contactPhone: true } },
            team: { select: { id: true, name: true, color: true } },
          },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule non trouvé" }, { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[API /schedules/:id GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);
    const { id } = await params;

    const body = await request.json();
    const parsed = updateScheduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.schedule.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Schedule non trouvé" }, { status: 404 });
    }

    const updated = await prisma.schedule.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API /schedules/:id PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);
    const { id } = await params;

    const existing = await prisma.schedule.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Schedule non trouvé" }, { status: 404 });
    }

    await prisma.schedule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /schedules/:id DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
