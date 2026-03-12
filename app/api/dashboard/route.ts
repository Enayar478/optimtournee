import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await getOrCreateUser(userId);

    const [clientCount, allTeams] = await Promise.all([
      prisma.client.count({ where: { userId: user.id } }),
      prisma.team.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          members: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    const teamCount = allTeams.length;
    const teamIds = allTeams.map((t) => t.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let todayInterventions: {
      id: string;
      clientId: string;
      estimatedStartTime: string;
      estimatedDurationMinutes: number;
      estimatedTravelDistanceKm: number;
      status: string;
    }[] = [];

    if (teamIds.length > 0) {
      todayInterventions = await prisma.plannedIntervention.findMany({
        where: {
          assignedTeamId: { in: teamIds },
          scheduledDate: { gte: today, lt: tomorrow },
        },
        orderBy: { routeOrder: "asc" },
        select: {
          id: true,
          clientId: true,
          estimatedStartTime: true,
          estimatedDurationMinutes: true,
          estimatedTravelDistanceKm: true,
          status: true,
        },
      });
    }

    const totalKm = todayInterventions.reduce(
      (sum, i) => sum + i.estimatedTravelDistanceKm,
      0
    );

    const clientIds = todayInterventions.map((i) => i.clientId);
    const clients =
      clientIds.length > 0
        ? await prisma.client.findMany({
            where: { id: { in: clientIds } },
            select: { id: true, name: true, address: true },
          })
        : [];
    const clientMap = new Map(clients.map((c) => [c.id, c]));

    const todayStops = todayInterventions.map((i) => {
      const client = clientMap.get(i.clientId);
      return {
        time: i.estimatedStartTime,
        client: client?.name ?? "Client inconnu",
        address: client?.address ?? "",
        status:
          i.status === "completed"
            ? "completed"
            : i.status === "in_progress"
              ? "in-progress"
              : "pending",
      };
    });

    const teamOfDay = allTeams[0]
      ? {
          name: allTeams[0].name,
          members: allTeams[0].members.map(
            (m) => `${m.firstName} ${m.lastName.charAt(0)}.`
          ),
        }
      : null;

    return NextResponse.json({
      userName: user.name ?? "Utilisateur",
      stats: {
        kmParcourus: Math.round(totalKm * 10) / 10,
        interventions: todayInterventions.length,
        clientsTotal: clientCount,
        equipesTotal: teamCount,
      },
      todayStops,
      teamOfDay,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
