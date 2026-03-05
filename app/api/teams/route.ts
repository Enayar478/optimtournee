import { NextResponse } from "next/server";
import { Team } from "@/types/domain";
import { MOCK_TEAMS } from "@/lib/data/mock-data";

// Stockage en mémoire initialisé avec les données mockées
let teams: Team[] = [...MOCK_TEAMS];

export async function GET() {
  return NextResponse.json(teams);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTeam: Team = {
      id: `t${Date.now()}`,
      ...body,
    };
    teams.push(newTeam);
    return NextResponse.json(newTeam, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const index = teams.findIndex((t) => t.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    teams[index] = { ...teams[index], ...body };
    return NextResponse.json(teams[index]);
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
    teams = teams.filter((t) => t.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
