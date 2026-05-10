import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { updateStatusSchema } from "@/lib/validation/schedule";
import {
  isValidStatusTransition,
  getAllowedTransitions,
  type InterventionStatus,
} from "@/lib/domain/intervention-status";

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
    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Statut invalide", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Verify intervention belongs to user's schedule
    const intervention = await prisma.plannedIntervention.findUnique({
      where: { id },
      include: { schedule: { select: { userId: true } } },
    });

    if (!intervention || intervention.schedule.userId !== user.id) {
      return NextResponse.json(
        { error: "Intervention non trouvée" },
        { status: 404 }
      );
    }

    const currentStatus = intervention.status as InterventionStatus;
    const nextStatus = parsed.data.status;
    if (!isValidStatusTransition(currentStatus, nextStatus)) {
      return NextResponse.json(
        {
          error: `Transition de statut invalide : ${currentStatus} → ${nextStatus}`,
          code: "invalid_status_transition",
          allowedTransitions: getAllowedTransitions(currentStatus),
        },
        { status: 409 }
      );
    }

    const updated = await prisma.plannedIntervention.update({
      where: { id },
      data: { status: nextStatus },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API /interventions/:id/status PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
