import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { teamMemberFullSchema } from "@/lib/validation/team-member";

export async function GET(
  _req: Request,
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
      include: { members: true },
    });
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    return NextResponse.json(team.members);
  } catch (error) {
    console.error("[API /teams/[id]/members GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const result = teamMemberFullSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const v = result.data;
    const member = await prisma.teamMember.create({
      data: {
        teamId: id,
        firstName: v.firstName,
        lastName: v.lastName,
        phone: v.phone || null,
        email: v.email || null,
        emergencyContact: v.emergencyContact || null,
        licenseTypes: v.licenseTypes,
        skills: v.skills,
        unavailableDates: v.unavailableDates.map((d) => new Date(d)),
        notes: v.notes || null,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("[API /teams/[id]/members POST]", error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}
