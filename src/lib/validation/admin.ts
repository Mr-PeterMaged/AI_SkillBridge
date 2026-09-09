import { z } from "zod";

export const idSchema = z.string().min(1).max(120);

export const platformRoleSchema = z.enum([
  "OWNER",
  "ADMIN",
  "MARKETING_MANAGER",
  "SUPPORT_MANAGER",
  "ANALYST",
  "VIEWER",
  "USER",
]);

export const inviteRoleSchema = z.enum(["ADMIN", "MARKETING_MANAGER", "SUPPORT_MANAGER", "ANALYST", "VIEWER"]);

export const memberStatusSchema = z.enum(["ACTIVE", "INVITED", "SUSPENDED", "REMOVED"]);

export const promoStatusSchema = z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]);
export const campaignStatusSchema = z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]);
export const ambassadorStatusSchema = z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]);

export const planSchema = z.enum(["FREE", "STARTER", "PRO", "JOB_SPRINT", "ANNUAL_STUDENT"]);

const nullableDateSchema = z
  .string()
  .datetime()
  .nullable()
  .optional()
  .transform((value) => (value ? new Date(value) : null));

const promoCodeBaseSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]{3,64}$/, "Use 3-64 characters: A-Z, 0-9, hyphen, or underscore."),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountAmount: z.number().int().positive(),
  currency: z.string().trim().toUpperCase().length(3).nullable().optional(),
  duration: z.enum(["ONCE", "REPEATING", "FOREVER"]),
  durationMonths: z.number().int().positive().max(36).nullable().optional(),
  eligiblePlans: z.array(planSchema).max(10).default([]),
  maxRedemptions: z.number().int().positive().nullable().optional(),
  perUserRedemptionLimit: z.number().int().positive().max(50).default(1),
  startsAt: nullableDateSchema,
  expiresAt: nullableDateSchema,
  firstTimeCustomersOnly: z.boolean().default(false),
  internalOnly: z.boolean().default(false),
  active: z.boolean().default(true),
  campaignId: idSchema.nullable().optional(),
  ambassadorId: idSchema.nullable().optional(),
  internalNotes: z.string().max(3000).nullable().optional(),
  confirmHighDiscount: z.boolean().default(false),
  confirmFullDiscount: z.boolean().default(false),
  confirmLimitIncrease: z.boolean().default(false),
  confirmExpiryExtension: z.boolean().default(false),
});

// Shared between create (all fields present) and patch (fields may be
// undefined = "not being changed in this update", so every check is guarded
// to only fire when the relevant field is actually part of this payload).
function applyPromoCodeRefinements(
  data: Partial<z.infer<typeof promoCodeBaseSchema>>,
  ctx: z.RefinementCtx
) {
  if (data.discountType === "PERCENTAGE" && data.discountAmount !== undefined && data.discountAmount > 100) {
    ctx.addIssue({ code: "custom", path: ["discountAmount"], message: "Percentage discounts must be 1-100." });
  }
  if (data.discountType === "FIXED_AMOUNT" && data.currency !== undefined && !data.currency) {
    ctx.addIssue({ code: "custom", path: ["currency"], message: "Currency is required for fixed amount discounts." });
  }
  if (data.duration === "REPEATING" && data.durationMonths !== undefined && !data.durationMonths) {
    ctx.addIssue({ code: "custom", path: ["durationMonths"], message: "Repeating discounts require a month count." });
  }
  if (data.startsAt && data.expiresAt && data.expiresAt <= data.startsAt) {
    ctx.addIssue({ code: "custom", path: ["expiresAt"], message: "Expiration must be after the start date." });
  }
  if (
    data.discountType === "PERCENTAGE" &&
    data.discountAmount !== undefined &&
    data.discountAmount >= 70 &&
    !data.confirmHighDiscount
  ) {
    ctx.addIssue({ code: "custom", path: ["confirmHighDiscount"], message: "High discounts require explicit confirmation." });
  }
  if (data.discountType === "PERCENTAGE" && data.discountAmount === 100) {
    if (!data.confirmFullDiscount) {
      ctx.addIssue({ code: "custom", path: ["confirmFullDiscount"], message: "100% discounts require explicit confirmation." });
    }
    if (!data.maxRedemptions || data.maxRedemptions > 30) {
      ctx.addIssue({ code: "custom", path: ["maxRedemptions"], message: "100% discounts must be limited to 30 uses or fewer." });
    }
  }
}

export const promoCodeInputSchema = promoCodeBaseSchema.superRefine(applyPromoCodeRefinements);

export const promoPatchSchema = promoCodeBaseSchema
  .partial()
  .extend({ code: promoCodeBaseSchema.shape.code.optional() })
  .superRefine(applyPromoCodeRefinements);

const campaignBaseSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,80}$/, "Use 3-80 lowercase letters, numbers, and hyphens."),
  description: z.string().max(3000).nullable().optional(),
  startsAt: nullableDateSchema,
  endsAt: nullableDateSchema,
  status: campaignStatusSchema.default("ACTIVE"),
  internalNotes: z.string().max(3000).nullable().optional(),
});

function applyCampaignRefinements(data: Partial<z.infer<typeof campaignBaseSchema>>, ctx: z.RefinementCtx) {
  if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) {
    ctx.addIssue({ code: "custom", path: ["endsAt"], message: "End date must be after start date." });
  }
}

export const campaignInputSchema = campaignBaseSchema.superRefine(applyCampaignRefinements);

export const campaignPatchSchema = campaignBaseSchema
  .partial()
  .extend({ status: campaignStatusSchema.optional() })
  .superRefine(applyCampaignRefinements);

export const ambassadorInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  organization: z.string().trim().max(160).nullable().optional(),
  publicHandle: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_-]{3,80}$/, "Use 3-80 lowercase letters, numbers, hyphen, or underscore."),
  contactEmail: z.string().email().toLowerCase().nullable().optional(),
  campaignId: idSchema.nullable().optional(),
  referralKey: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]{3,80}$/)
    .optional(),
  status: ambassadorStatusSchema.default("ACTIVE"),
  notes: z.string().max(3000).nullable().optional(),
});

export const ambassadorPatchSchema = ambassadorInputSchema.partial().extend({
  status: ambassadorStatusSchema.optional(),
});

export const createInviteSchema = z.object({
  email: z.string().email().toLowerCase(),
  role: inviteRoleSchema,
  note: z.string().max(1000).nullable().optional(),
});

export const updateRoleSchema = z.object({
  role: inviteRoleSchema,
});

export const memberReasonSchema = z.object({
  reason: z.string().max(1000).nullable().optional(),
});

export const transferOwnershipSchema = z.object({
  targetMemberId: idSchema,
  confirmation: z.literal("TRANSFER OWNERSHIP"),
  previousOwnerRole: z.enum(["ADMIN", "MARKETING_MANAGER", "SUPPORT_MANAGER", "ANALYST", "VIEWER"]).default("ADMIN"),
});

export const inviteTokenSchema = z.string().min(32).max(256);
