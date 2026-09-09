import "server-only";
import type { Plan, PromoCode } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getPlan, isPaidPlan, type PlanCode } from "@/lib/config/pricing";

const PROMO_CODE_RE = /^[A-Z0-9_-]{3,64}$/;

export type CheckoutQuote = {
  plan: PlanCode;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: "EGP";
  promoCodeId: string | null;
  promoCode: string | null;
  promoCodeSnapshot: Prisma.InputJsonValue | null;
};

export function normalizePromoCode(input?: string | null) {
  const value = input?.trim().toUpperCase() ?? "";
  if (!value) return "";
  if (!PROMO_CODE_RE.test(value)) return null;
  return value;
}

export async function buildCheckoutQuote(params: {
  userId: string;
  plan: PlanCode;
  promoCode?: string | null;
  now?: Date;
}): Promise<CheckoutQuote> {
  const now = params.now ?? new Date();
  const plan = getPlan(params.plan);
  if (!isPaidPlan(params.plan)) {
    throw new Error("Free plan does not require payment.");
  }

  const normalizedCode = normalizePromoCode(params.promoCode);
  if (normalizedCode === null) {
    throw new Error("Promo code format is invalid.");
  }

  const base: CheckoutQuote = {
    plan: params.plan,
    originalAmount: plan.pricePiastres,
    discountAmount: 0,
    finalAmount: plan.pricePiastres,
    currency: "EGP",
    promoCodeId: null,
    promoCode: null,
    promoCodeSnapshot: null,
  };

  if (!normalizedCode) return base;

  const promo = await prisma.promoCode.findUnique({
    where: { code: normalizedCode },
    include: { campaign: true, ambassador: true },
  });
  if (!promo || !isPromoUsableForPlan(promo, params.plan, now)) {
    throw new Error("This promo code cannot be applied.");
  }

  if (promo.firstTimeCustomersOnly) {
    const approvedPayments = await prisma.manualPaymentRequest.count({
      where: { userId: params.userId, status: "APPROVED" },
    });
    if (approvedPayments > 0) throw new Error("This promo code cannot be applied.");
  }

  const userRedemptions = await prisma.promoRedemption.count({
    where: {
      userId: params.userId,
      promoCodeId: promo.id,
      status: { in: ["PENDING", "REDEEMED"] },
    },
  });
  if (userRedemptions >= promo.perUserRedemptionLimit) {
    throw new Error("This promo code cannot be applied.");
  }

  const discountAmount = calculateDiscountPiastres(promo, plan.pricePiastres);
  const finalAmount = Math.max(plan.pricePiastres - discountAmount, 0);

  return {
    ...base,
    discountAmount,
    finalAmount,
    promoCodeId: promo.id,
    promoCode: promo.code,
    promoCodeSnapshot: {
      id: promo.id,
      code: promo.code,
      discountType: promo.discountType,
      discountAmount: promo.discountAmount,
      currency: promo.currency,
      duration: promo.duration,
      durationMonths: promo.durationMonths,
      campaignId: promo.campaignId,
      ambassadorId: promo.ambassadorId,
    },
  };
}

function isPromoUsableForPlan(promo: PromoCode, plan: PlanCode, now: Date) {
  if (promo.status !== "ACTIVE") return false;
  if (promo.startsAt && promo.startsAt > now) return false;
  if (promo.expiresAt && promo.expiresAt < now) return false;
  if (promo.maxRedemptions !== null && promo.redemptionCount >= promo.maxRedemptions) return false;
  if (promo.currency && promo.currency !== "EGP") return false;

  const eligiblePlans = Array.isArray(promo.eligiblePlans)
    ? promo.eligiblePlans.filter((item): item is Plan => typeof item === "string")
    : [];
  return eligiblePlans.length === 0 || eligiblePlans.includes(plan);
}

function calculateDiscountPiastres(promo: PromoCode, originalAmount: number) {
  if (promo.discountType === "PERCENTAGE") {
    return Math.min(Math.round((originalAmount * promo.discountAmount) / 100), originalAmount);
  }
  return Math.min(promo.discountAmount, originalAmount);
}
