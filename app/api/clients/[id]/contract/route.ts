import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { contractSchema } from "@/lib/validation/onboarding";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const { id: clientId } = await context.params;

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = contractSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const contract = await prisma.recurringContract.create({
      data: {
        clientId,
        recurrence: result.data.recurrence,
        dayOfWeek: result.data.dayOfWeek,
        interventionType: result.data.interventionType,
        durationMinutes: result.data.durationMinutes,
        requiredEquipment: result.data.requiredEquipment,
        priority: result.data.priority,
        startDate: new Date(),
        maxWindSpeed: result.data.maxWindSpeed,
        noRainForecast: result.data.noRainForecast,
        minTemperature: result.data.minTemperature,
        maxTemperature: result.data.maxTemperature,
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("[API /clients/[id]/contract POST]", error);
    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const { id: clientId } = await context.params;

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id },
      include: { contract: true },
    });
    if (!client?.contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const result = contractSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const updated = await prisma.recurringContract.update({
      where: { id: client.contract.id },
      data: {
        recurrence: result.data.recurrence,
        dayOfWeek: result.data.dayOfWeek,
        interventionType: result.data.interventionType,
        durationMinutes: result.data.durationMinutes,
        requiredEquipment: result.data.requiredEquipment,
        priority: result.data.priority,
        maxWindSpeed: result.data.maxWindSpeed,
        noRainForecast: result.data.noRainForecast,
        minTemperature: result.data.minTemperature,
        maxTemperature: result.data.maxTemperature,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API /clients/[id]/contract PUT]", error);
    return NextResponse.json(
      { error: "Failed to update contract" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const { id: clientId } = await context.params;

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id },
      include: { contract: true },
    });
    if (!client?.contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    await prisma.recurringContract.delete({
      where: { id: client.contract.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /clients/[id]/contract DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete contract" },
      { status: 500 }
    );
  }
}
