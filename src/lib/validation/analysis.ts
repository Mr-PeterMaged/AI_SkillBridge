import { z } from "zod";
import { isSafeHttpUrl } from "@/lib/security/url";

export const targetRoleSchema = z.enum([
  "JUNIOR_FRONTEND_DEVELOPER",
  "JUNIOR_BACKEND_DEVELOPER",
  "JUNIOR_DATA_ANALYST",
]);

export const experienceLevelSchema = z.enum(["STUDENT", "FRESH_GRADUATE", "JUNIOR"]);
export const weeklyHoursSchema = z.enum(["H3", "H5", "H8", "H10_PLUS"]);

export const WEEKLY_HOURS_NUMBER: Record<z.infer<typeof weeklyHoursSchema>, number> = {
  H3: 3,
  H5: 5,
  H8: 8,
  H10_PLUS: 10,
};

export const createAnalysisSchema = z.object({
  targetRole: targetRoleSchema,
  experienceLevel: experienceLevelSchema,
  weeklyHours: weeklyHoursSchema,
  cvText: z.string().min(50, "Please provide at least a few lines about your background.").max(20000),
  jobDescriptionText: z.string().min(50, "Please paste a fuller job description.").max(20000),
});
export type CreateAnalysisInput = z.infer<typeof createAnalysisSchema>;

export const confirmSkillsSchema = z.object({
  skills: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        canonicalName: z.string().min(1).max(120),
        category: z.enum(["technical", "tool", "soft"]),
        evidence: z.array(z.string().max(500)).max(5),
        confidence: z.number().min(0).max(1),
        mastery: z.enum(["FAMILIAR", "PRACTICED", "PROVEN"]).nullable().optional(),
        include: z.boolean(),
        source: z.enum(["ai", "user"]).default("ai"),
      })
    )
    .max(80),
});
export type ConfirmSkillsInput = z.infer<typeof confirmSkillsSchema>;

export const updateTaskSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETE"]).optional(),
  evidenceUrl: z
    .string()
    .max(500)
    .refine(isSafeHttpUrl, "Evidence link must be a valid http(s) URL")
    .nullable()
    .optional(),
  evidenceType: z.enum(["GITHUB", "DEMO_URL", "PORTFOLIO_URL", "CASE_STUDY", "NOTE"]).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
