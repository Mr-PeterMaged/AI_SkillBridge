import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { createJobApplicationSchema } from "@/lib/validation/job-application";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateCurrentUser();
  const applications = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ applications });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateCurrentUser();
  const body = await req.json().catch(() => null);
  const parsed = createJobApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  let readinessScore: number | null = null;
  const analysisId = parsed.data.analysisId ?? null;
  if (analysisId) {
    const { analysis } = await getOwnedAnalysis(analysisId);
    if (!analysis) return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    readinessScore = analysis.readinessScore;
  }

  const application = await prisma.jobApplication.create({
    data: {
      userId: user.id,
      analysisId,
      jobTitle: parsed.data.jobTitle,
      company: parsed.data.company,
      applicationUrl: parsed.data.applicationUrl?.trim() || null,
      status: parsed.data.status,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      notes: parsed.data.notes ?? null,
      readinessScore,
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}
