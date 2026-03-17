import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { updateInterventionSchema } from "@/lib/validation/schedule";

type Params = { params: Promise<{ id: string; interventionId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);
    const { id, interventionId } = await params;

    const body = await request.json();
    const parsed = updateInterventionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Vérifier que le schedule appartient à l'utilisateur
    const schedule = await prisma.schedule.findFirst({
      where: { id, userId: user.id },
    });
    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule non trouvé" },
        { status: 404 }
      );
    }

    const intervention = await prisma.plannedIntervention.findFirst({
      where: { id: interventionId, scheduleId: id },
    });
    if (!intervention) {
      return NextResponse.json(
        { error: "Intervention non trouvée" },
        { status: 404 }
      );
    }

    const updated = await prisma.plannedIntervention.update({
      where: { id: interventionId },
      data: parsed.data,
      include: {
        client: { select: { id: true, name: true, address: true } },
        team: { select: { id: true, name: true, color: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API interventions PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);
    const { id, interventionId } = await params;

    const schedule = await prisma.schedule.findFirst({
      where: { id, userId: user.id },
    });
    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que l'intervention appartient bien à ce schedule (IDOR protection)
    const intervention = await prisma.plannedIntervention.findFirst({
      where: { id: interventionId, scheduleId: id },
    });
    if (!intervention) {
      return NextResponse.json(
        { error: "Intervention non trouvée" },
        { status: 404 }
      );
    }

    await prisma.plannedIntervention.delete({ where: { id: interventionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API interventions DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
