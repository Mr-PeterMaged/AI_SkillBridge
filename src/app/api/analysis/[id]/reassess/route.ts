import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { getRoleTemplate } from "@/lib/roles";
import { normalizeSkillName } from "@/lib/scoring/matching";
import { persistScoreResults } from "@/lib/scoring/persist";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ExtractedSkill } from "@/lib/ai/schemas";

/**
 * Deterministic reassessment. This route never calls the LLM and never
 * invents evidence — it only lets the user's own explicit "which skills
 * does this prove" answers (captured on each EvidenceItem) strengthen or
 * add CandidateSkill rows, then re-runs the exact same matching + scoring
 * pipeline used by the initial confirm step.
 */
export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`reassess:${userId}`, 10, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many reassessments. Please try again later." }, { status: 429 });
  }

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (analysis.status !== "SCORED" && analysis.status !== "ROADMAP_READY") {
    return NextResponse.json({ error: "Confirm your skills before requesting a reassessment." }, { status: 400 });
  }
  if (analysis.readinessScore === null) {
    return NextResponse.json({ error: "This analysis has no baseline score yet." }, { status: 400 });
  }

  const [completedTaskCount, evidenceItems, candidateSkillRows, jobRequirementRows] = await Promise.all([
    prisma.roadmapTask.count({
      where: { status: "COMPLETE", roadmapWeek: { roadmap: { analysisId: id } } },
    }),
    prisma.evidenceItem.findMany({ where: { analysisId: id } }),
    prisma.candidateSkill.findMany({ where: { analysisId: id } }),
    prisma.jobRequirement.findMany({ where: { analysisId: id } }),
  ]);

  if (completedTaskCount === 0 && evidenceItems.length === 0) {
    return NextResponse.json(
      { error: "Add evidence or complete a roadmap task before requesting a reassessment." },
      { status: 400 }
    );
  }

  const role = getRoleTemplate(analysis.targetRole);
  const previousScore = analysis.readinessScore;
  const previousBreakdown = analysis.scoreBreakdown;

  // Backfill a baseline snapshot for analyses scored before Phase 2 shipped.
  const existingBaseline = await prisma.readinessSnapshot.findFirst({
    where: { analysisId: id, kind: "BASELINE" },
  });
  if (!existingBaseline) {
    await prisma.readinessSnapshot.create({
      data: {
        analysisId: id,
        kind: "BASELINE",
        readinessScore: previousScore,
        scoreBreakdown: (previousBreakdown ?? {}) as object,
      },
    });
  }

  // Merge evidence-backed skills into the candidate skill set. The user
  // decides which skills a piece of evidence proves (provesSkills) — we only
  // canonicalize that name against this role's taxonomy, never guess it.
  const byCanonical = new Map<string, ExtractedSkill>();
  for (const s of candidateSkillRows) {
    byCanonical.set(s.canonicalName.toLowerCase(), {
      name: s.name,
      canonicalName: s.canonicalName,
      category: s.category.toLowerCase() as ExtractedSkill["category"],
      evidence: (s.evidence as string[]) ?? [],
      confidence: s.confidence,
    });
  }

  const strengthenedSkills = new Set<string>();
  for (const item of evidenceItems) {
    const provesSkills = (item.provesSkills as string[]) ?? [];
    const evidenceNote =
      item.url ?? item.reflectionBuilt ?? item.reflectionLearned ?? "Evidence submitted by the candidate.";

    for (const rawSkill of provesSkills) {
      const canonicalName = normalizeSkillName(role, rawSkill);
      const key = canonicalName.toLowerCase();
      const roleSkill = role.skills.find((s) => s.canonicalName.toLowerCase() === key);
      const existing = byCanonical.get(key);

      if (existing) {
        byCanonical.set(key, {
          ...existing,
          confidence: Math.max(existing.confidence, 0.85),
          evidence: [...existing.evidence, evidenceNote].slice(-5),
        });
      } else {
        byCanonical.set(key, {
          name: canonicalName,
          canonicalName,
          category: roleSkill?.category ?? "technical",
          evidence: [evidenceNote],
          confidence: 0.85,
        });
      }
      strengthenedSkills.add(canonicalName);
    }
  }

  const mergedCandidateSkills = Array.from(byCanonical.values());

  // Persist any newly-created or strengthened CandidateSkill rows (existing,
  // untouched skills are left exactly as they are — this is additive, not a
  // wholesale re-review like the initial confirm step).
  await Promise.all(
    mergedCandidateSkills.map((s) => {
      const existingRow = candidateSkillRows.find((r) => r.canonicalName.toLowerCase() === s.canonicalName.toLowerCase());
      if (existingRow) {
        return prisma.candidateSkill.update({
          where: { id: existingRow.id },
          data: {
            confidence: s.confidence,
            evidence: s.evidence,
            mastery: strengthenedSkills.has(s.canonicalName) ? "PROVEN" : existingRow.mastery,
            userConfirmed: true,
          },
        });
      }
      if (strengthenedSkills.has(s.canonicalName)) {
        return prisma.candidateSkill.create({
          data: {
            analysisId: id,
            name: s.name,
            canonicalName: s.canonicalName,
            category: s.category.toUpperCase() as "TECHNICAL" | "TOOL" | "SOFT",
            confidence: s.confidence,
            evidence: s.evidence,
            mastery: "PROVEN",
            status: "USER_ADDED",
            userConfirmed: true,
          },
        });
      }
      return Promise.resolve();
    })
  );

  const { matched, scoreBreakdown, gaps } = await persistScoreResults({
    analysisId: id,
    role,
    candidateSkills: mergedCandidateSkills,
    jobRequirements: jobRequirementRows.map((r) => ({
      name: r.name,
      canonicalName: r.canonicalName,
      category: r.category.toLowerCase() as "technical" | "tool" | "soft",
      priority: r.priority.toLowerCase() as "critical" | "important" | "nice_to_have",
      evidence: (r.evidence as string[]) ?? [],
    })),
  });

  const snapshot = await prisma.readinessSnapshot.create({
    data: {
      analysisId: id,
      kind: "REASSESSMENT",
      readinessScore: scoreBreakdown.readinessScore,
      scoreBreakdown: scoreBreakdown as unknown as object,
    },
  });

  return NextResponse.json({
    previousScore,
    newScore: scoreBreakdown.readinessScore,
    scoreChange: scoreBreakdown.readinessScore - previousScore,
    scoreBreakdown,
    strengthenedSkills: Array.from(strengthenedSkills),
    remainingGaps: gaps,
    matched,
    snapshot,
  });
}
