import "server-only";
import { prisma } from "@/lib/db/prisma";
import { RoleTemplate } from "@/lib/roles/types";
import { matchSkills, MatchedRequirement } from "./matching";
import { calculateReadinessScore, buildPrioritizedGaps, ScoreBreakdown, PrioritizedGap } from "./engine";
import { ExtractedSkill, JobRequirementAI } from "@/lib/ai/schemas";

/**
 * Picks the single project recommendation whose required skills overlap the
 * most with the candidate's current priority gaps. Shared by the initial
 * confirm flow and reassessment so both stay in sync as gaps change.
 */
export function pickProjectRecommendations(role: RoleTemplate, gapSkillNames: string[]) {
  const scored = role.projects.map((project) => {
    const overlap = project.requiredSkills.filter((s) =>
      gapSkillNames.some((g) => g.toLowerCase() === s.toLowerCase())
    ).length;
    return { project, overlap };
  });
  scored.sort((a, b) => b.overlap - a.overlap);
  return scored.slice(0, 1).map((s) => s.project);
}

export type PersistScoreResult = {
  matched: MatchedRequirement[];
  scoreBreakdown: ScoreBreakdown;
  gaps: PrioritizedGap[];
  projectPicks: ReturnType<typeof pickProjectRecommendations>;
};

/**
 * The single deterministic pipeline from confirmed skills -> stored score.
 * Never delegates matching or scoring to the LLM. Used by both the initial
 * "confirm skills" flow and reassessment, so the two can never drift apart.
 */
export async function persistScoreResults(params: {
  analysisId: string;
  role: RoleTemplate;
  candidateSkills: ExtractedSkill[];
  jobRequirements: JobRequirementAI[];
  nextStatus?: "SCORED" | "ROADMAP_READY";
}): Promise<PersistScoreResult> {
  const matched = matchSkills({
    role: params.role,
    candidateSkills: params.candidateSkills,
    jobRequirements: params.jobRequirements,
  });

  const scoreBreakdown = calculateReadinessScore(matched);
  const gaps = buildPrioritizedGaps({ role: params.role, requirements: matched });
  const projectPicks = pickProjectRecommendations(params.role, gaps.map((g) => g.skillName));

  await prisma.$transaction([
    prisma.skillGap.deleteMany({ where: { analysisId: params.analysisId } }),
    prisma.skillGap.createMany({
      data: gaps.map((g) => ({
        analysisId: params.analysisId,
        skillName: g.skillName,
        canonicalName: g.skillName,
        priority: g.priority.toUpperCase() as "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE",
        reason: g.reason,
        suggestedProof: g.suggestedProof,
        estimatedHours: g.estimatedHours,
      })),
    }),
    prisma.projectRecommendation.deleteMany({ where: { analysisId: params.analysisId } }),
    prisma.projectRecommendation.createMany({
      data: projectPicks.map((p) => ({
        analysisId: params.analysisId,
        title: p.title,
        description: p.description,
        requiredSkills: p.requiredSkills,
        deliverables: p.deliverables,
        githubChecklist: p.githubChecklist,
      })),
    }),
    prisma.analysis.update({
      where: { id: params.analysisId },
      data: {
        ...(params.nextStatus ? { status: params.nextStatus } : {}),
        readinessScore: scoreBreakdown.readinessScore,
        scoreBreakdown: scoreBreakdown as unknown as object,
      },
    }),
  ]);

  return { matched, scoreBreakdown, gaps, projectPicks };
}
