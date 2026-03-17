import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { teamMemberFullSchema } from "@/lib/validation/team-member";

type RouteParams = { params: Promise<{ id: string; memberId: string }> };

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const { id, memberId } = await params;

    const team = await prisma.team.findFirst({
      where: { id, userId: user.id },
    });
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const existing = await prisma.teamMember.findFirst({
      where: { id: memberId, teamId: id },
    });
    if (!existing)
      return NextResponse.json({ error: "Member not found" }, { status: 404 });

    const body = await req.json();
    const result = teamMemberFullSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const v = result.data;
    const member = await prisma.teamMember.update({
      where: { id: memberId },
      data: {
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

    return NextResponse.json(member);
  } catch (error) {
    console.error("[API /teams/[id]/members/[memberId] PUT]", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const { id, memberId } = await params;

    const team = await prisma.team.findFirst({
      where: { id, userId: user.id },
    });
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const existing = await prisma.teamMember.findFirst({
      where: { id: memberId, teamId: id },
    });
    if (!existing)
      return NextResponse.json({ error: "Member not found" }, { status: 404 });

    await prisma.teamMember.delete({ where: { id: memberId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /teams/[id]/members/[memberId] DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
