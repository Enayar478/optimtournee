import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { z } from "zod";

const unavailableDatesSchema = z.object({
  dates: z.array(
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]+)?$/, "Format de date invalide")
  ),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const { id } = await params;

    const team = await prisma.team.findFirst({
      where: { id, userId: user.id },
    });
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const body = await req.json();
    const result = unavailableDatesSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const updated = await prisma.team.update({
      where: { id },
      data: {
        unavailableDates: result.data.dates.map((d) => new Date(d)),
      },
    });

    return NextResponse.json({ unavailableDates: updated.unavailableDates });
  } catch (error) {
    console.error("[API /teams/[id]/unavailable-dates PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update unavailable dates" },
      { status: 500 }
    );
  }
}
