import { z } from "zod";
import { isSafeHttpUrl } from "@/lib/security/url";

export const evidenceTypeSchema = z.enum(["GITHUB", "DEMO_URL", "PORTFOLIO_URL", "CASE_STUDY", "NOTE"]);

const safeUrlField = z
  .string()
  .max(500)
  .refine(isSafeHttpUrl, "Evidence link must be a valid http(s) URL")
  .nullable()
  .optional();

export const createEvidenceSchema = z
  .object({
    roadmapTaskId: z.string().min(1).max(60).nullable().optional(),
    type: evidenceTypeSchema,
    url: safeUrlField,
    reflectionBuilt: z.string().max(2000).nullable().optional(),
    reflectionLearned: z.string().max(2000).nullable().optional(),
    provesSkills: z.array(z.string().min(1).max(120)).max(10).default([]),
  })
  .refine((data) => Boolean(data.url) || Boolean(data.reflectionBuilt) || Boolean(data.reflectionLearned), {
    message: "Add a link or a short reflection so mentors have something to review.",
    path: ["url"],
  });
export type CreateEvidenceInput = z.infer<typeof createEvidenceSchema>;

export const updateEvidenceSchema = z.object({
  type: evidenceTypeSchema.optional(),
  url: safeUrlField,
  reflectionBuilt: z.string().max(2000).nullable().optional(),
  reflectionLearned: z.string().max(2000).nullable().optional(),
  provesSkills: z.array(z.string().min(1).max(120)).max(10).optional(),
});
export type UpdateEvidenceInput = z.infer<typeof updateEvidenceSchema>;
