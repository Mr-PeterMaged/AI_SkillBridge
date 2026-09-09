import { z } from "zod";

export const generateResumeBulletsSchema = z.object({
  built: z.string().min(10).max(1200),
  technologies: z.string().min(2).max(400),
  contribution: z.string().min(5).max(600),
  outcome: z.string().min(5).max(600),
  metric: z.string().max(200).nullable().optional(),
});

export type GenerateResumeBulletsInput = z.infer<typeof generateResumeBulletsSchema>;
