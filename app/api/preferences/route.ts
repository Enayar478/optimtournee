import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { z } from "zod";

const preferencesSchema = z.object({
  optimizationCriteria: z.enum(["distance", "time", "balanced"]).optional(),
  maxDrivingTimePerDay: z.number().int().min(60).max(240).optional(),
  allowWeekendWork: z.boolean().optional(),
  weatherBufferDays: z.number().int().min(0).max(3).optional(),
  planningHorizonDays: z.number().int().min(5).max(14).optional(),
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);

    const prefs = await prisma.schedulingPreferences.findUnique({
      where: { userId: user.id },
    });

    // Return defaults if no preferences exist
    return NextResponse.json(
      prefs ?? {
        optimizationCriteria: "balanced",
        maxDrivingTimePerDay: 120,
        allowWeekendWork: false,
        weatherBufferDays: 1,
        planningHorizonDays: 7,
      }
    );
  } catch (error) {
    console.error("[API /preferences GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getOrCreateUser(userId);

    const body = await request.json();
    const parsed = preferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const prefs = await prisma.schedulingPreferences.upsert({
      where: { userId: user.id },
      update: parsed.data,
      create: { userId: user.id, ...parsed.data },
    });

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("[API /preferences PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
