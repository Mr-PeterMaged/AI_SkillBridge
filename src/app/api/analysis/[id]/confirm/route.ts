import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { getRoleTemplate } from "@/lib/roles";
import { confirmSkillsSchema } from "@/lib/validation/analysis";
import { matchSkills, normalizeSkillName } from "@/lib/scoring/matching";
import { calculateReadinessScore, buildPrioritizedGaps } from "@/lib/scoring/engine";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = confirmSkillsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const role = getRoleTemplate(analysis.targetRole);
  const jobRequirements = await prisma.jobRequirement.findMany({ where: { analysisId: id } });
  if (jobRequirements.length === 0) {
    return NextResponse.json({ error: "Run extraction before confirming skills." }, { status: 400 });
  }

  const includedSkills = parsed.data.skills.filter((s) => s.include);

  // Persist the user-reviewed skill list as the source of truth going forward.
  await prisma.$transaction([
    prisma.candidateSkill.deleteMany({ where: { analysisId: id } }),
    prisma.candidateSkill.createMany({
      data: includedSkills.map((s) => ({
        analysisId: id,
        name: s.name,
        canonicalName: normalizeSkillName(role, s.canonicalName || s.name),
        category: s.category.toUpperCase() as "TECHNICAL" | "TOOL" | "SOFT",
        confidence: s.confidence,
        evidence: s.evidence,
        mastery: s.mastery ?? null,
        status: s.source === "user" ? "USER_ADDED" : "MATCHED",
        userConfirmed: true,
      })),
    }),
  ]);

  // Deterministic matching + scoring — never delegated to the LLM.
  const matched = matchSkills({
    role,
    candidateSkills: includedSkills.map((s) => ({
      name: s.name,
      canonicalName: s.canonicalName,
      category: s.category,
      evidence: s.evidence,
      confidence: s.mastery === "PROVEN" ? Math.max(s.confidence, 0.8) : s.confidence,
    })),
    jobRequirements: jobRequirements.map((r) => ({
      name: r.name,
      canonicalName: r.canonicalName,
      category: r.category.toLowerCase() as "technical" | "tool" | "soft",
      priority: r.priority.toLowerCase().replace("nice_to_have", "nice_to_have") as
        | "critical"
        | "important"
        | "nice_to_have",
      evidence: (r.evidence as string[]) ?? [],
    })),
  });

  const scoreBreakdown = calculateReadinessScore(matched);
  const gaps = buildPrioritizedGaps({ role, requirements: matched });

  const projectPicks = pickProjectRecommendations(role, gaps.map((g) => g.skillName));

  await prisma.$transaction([
    prisma.skillGap.deleteMany({ where: { analysisId: id } }),
    prisma.skillGap.createMany({
      data: gaps.map((g) => ({
        analysisId: id,
        skillName: g.skillName,
        canonicalName: g.skillName,
        priority: g.priority.toUpperCase() as "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE",
        reason: g.reason,
        suggestedProof: g.suggestedProof,
        estimatedHours: g.estimatedHours,
      })),
    }),
    prisma.projectRecommendation.deleteMany({ where: { analysisId: id } }),
    prisma.projectRecommendation.createMany({
      data: projectPicks.map((p) => ({
        analysisId: id,
        title: p.title,
        description: p.description,
        requiredSkills: p.requiredSkills,
        deliverables: p.deliverables,
        githubChecklist: p.githubChecklist,
      })),
    }),
    prisma.analysis.update({
      where: { id },
      data: {
        status: "SCORED",
        readinessScore: scoreBreakdown.readinessScore,
        scoreBreakdown: scoreBreakdown as unknown as object,
      },
    }),
  ]);

  return NextResponse.json({
    readinessScore: scoreBreakdown.readinessScore,
    scoreBreakdown,
    matched,
    gaps,
    projects: projectPicks,
  });
}

function pickProjectRecommendations(role: ReturnType<typeof getRoleTemplate>, gapSkillNames: string[]) {
  const scored = role.projects.map((project) => {
    const overlap = project.requiredSkills.filter((s) =>
      gapSkillNames.some((g) => g.toLowerCase() === s.toLowerCase())
    ).length;
    return { project, overlap };
  });
  scored.sort((a, b) => b.overlap - a.overlap);
  return scored.slice(0, 1).map((s) => s.project);
}
