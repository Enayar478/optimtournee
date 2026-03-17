import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { addInterventionSchema } from "@/lib/validation/schedule";

export async function POST(
  request: Request,
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
    });
    if (!schedule) {
      return NextResponse.json({ error: "Schedule non trouvé" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = addInterventionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { clientId, scheduledDate, estimatedStartTime, interventionType, estimatedDurationMinutes, assignedTeamId, notes } = parsed.data;

    // Vérifier que le client et l'équipe appartiennent à l'utilisateur
    const [client, team] = await Promise.all([
      prisma.client.findFirst({ where: { id: clientId, userId: user.id } }),
      prisma.team.findFirst({ where: { id: assignedTeamId, userId: user.id } }),
    ]);

    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }
    if (!team) {
      return NextResponse.json({ error: "Équipe non trouvée" }, { status: 404 });
    }

    // Compter les interventions existantes pour le routeOrder
    const existingCount = await prisma.plannedIntervention.count({
      where: { scheduleId: id, scheduledDate: new Date(scheduledDate), assignedTeamId },
    });

    const intervention = await prisma.plannedIntervention.create({
      data: {
        scheduleId: id,
        sourceType: "oneoff",
        clientId,
        scheduledDate: new Date(scheduledDate),
        estimatedStartTime,
        interventionType,
        estimatedDurationMinutes,
        assignedTeamId,
        routeOrder: existingCount,
        notes: notes ?? null,
      },
      include: {
        client: { select: { id: true, name: true, address: true } },
        team: { select: { id: true, name: true, color: true } },
      },
    });

    // Mettre à jour les stats du schedule
    await prisma.schedule.update({
      where: { id },
      data: { totalInterventions: { increment: 1 } },
    });

    return NextResponse.json(intervention, { status: 201 });
  } catch (error) {
    console.error("[API interventions POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
