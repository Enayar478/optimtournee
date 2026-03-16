import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { companySchema } from "@/lib/validation/onboarding";

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    const body = await req.json();
    const result = companySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        companyName: result.data.companyName,
        companySiret: result.data.companySiret || null,
        companyAddress: result.data.companyAddress || null,
        companyPhone: result.data.companyPhone || null,
      },
    });

    return NextResponse.json({
      companyName: result.data.companyName,
      companySiret: result.data.companySiret ?? "",
      companyAddress: result.data.companyAddress ?? "",
      companyPhone: result.data.companyPhone ?? "",
    });
  } catch (error) {
    console.error("[API /onboarding/company PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);
    return NextResponse.json({
      companyName: user.companyName ?? "",
      companySiret: user.companySiret ?? "",
      companyAddress: user.companyAddress ?? "",
      companyPhone: user.companyPhone ?? "",
    });
  } catch (error) {
    console.error("[API /onboarding/company GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
