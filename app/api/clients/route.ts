import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { clientSchema } from "@/lib/validation/client";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const clients = await prisma.client.findMany({
      where: { userId: user.id },
      include: { contract: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("[API /clients GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const body = await req.json();
    const result = clientSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }
    const v = result.data;
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name: v.name,
        address: v.address,
        lat: v.lat ?? 0,
        lng: v.lng ?? 0,
        contactPhone: v.contactPhone ?? null,
        contactEmail: v.contactEmail ?? null,
        notes: v.notes ?? null,
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("[API /clients POST]", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const result = clientSchema.safeParse(rest);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }
    const v = result.data;
    const client = await prisma.client.update({
      where: { id, userId: user.id },
      data: {
        name: v.name,
        address: v.address,
        lat: v.lat,
        lng: v.lng,
        contactPhone: v.contactPhone ?? null,
        contactEmail: v.contactEmail ?? null,
        notes: v.notes ?? null,
      },
    });
    return NextResponse.json(client);
  } catch (error) {
    console.error("[API /clients PUT]", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Cascade dependents explicitly: the DB schema uses ON DELETE RESTRICT,
    // so a plain client.delete() crashes with a FK violation as soon as the
    // client has any contract / one-off request / planned intervention.
    // We wrap the cascade in a transaction so a failure leaves no orphans.
    const owned = await prisma.client.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });
    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.recurringContract.deleteMany({ where: { clientId: id } }),
      prisma.oneOffRequest.deleteMany({ where: { clientId: id } }),
      prisma.plannedIntervention.deleteMany({ where: { clientId: id } }),
      prisma.client.delete({ where: { id } }),
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /clients DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
