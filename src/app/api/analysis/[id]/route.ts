import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { getRoleTemplate } from "@/lib/roles";
import { matchSkills } from "@/lib/scoring/matching";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const full = await prisma.analysis.findUnique({
    where: { id },
    include: {
      candidateSkills: true,
      jobRequirements: true,
      skillGaps: { orderBy: { priority: "asc" } },
      projectRecommendations: true,
      roadmap: {
        include: { weeks: { include: { tasks: true }, orderBy: { weekNumber: "asc" } } },
      },
    },
  });

  if (!full) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let matchedRequirements: ReturnType<typeof matchSkills> = [];
  if (full.status === "SCORED" || full.status === "ROADMAP_READY") {
    const role = getRoleTemplate(full.targetRole);
    matchedRequirements = matchSkills({
      role,
      candidateSkills: full.candidateSkills.map((s) => ({
        name: s.name,
        canonicalName: s.canonicalName,
        category: s.category.toLowerCase() as "technical" | "tool" | "soft",
        evidence: s.evidence as string[],
        confidence: s.mastery === "PROVEN" ? Math.max(s.confidence, 0.8) : s.confidence,
      })),
      jobRequirements: full.jobRequirements.map((r) => ({
        name: r.name,
        canonicalName: r.canonicalName,
        category: r.category.toLowerCase() as "technical" | "tool" | "soft",
        priority: r.priority.toLowerCase() as "critical" | "important" | "nice_to_have",
        evidence: r.evidence as string[],
      })),
    });
  }

  return NextResponse.json({ analysis: full, matchedRequirements });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.analysis.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
