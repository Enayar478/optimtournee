import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/db/user";
import { companySchema } from "@/lib/validation/onboarding";

export async function PUT(req: Request) {
  try {
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.error("[API /onboarding/company PUT] auth() failed:", authError);
      return NextResponse.json(
        { error: "Erreur d'authentification" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user;
    try {
      user = await getOrCreateUser(userId);
    } catch (dbError) {
      console.error("[API /onboarding/company PUT] getOrCreateUser failed:", dbError);
      const message = dbError instanceof Error ? dbError.message : "DB error";
      return NextResponse.json(
        { error: `Erreur utilisateur: ${message}` },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("[API /onboarding/company PUT] JSON parse failed:", parseError);
      return NextResponse.json(
        { error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    const result = companySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          companyName: result.data.companyName,
          companySiret: result.data.companySiret || null,
          companyAddress: result.data.companyAddress || null,
          companyPhone: result.data.companyPhone || null,
        },
      });
    } catch (updateError) {
      console.error("[API /onboarding/company PUT] prisma.user.update failed:", updateError);
      const message = updateError instanceof Error ? updateError.message : "Update error";
      return NextResponse.json(
        { error: `Erreur mise à jour: ${message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      companyName: result.data.companyName,
      companySiret: result.data.companySiret ?? "",
      companyAddress: result.data.companyAddress ?? "",
      companyPhone: result.data.companyPhone ?? "",
    });
  } catch (error) {
    console.error("[API /onboarding/company PUT] Unexpected error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
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
