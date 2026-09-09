import { RoleTemplate } from "@/lib/roles/types";
import { buildAliasIndex } from "@/lib/roles";
import { ExtractedSkill, JobRequirementAI } from "@/lib/ai/schemas";

/** Normalizes a free-text skill name to this role's canonical name, if recognized. */
export function normalizeSkillName(role: RoleTemplate, rawName: string): string {
  const index = buildAliasIndex(role);
  const hit = index.get(rawName.trim().toLowerCase());
  return hit ?? rawName.trim();
}

export type MatchedRequirement = {
  canonicalName: string;
  priority: "critical" | "important" | "nice_to_have";
  category: "technical" | "tool" | "soft";
  status: "matched" | "partial" | "missing";
  candidateEvidence: string[];
  requirementEvidence: string[];
  candidateConfidence: number;
};

/**
 * Deterministically matches extracted candidate skills against extracted job
 * requirements. This is pure code — the LLM never decides match/no-match.
 *
 * Matching rule: two skills match if their canonicalized names are equal
 * (case-insensitive) after running both through the role's alias index.
 */
export function matchSkills(params: {
  role: RoleTemplate;
  candidateSkills: ExtractedSkill[];
  jobRequirements: JobRequirementAI[];
}): MatchedRequirement[] {
  const { role, candidateSkills, jobRequirements } = params;

  const candidateByCanonical = new Map<string, ExtractedSkill[]>();
  for (const skill of candidateSkills) {
    const canonical = normalizeSkillName(role, skill.canonicalName || skill.name).toLowerCase();
    const list = candidateByCanonical.get(canonical) ?? [];
    list.push(skill);
    candidateByCanonical.set(canonical, list);
  }

  return jobRequirements.map((req) => {
    const canonical = normalizeSkillName(role, req.canonicalName || req.name);
    const matches = candidateByCanonical.get(canonical.toLowerCase()) ?? [];

    const candidateEvidence = matches.flatMap((m) => m.evidence);
    const maxConfidence = matches.reduce((max, m) => Math.max(max, m.confidence), 0);

    let status: MatchedRequirement["status"] = "missing";
    if (matches.length > 0) {
      // "matched" requires real evidence AND reasonable confidence; otherwise "partial".
      status = candidateEvidence.length > 0 && maxConfidence >= 0.55 ? "matched" : "partial";
    }

    return {
      canonicalName: canonical,
      priority: req.priority,
      category: req.category,
      status,
      candidateEvidence,
      requirementEvidence: req.evidence,
      candidateConfidence: maxConfidence,
    };
  });
}
