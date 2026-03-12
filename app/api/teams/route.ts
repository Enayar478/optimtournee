import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser(userId);
  const teams = await prisma.team.findMany({
    where: { userId: user.id },
    include: { members: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(teams);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await getOrCreateUser(userId);
    const body = await req.json();
    const team = await prisma.team.create({
      data: {
        userId: user.id,
        name: body.name,
        color: body.color ?? "#2D5A3D",
        members: {
          create: (body.members ?? []).map(
            (m: {
              firstName: string;
              lastName: string;
              phone?: string;
              licenseTypes?: string[];
            }) => ({
              firstName: m.firstName,
              lastName: m.lastName,
              phone: m.phone ?? null,
              licenseTypes: m.licenseTypes ?? [],
            })
          ),
        },
      },
      include: { members: true },
    });
    return NextResponse.json(team, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await getOrCreateUser(userId);
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const team = await prisma.team.update({
      where: { id, userId: user.id },
      data: {
        name: data.name,
        color: data.color,
      },
      include: { members: true },
    });
    return NextResponse.json(team);
  } catch {
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await getOrCreateUser(userId);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.team.delete({ where: { id, userId: user.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
