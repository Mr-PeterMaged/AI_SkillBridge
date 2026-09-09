import { z } from "zod";

// ---------------------------------------------------------------
// Zod schemas mirroring the Gemini structured-output contracts.
// All AI responses MUST validate against these before we trust them.
// ---------------------------------------------------------------

export const skillCategorySchema = z.enum(["technical", "tool", "soft"]);
export const skillPrioritySchema = z.enum(["critical", "important", "nice_to_have"]);

export const extractedSkillSchema = z.object({
  name: z.string().min(1).max(120),
  canonicalName: z.string().min(1).max(120),
  category: skillCategorySchema,
  evidence: z.array(z.string().max(500)).max(5),
  confidence: z.number().min(0).max(1),
});
export type ExtractedSkill = z.infer<typeof extractedSkillSchema>;

export const jobRequirementSchema = z.object({
  name: z.string().min(1).max(120),
  canonicalName: z.string().min(1).max(120),
  category: skillCategorySchema,
  priority: skillPrioritySchema,
  evidence: z.array(z.string().max(500)).max(5),
});
export type JobRequirementAI = z.infer<typeof jobRequirementSchema>;

export const skillExtractionResultSchema = z.object({
  candidateSkills: z.array(extractedSkillSchema).max(80),
  jobRequirements: z.array(jobRequirementSchema).max(80),
  candidateSummary: z.string().max(1000),
  jobSummary: z.string().max(1000),
});
export type SkillExtractionResult = z.infer<typeof skillExtractionResultSchema>;

// --- Roadmap generation ---

export const roadmapTaskSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(600),
});

export const roadmapWeekSchema = z.object({
  weekNumber: z.number().int().min(1).max(8),
  focus: z.string().min(1).max(120),
  learningObjective: z.string().min(1).max(400),
  estimatedHours: z.number().min(1).max(40),
  tasks: z.array(roadmapTaskSchema).min(2).max(4),
  deliverable: z.string().min(1).max(300),
  evidenceToPublish: z.string().min(1).max(300),
  resources: z.array(z.object({ title: z.string().max(150), url: z.string().max(300) })).max(5),
});
export type RoadmapWeekAI = z.infer<typeof roadmapWeekSchema>;

export const roadmapGenerationResultSchema = z.object({
  weeks: z.array(roadmapWeekSchema).min(1).max(8),
});
export type RoadmapGenerationResult = z.infer<typeof roadmapGenerationResultSchema>;

// --- Gap explanations (used to enrich SkillGap.reason if not from the deterministic template) ---

export const gapExplanationSchema = z.object({
  skill: z.string().min(1).max(120),
  reason: z.string().min(1).max(400),
  suggestedProof: z.string().min(1).max(300),
});
export const gapExplanationResultSchema = z.object({
  gaps: z.array(gapExplanationSchema).max(40),
});
export type GapExplanationResult = z.infer<typeof gapExplanationResultSchema>;

// --- Portfolio Project Builder (Phase 3) ---

export const projectDifficultySchema = z.enum(["beginner", "intermediate", "advanced"]);

export const buildPlanDaySchema = z.object({
  day: z.number().int().min(1).max(7),
  focus: z.string().min(1).max(120),
  tasks: z.array(z.string().min(1).max(200)).min(1).max(5),
});

export const projectGenerationResultSchema = z.object({
  title: z.string().min(1).max(120),
  valueProposition: z.string().min(1).max(240),
  difficulty: projectDifficultySchema,
  estimatedHours: z.number().min(4).max(60),
  description: z.string().min(1).max(800),
  requiredSkills: z.array(z.string().min(1).max(80)).min(1).max(10),
  userStories: z.array(z.string().min(1).max(200)).min(2).max(8),
  suggestedStack: z.array(z.string().min(1).max(60)).min(1).max(10),
  featureChecklist: z.array(z.string().min(1).max(160)).min(3).max(12),
  buildPlan: z.array(buildPlanDaySchema).length(7),
  deliverables: z.array(z.string().min(1).max(160)).min(1).max(6),
  readmeOutline: z.string().min(1).max(1200),
  deploymentChecklist: z.array(z.string().min(1).max(160)).min(1).max(8),
});
export type ProjectGenerationResult = z.infer<typeof projectGenerationResultSchema>;

// --- Weekly check-in guidance ---

export const weeklyCheckInResultSchema = z.object({
  suggestion: z.string().min(1).max(500),
  adjustedTask: z.string().max(300).nullable(),
});
export type WeeklyCheckInResult = z.infer<typeof weeklyCheckInResultSchema>;

// --- Resume evidence builder ---

export const resumeBulletResultSchema = z.object({
  bullets: z.array(z.string().min(1).max(320)).min(2).max(3),
});
export type ResumeBulletResult = z.infer<typeof resumeBulletResultSchema>;
