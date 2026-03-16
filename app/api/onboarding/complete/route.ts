import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);

    if (user.onboardingCompleted) {
      return NextResponse.json({ success: true });
    }

    const [clientCount, teamCount] = await Promise.all([
      prisma.client.count({ where: { userId: user.id } }),
      prisma.team.count({ where: { userId: user.id } }),
    ]);

    if (clientCount === 0 || teamCount === 0) {
      return NextResponse.json(
        { error: "Vous devez avoir au moins 1 client et 1 équipe" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /onboarding/complete POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
