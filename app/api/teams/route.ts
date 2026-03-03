import { NextResponse } from "next/server";
import { Team } from "@/types/domain";

let teams: Team[] = [
  {
    id: "t1",
    name: "Équipe Alpha",
    members: [
      { id: "m1", firstName: "Jean", lastName: "Martin" },
      { id: "m2", firstName: "Paul", lastName: "Dubois" },
    ],
    assignedEquipment: ["lawn_tractor", "push_mower", "blower"],
    defaultStartLocation: { lat: 48.85, lng: 2.35, address: "Dépôt central" },
    skills: ["mowing", "weeding", "maintenance"],
    unavailableDates: [],
    workSchedule: {
      startTime: "07:00",
      endTime: "17:00",
      lunchBreakMinutes: 60,
      workingDays: [1, 2, 3, 4, 5],
    },
    color: "#22c55e",
  },
];

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
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
