import { z } from "zod";
import { isSafeHttpUrl } from "@/lib/security/url";

const safeOptionalUrl = z
  .string()
  .max(500)
  .refine((value) => value.length === 0 || isSafeHttpUrl(value), "Application URL must be a valid http(s) URL")
  .nullable()
  .optional();

export const applicationStatusSchema = z.enum(["SAVED", "PREPARING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]);

export const createJobApplicationSchema = z.object({
  analysisId: z.string().min(1).max(80).nullable().optional(),
  jobTitle: z.string().min(2).max(160),
  company: z.string().min(2).max(160),
  applicationUrl: safeOptionalUrl,
  status: applicationStatusSchema.default("SAVED"),
  deadline: z.string().datetime().nullable().optional(),
  notes: z.string().max(1500).nullable().optional(),
});

export type CreateJobApplicationInput = z.infer<typeof createJobApplicationSchema>;
