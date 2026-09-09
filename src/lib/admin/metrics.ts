import "server-only";
import { prisma } from "@/lib/db/prisma";
import { promoComputedStatus, remainingUses } from "@/lib/admin/promo-utils";

export async function getPromotionMetrics(params?: { start?: Date; end?: Date }) {
  const dateFilter =
    params?.start || params?.end
      ? {
          gte: params.start,
          lte: params.end,
        }
      : undefined;

  const [codes, redemptions, attributions, campaigns, ambassadors] = await Promise.all([
    prisma.promoCode.findMany({
      include: { campaign: true, ambassador: true, redemptions: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.promoRedemption.findMany({
      where: dateFilter ? { redeemedAt: dateFilter } : undefined,
      include: { promoCode: true, campaign: true, ambassador: true, user: { select: { id: true, plan: true } } },
      orderBy: { redeemedAt: "desc" },
      take: 100,
    }),
    prisma.referralAttribution.findMany({
      where: dateFilter ? { createdAt: dateFilter } : undefined,
      include: { promoCode: true, campaign: true, ambassador: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    prisma.promoCampaign.findMany({ include: { promoCodes: true, redemptions: true, attributions: true } }),
    prisma.ambassador.findMany({ include: { promoCodes: true, redemptions: true, attributions: true } }),
  ]);

  const activeCodes = codes.filter((code) => promoComputedStatus(code) === "ACTIVE");
  const expiringSoon = codes.filter((code) => {
    if (!code.expiresAt || code.status !== "ACTIVE") return false;
    const ms = code.expiresAt.getTime() - Date.now();
    return ms >= 0 && ms <= 7 * 24 * 60 * 60 * 1000;
  });
  const exhausted = codes.filter((code) => promoComputedStatus(code) === "EXHAUSTED");
  const paidConversions = redemptions.filter((redemption) => ["REDEEMED", "REFUNDED"].includes(redemption.status));
  const referralVisits = attributions.filter((item) => item.eventType === "VISIT").length;
  const attributedSignups = attributions.filter((item) => item.eventType === "SIGNUP").length;
  const checkoutAttempts = attributions.filter((item) => item.eventType === "CHECKOUT_ATTEMPT").length;
  const grossRevenue = sum(redemptions.map((item) => item.grossAmountCents));
  const discounts = sum(redemptions.map((item) => item.discountAmountCents));
  const netRevenue = sum(redemptions.map((item) => item.netAmountCents));
  const conversionRate = attributedSignups ? paidConversions.length / attributedSignups : 0;
  const averageDiscountPercentage = average(
    redemptions
      .filter((item) => item.discountTypeSnapshot === "PERCENTAGE")
      .map((item) => item.discountAmountSnapshot)
  );

  const topCodes = codes
    .map((code) => ({
      id: code.id,
      code: code.code,
      redemptions: code.redemptions.length,
      netRevenue: sum(code.redemptions.map((item) => item.netAmountCents)),
      status: promoComputedStatus(code),
    }))
    .sort((a, b) => b.redemptions - a.redemptions || b.netRevenue - a.netRevenue)
    .slice(0, 8);

  const topAmbassadors = ambassadors
    .map((ambassador) => ({
      id: ambassador.id,
      name: ambassador.name,
      publicHandle: ambassador.publicHandle,
      redemptions: ambassador.redemptions.length,
      signups: ambassador.attributions.filter((item) => item.eventType === "SIGNUP").length,
      netRevenue: sum(ambassador.redemptions.map((item) => item.netAmountCents)),
      conversionRate: rate(
        ambassador.redemptions.filter((item) => item.status === "REDEEMED").length,
        ambassador.attributions.filter((item) => item.eventType === "SIGNUP").length
      ),
    }))
    .sort((a, b) => b.netRevenue - a.netRevenue || b.redemptions - a.redemptions)
    .slice(0, 8);

  const campaignPerformance = campaigns.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    promoCodes: campaign.promoCodes.length,
    referralVisits: campaign.attributions.filter((item) => item.eventType === "VISIT").length,
    attributedSignups: campaign.attributions.filter((item) => item.eventType === "SIGNUP").length,
    redemptions: campaign.redemptions.length,
    grossRevenue: sum(campaign.redemptions.map((item) => item.grossAmountCents)),
    discounts: sum(campaign.redemptions.map((item) => item.discountAmountCents)),
    netRevenue: sum(campaign.redemptions.map((item) => item.netAmountCents)),
    conversionRate: rate(
      campaign.redemptions.filter((item) => item.status === "REDEEMED").length,
      campaign.attributions.filter((item) => item.eventType === "SIGNUP").length
    ),
  }));

  const alerts = [
    ...expiringSoon.map((code) => ({
      type: "EXPIRING_SOON",
      label: `${code.code} expires within 7 days.`,
      entityId: code.id,
    })),
    ...codes
      .filter((code) => {
        const remaining = remainingUses(code);
        return remaining !== null && remaining <= 5 && code.status === "ACTIVE";
      })
      .map((code) => ({ type: "NEAR_LIMIT", label: `${code.code} is near its redemption limit.`, entityId: code.id })),
    ...codes
      .filter((code) => code.status === "PAUSED" && code.campaign?.status === "ACTIVE")
      .map((code) => ({ type: "PAUSED_ACTIVE_CAMPAIGN", label: `${code.code} is paused but assigned to an active campaign.`, entityId: code.id })),
    ...redemptions
      .filter((item) => item.status === "FAILED")
      .slice(0, 10)
      .map((item) => ({ type: "FAILED_REDEMPTION", label: `A redemption failed for ${item.promoCode.code}.`, entityId: item.id })),
  ];

  return {
    summary: {
      activePromoCodes: activeCodes.length,
      totalRedemptions: redemptions.length,
      promoAttributedSignups: attributedSignups,
      successfulPaidConversions: paidConversions.length,
      grossRevenue,
      totalDiscountAmount: discounts,
      netRevenue,
      overallPromoConversionRate: conversionRate,
      codesExpiringWithin7Days: expiringSoon.length,
      exhaustedPromoCodes: exhausted.length,
      referralVisits,
      checkoutAttempts,
      averageDiscountPercentage,
    },
    recentRedemptions: redemptions.slice(0, 12).map((redemption) => ({
      id: redemption.id,
      code: redemption.promoCode.code,
      campaign: redemption.campaign?.name ?? null,
      ambassador: redemption.ambassador?.name ?? null,
      userIdentifier: redemption.userId ? `user_${redemption.userId.slice(-6)}` : "anonymous",
      plan: redemption.plan,
      status: redemption.status,
      checkoutId: redemption.checkoutId,
      providerReference: redemption.providerReference,
      redeemedAt: redemption.redeemedAt,
      refundedAt: redemption.refundedAt,
      grossAmountCents: redemption.grossAmountCents,
      discountAmountCents: redemption.discountAmountCents,
      netAmountCents: redemption.netAmountCents,
    })),
    topCodes,
    topAmbassadors,
    campaignPerformance,
    alerts,
    charts: buildCharts(redemptions, campaignPerformance, topAmbassadors, topCodes),
  };
}

function buildCharts(
  redemptions: Array<{ redeemedAt: Date; grossAmountCents: number; netAmountCents: number; promoCode: { code: string } }>,
  campaigns: Array<{ name: string; netRevenue: number; redemptions: number }>,
  ambassadors: Array<{ name: string; netRevenue: number; redemptions: number }>,
  codes: Array<{ code: string; redemptions: number; netRevenue: number }>
) {
  const byDay = new Map<string, { date: string; redemptions: number; grossRevenue: number; netRevenue: number }>();
  for (const redemption of redemptions) {
    const date = redemption.redeemedAt.toISOString().slice(0, 10);
    const row = byDay.get(date) ?? { date, redemptions: 0, grossRevenue: 0, netRevenue: 0 };
    row.redemptions += 1;
    row.grossRevenue += redemption.grossAmountCents;
    row.netRevenue += redemption.netAmountCents;
    byDay.set(date, row);
  }
  return {
    conversionsOverTime: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)),
    revenueOverTime: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)),
    redemptionsByPromoCode: codes.slice(0, 10),
    performanceByCampaign: campaigns.slice(0, 10),
    performanceByAmbassador: ambassadors.slice(0, 10),
  };
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: number[]) {
  return values.length ? sum(values) / values.length : 0;
}

function rate(numerator: number, denominator: number) {
  return denominator ? numerator / denominator : 0;
}
