import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { createAnalysisSchema } from "@/lib/validation/analysis";
import { EntitlementError, assertCanStartAnalysis, recordAnalysisUse } from "@/lib/billing/entitlements";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateCurrentUser();
  const analyses = await prisma.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      targetRole: true,
      status: true,
      readinessScore: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ analyses });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateCurrentUser();
  let entitlement;
  try {
    entitlement = await assertCanStartAnalysis(user);
  } catch (error) {
    if (error instanceof EntitlementError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    throw error;
  }

  const body = await req.json().catch(() => null);
  const parsed = createAnalysisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const analysis = await prisma.analysis.create({
    data: {
      userId: user.id,
      targetRole: parsed.data.targetRole,
      experienceLevel: parsed.data.experienceLevel,
      weeklyHours: parsed.data.weeklyHours,
      cvText: parsed.data.cvText,
      jobDescriptionText: parsed.data.jobDescriptionText,
      status: "DRAFT",
    },
    select: { id: true },
  });
  await recordAnalysisUse(user.id, entitlement);

  return NextResponse.json({ id: analysis.id }, { status: 201 });
}
