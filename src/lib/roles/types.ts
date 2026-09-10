import type { TargetRole } from "@prisma/client";

export type SkillPriority = "critical" | "important" | "nice_to_have";
export type SkillCategory = "technical" | "tool" | "soft";

export type RoleSkill = {
  /** Canonical name used everywhere for matching, e.g. "React" */
  canonicalName: string;
  /** Alternate spellings/aliases the extractor or user might produce */
  aliases: string[];
  category: SkillCategory;
  priority: SkillPriority;
  /** Why this matters for the role — shown on gap cards */
  whyItMatters: string;
  /** Default learning objective used when generating roadmap fallback content */
  learningObjective: string;
  estimatedHours: number;
  suggestedProof: string;
};

export type MiniProjectTemplate = {
  title: string;
  description: string;
  requiredSkills: string[]; // canonical names
  deliverables: string[];
  githubChecklist: string[];
};

export type LearningResource = {
  title: string;
  url: string;
  skill: string; // canonical name
};

export type RoleCategory =
  | "Software Development"
  | "Quality & DevOps"
  | "Design"
  | "Data"
  | "Marketing & Growth";

export type RoleTemplate = {
  id: TargetRole;
  category: RoleCategory;
  label: string;
  shortLabel: string;
  description: string;
  skills: RoleSkill[];
  projects: MiniProjectTemplate[];
  resources: LearningResource[];
  cvEvidenceExamples: string[];
  jobDescriptionTemplate: string;
};
