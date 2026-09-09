import { z } from "zod";

export const checkInResponseSchema = z.enum(["COMPLETED", "MADE_PROGRESS", "GOT_STUCK", "DID_NOT_START"]);

export const createCheckInSchema = z.object({
  roadmapTaskId: z.string().min(1).max(80).nullable().optional(),
  response: checkInResponseSchema,
  blocker: z.string().max(1000).nullable().optional(),
  availableHours: z.number().int().min(1).max(40).nullable().optional(),
});

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;
