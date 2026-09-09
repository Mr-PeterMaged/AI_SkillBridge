import { RoleTemplate } from "@/lib/roles/types";
import { MatchedRequirement } from "./matching";

// ---------------------------------------------------------------
// Deterministic readiness score. This is the single source of
// truth for the number shown to the user — it is plain arithmetic,
// never an LLM output. See README.md "AI Safety & Determinism".
//
// Readiness Score = 70% * Critical Coverage
//                  + 20% * Important Coverage
//                  + 10% * Evidence Coverage
// ---------------------------------------------------------------

export type ScoreBreakdown = {
  readinessScore: number; // 0-100 integer
  criticalCoverage: number; // 0-1
  importantCoverage: number; // 0-1
  evidenceCoverage: number; // 0-1
  criticalTotal: number;
  criticalMatched: number;
  importantTotal: number;
  importantMatched: number;
};

function coverage(requirements: MatchedRequirement[], priority: MatchedRequirement["priority"]) {
  const subset = requirements.filter((r) => r.priority === priority);
  if (subset.length === 0) return { coverage: 1, total: 0, matched: 0 };
  // Partial matches count as half credit — present but not yet strongly evidenced.
  const matched = subset.filter((r) => r.status === "matched").length;
  const partial = subset.filter((r) => r.status === "partial").length;
  const score = (matched + partial * 0.5) / subset.length;
  return { coverage: score, total: subset.length, matched };
}

export function calculateReadinessScore(requirements: MatchedRequirement[]): ScoreBreakdown {
  const critical = coverage(requirements, "critical");
  const important = coverage(requirements, "important");

  const matchedOrPartial = requirements.filter((r) => r.status === "matched" || r.status === "partial");
  const withEvidence = matchedOrPartial.filter((r) => r.candidateEvidence.length > 0);
  const evidenceCoverage = matchedOrPartial.length === 0 ? 0 : withEvidence.length / matchedOrPartial.length;

  const raw = 0.7 * critical.coverage + 0.2 * important.coverage + 0.1 * evidenceCoverage;

  return {
    readinessScore: Math.round(raw * 100),
    criticalCoverage: critical.coverage,
    importantCoverage: important.coverage,
    evidenceCoverage,
    criticalTotal: critical.total,
    criticalMatched: critical.matched,
    importantTotal: important.total,
    importantMatched: important.matched,
  };
}

export type PrioritizedGap = {
  skillName: string;
  priority: MatchedRequirement["priority"];
  reason: string;
  suggestedProof: string;
  estimatedHours: number;
};

/** Builds the prioritized gap list from missing/partial requirements, using role template copy as fallback. */
export function buildPrioritizedGaps(params: {
  role: RoleTemplate;
  requirements: MatchedRequirement[];
}): PrioritizedGap[] {
  const priorityOrder: Record<MatchedRequirement["priority"], number> = {
    critical: 0,
    important: 1,
    nice_to_have: 2,
  };

  const gaps = params.requirements.filter((r) => r.status === "missing" || r.status === "partial");

  return gaps
    .map((gap) => {
      const roleSkill = params.role.skills.find(
        (s) => s.canonicalName.toLowerCase() === gap.canonicalName.toLowerCase()
      );
      return {
        skillName: roleSkill?.canonicalName ?? gap.canonicalName,
        priority: gap.priority,
        reason:
          roleSkill?.whyItMatters ??
          `This skill is required by the target job description but wasn't clearly demonstrated in your profile.`,
        suggestedProof: roleSkill?.suggestedProof ?? "A small project or documented experience showing this skill in use.",
        estimatedHours: roleSkill?.estimatedHours ?? 4,
      };
    })
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
