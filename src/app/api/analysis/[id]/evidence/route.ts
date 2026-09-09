import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { createEvidenceSchema } from "@/lib/validation/evidence";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const evidence = await prisma.evidenceItem.findMany({
    where: { analysisId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ evidence });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`create-evidence:${userId}`, 30, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many evidence submissions. Please try again later." }, { status: 429 });
  }

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = createEvidenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  // A task id, if provided, must belong to THIS analysis's own roadmap —
  // otherwise a user could attach evidence to another analysis's task by
  // guessing/reusing an id (still their own data either way, but scoping
  // it correctly keeps the evidence timeline and per-task status accurate).
  if (parsed.data.roadmapTaskId) {
    const task = await prisma.roadmapTask.findFirst({
      where: { id: parsed.data.roadmapTaskId, roadmapWeek: { roadmap: { analysisId: id } } },
      select: { id: true },
    });
    if (!task) {
      return NextResponse.json({ error: "That roadmap task was not found on this analysis." }, { status: 400 });
    }
  }

  const evidence = await prisma.evidenceItem.create({
    data: {
      analysisId: id,
      roadmapTaskId: parsed.data.roadmapTaskId ?? null,
      type: parsed.data.type,
      url: parsed.data.url ?? null,
      reflectionBuilt: parsed.data.reflectionBuilt ?? null,
      reflectionLearned: parsed.data.reflectionLearned ?? null,
      provesSkills: parsed.data.provesSkills,
    },
  });

  return NextResponse.json({ evidence }, { status: 201 });
}
