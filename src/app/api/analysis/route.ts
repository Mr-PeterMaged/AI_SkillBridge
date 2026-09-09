import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { createAnalysisSchema } from "@/lib/validation/analysis";
import { checkRateLimit } from "@/lib/rate-limit";
import { FREE_PLAN_MONTHLY_ANALYSIS_LIMIT } from "@/lib/config/pricing";

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

  const rl = checkRateLimit(`create-analysis:${userId}`, 10, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many analyses created recently. Please try again later." }, { status: 429 });
  }

  const user = await getOrCreateCurrentUser();

  if (user.plan === "FREE") {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCount = await prisma.analysis.count({
      where: { userId: user.id, createdAt: { gte: monthAgo } },
    });
    if (recentCount >= FREE_PLAN_MONTHLY_ANALYSIS_LIMIT) {
      return NextResponse.json(
        {
          error: "You've used your free analysis for this month. Upgrade to Starter or Pro for more.",
          code: "PLAN_LIMIT_REACHED",
        },
        { status: 402 }
      );
    }
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

  return NextResponse.json({ id: analysis.id }, { status: 201 });
}
