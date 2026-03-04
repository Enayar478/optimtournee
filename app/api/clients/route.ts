import { NextResponse } from "next/server";
import { Client } from "@/types/domain";
import { MOCK_CLIENTS } from "@/lib/data/mock-data";

// Stockage en mémoire initialisé avec les données mockées
let clients: Client[] = [...MOCK_CLIENTS];

export async function GET() {
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newClient: Client = {
      id: `c${Date.now()}`,
      name: body.name,
      location: body.location,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      notes: body.notes,
      contract: body.contract,
    };
    clients.push(newClient);
    return NextResponse.json(newClient, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const index = clients.findIndex((c) => c.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    clients[index] = { ...clients[index], ...body };
    return NextResponse.json(clients[index]);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    clients = clients.filter((c) => c.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
