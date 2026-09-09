import { RoleTemplate } from "@/lib/roles/types";
import { normalizeSkillName } from "./matching";

export type SkillCoverageEntry = {
  skill: string;
  isGapCovered: boolean;
  howCovered: string;
};

/**
 * Maps a generated project's requiredSkills against the analysis's CURRENT
 * priority gaps. This is plain code — the AI never decides what counts as
 * "covered"; it only proposes requiredSkills, and we check those against the
 * real gap list ourselves.
 */
export function computeSkillCoverage(params: {
  role: RoleTemplate;
  requiredSkills: string[];
  openGapNames: string[];
}): { coverage: SkillCoverageEntry[]; gapsCoveredCount: number; totalGaps: number } {
  const openGaps = new Set(params.openGapNames.map((g) => g.toLowerCase()));

  const coverage: SkillCoverageEntry[] = params.requiredSkills.map((raw) => {
    const canonical = normalizeSkillName(params.role, raw);
    const isGapCovered = openGaps.has(canonical.toLowerCase());
    return {
      skill: canonical,
      isGapCovered,
      howCovered: isGapCovered
        ? "Directly practiced and demonstrated by building this project."
        : "Reinforced and given a fresh, checkable example.",
    };
  });

  const coveredGapNames = new Set(
    coverage.filter((c) => c.isGapCovered).map((c) => c.skill.toLowerCase())
  );

  return {
    coverage,
    gapsCoveredCount: coveredGapNames.size,
    totalGaps: openGaps.size,
  };
}
