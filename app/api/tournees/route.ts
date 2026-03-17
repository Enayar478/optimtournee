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

    const teams = await prisma.team.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, color: true },
    });

    const teamIds = teams.map((t) => t.id);
    if (teamIds.length === 0) {
      return NextResponse.json([]);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const interventions = await prisma.plannedIntervention.findMany({
      where: {
        assignedTeamId: { in: teamIds },
        scheduledDate: { gte: today, lt: tomorrow },
      },
      orderBy: [{ assignedTeamId: "asc" }, { routeOrder: "asc" }],
      include: {
        client: {
          select: {
            id: true,
            name: true,
            address: true,
            lat: true,
            lng: true,
            contactPhone: true,
          },
        },
      },
    });

    const teamMap = new Map(teams.map((t) => [t.id, t]));

    const grouped = new Map<
      string,
      {
        teamId: string;
        teamName: string;
        teamColor: string;
        interventions: typeof interventions;
        totalDistanceKm: number;
      }
    >();

    for (const intervention of interventions) {
      const teamId = intervention.assignedTeamId;
      if (!grouped.has(teamId)) {
        const team = teamMap.get(teamId);
        grouped.set(teamId, {
          teamId,
          teamName: team?.name ?? "Équipe inconnue",
          teamColor: team?.color ?? "#666",
          interventions: [],
          totalDistanceKm: 0,
        });
      }
      const group = grouped.get(teamId)!;
      group.interventions.push(intervention);
      group.totalDistanceKm += intervention.estimatedTravelDistanceKm;
    }

    const tournees = Array.from(grouped.values()).map((g) => ({
      id: g.teamId,
      nom: `Tournée ${g.teamName}`,
      equipe: g.teamName,
      couleur: g.teamColor,
      clients: g.interventions.length,
      km: Math.round(g.totalDistanceKm * 10) / 10,
      heureDebut: g.interventions[0]?.estimatedStartTime ?? "08:00",
      statut: g.interventions.every((i) => i.status === "completed")
        ? "terminee"
        : g.interventions.some((i) => i.status === "in_progress")
          ? "active"
          : "planifiee",
      interventions: g.interventions.map((i) => ({
        id: i.id,
        clientName: i.client.name,
        clientAddress: i.client.address,
        clientPhone: i.client.contactPhone,
        clientLat: i.client.lat,
        clientLng: i.client.lng,
        interventionType: i.interventionType,
        estimatedStartTime: i.estimatedStartTime,
        estimatedDurationMinutes: i.estimatedDurationMinutes,
        status: i.status,
        routeOrder: i.routeOrder,
      })),
    }));

    return NextResponse.json(tournees);
  } catch (error) {
    console.error("[API /tournees GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
