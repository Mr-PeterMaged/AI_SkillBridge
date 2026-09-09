import { z } from "zod";

export const generateProjectSchema = z.object({
  projectType: z.enum(["default", "dashboard", "productivity", "data", "api_service"]).default("default"),
});
export type GenerateProjectInput = z.infer<typeof generateProjectSchema>;
