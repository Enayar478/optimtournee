import { NextResponse } from "next/server";
import { Client } from "@/types/domain";

// Stockage en mémoire (remplacé par DB plus tard)
let clients: Client[] = [
  {
    id: "c1",
    name: "M. Dupont - Villa Les Roses",
    location: {
      lat: 48.8566,
      lng: 2.3522,
      address: "12 Rue de la Paix, Paris",
    },
    contactPhone: "06 12 34 56 78",
    contactEmail: "dupont@email.com",
    notes: "Portail rouge, chien sympathique",
    contract: {
      id: "ctr1",
      clientId: "c1",
      recurrence: "weekly",
      dayOfWeek: 2,
      durationMinutes: 120,
      interventionType: "mowing",
      requiredEquipment: ["lawn_tractor", "blower"],
      weatherConstraints: {
        maxWindSpeed: 30,
        noRainForecast: true,
        minTemperature: 5,
        maxTemperature: 35,
      },
      startDate: new Date("2025-01-01"),
      priority: 3,
    },
  },
];

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
