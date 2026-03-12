import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";

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
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name: body.name,
        address: body.address,
        lat: body.lat ?? 0,
        lng: body.lng ?? 0,
        contactPhone: body.contactPhone ?? null,
        contactEmail: body.contactEmail ?? null,
        notes: body.notes ?? null,
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
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const client = await prisma.client.update({
      where: { id, userId: user.id },
      data: {
        name: data.name,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        contactPhone: data.contactPhone ?? null,
        contactEmail: data.contactEmail ?? null,
        notes: data.notes ?? null,
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

    await prisma.client.delete({ where: { id, userId: user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /clients DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
