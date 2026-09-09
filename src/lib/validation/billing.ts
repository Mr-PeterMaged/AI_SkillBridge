import { z } from "zod";
import { PLAN_CODES } from "@/lib/config/pricing";

export const paidPlanSchema = z.enum(["STARTER", "PRO", "JOB_SPRINT"]);
export const planCodeSchema = z.enum(PLAN_CODES);

export const promoCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9_-]{3,64}$/, "Use A-Z, 0-9, hyphen, or underscore.")
  .optional()
  .or(z.literal(""));

export const checkoutQuoteSchema = z.object({
  plan: paidPlanSchema,
  promoCode: promoCodeSchema.nullish(),
});

export const fullNameSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]+(?:['-][A-Za-z]+)*(?:\s+[A-Za-z]+(?:['-][A-Za-z]+)*)+$/, "Enter your full name in English (first and last name).")
  .min(3)
  .max(80);

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{8,20}$/, "Enter a valid phone number.");

export const createPaymentRequestSchema = checkoutQuoteSchema.extend({
  fullName: fullNameSchema,
  phone: phoneSchema,
});

export const adminPaymentQuerySchema = z.object({
  status: z.string().optional(),
  plan: z.string().optional(),
  promoCode: z.string().optional(),
  pending: z.string().optional(),
  expiringSoon: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  take: z.coerce.number().int().min(1).max(100).default(50),
  skip: z.coerce.number().int().min(0).default(0),
});

export const rejectionReasonSchema = z.enum([
  "Amount not matched",
  "Transfer could not be verified",
  "Duplicate request",
  "Expired request",
  "Other",
]);

export const reviewPaymentSchema = z.object({
  rejectionReason: rejectionReasonSchema.optional(),
  adminNotes: z.string().trim().max(3000).optional().nullable(),
});
