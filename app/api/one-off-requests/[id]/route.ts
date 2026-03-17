import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { updateRequestSchema } from "@/lib/validation/one-off-request";

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

    const existing = await prisma.oneOffRequest.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Demande non trouvée" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = updateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const VALID_TRANSITIONS: Record<string, string[]> = {
      pending: ["scheduled", "cancelled"],
      scheduled: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    const updateData: Record<string, unknown> = {};
    if (parsed.data.status !== undefined) {
      const allowed = VALID_TRANSITIONS[existing.status] ?? [];
      if (!allowed.includes(parsed.data.status)) {
        return NextResponse.json(
          {
            error: `Transition de ${existing.status} vers ${parsed.data.status} non autorisée`,
          },
          { status: 422 }
        );
      }
      updateData.status = parsed.data.status;
    }
    if (parsed.data.description !== undefined) {
      updateData.description = parsed.data.description;
    }
    if (parsed.data.preferredDateStart !== undefined) {
      updateData.preferredDateStart = new Date(parsed.data.preferredDateStart);
    }
    if (parsed.data.preferredDateEnd !== undefined) {
      updateData.preferredDateEnd = new Date(parsed.data.preferredDateEnd);
    }

    const updated = await prisma.oneOffRequest.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { name: true, address: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API /one-off-requests/[id] PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);
    const { id } = await params;

    const existing = await prisma.oneOffRequest.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Demande non trouvée" },
        { status: 404 }
      );
    }

    await prisma.oneOffRequest.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /one-off-requests/[id] DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
