import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";

export async function GET(req: Request) {
  try {
    await requirePermission("redemption.read_limited");
    const { prisma } = await import("@/lib/db/prisma");
    const url = new URL(req.url);
    const where: Prisma.PromoRedemptionWhereInput = {};

    const status = url.searchParams.get("status");
    const plan = url.searchParams.get("plan");
    const promoCodeId = url.searchParams.get("promoCodeId");
    const campaignId = url.searchParams.get("campaignId");
    const ambassadorId = url.searchParams.get("ambassadorId");
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    if (status) where.status = status as Prisma.EnumPromoRedemptionStatusFilter["equals"];
    if (plan) where.plan = plan as Prisma.EnumPlanNullableFilter["equals"];
    if (promoCodeId) where.promoCodeId = promoCodeId;
    if (campaignId) where.campaignId = campaignId;
    if (ambassadorId) where.ambassadorId = ambassadorId;
    if (start || end) where.redeemedAt = { gte: start ? new Date(start) : undefined, lte: end ? new Date(end) : undefined };

    const take = Math.min(Number(url.searchParams.get("take") ?? 25), 100);
    const skip = Math.max(Number(url.searchParams.get("skip") ?? 0), 0);
    const [items, total] = await Promise.all([
      prisma.promoRedemption.findMany({
        where,
        take,
        skip,
        orderBy: { redeemedAt: "desc" },
        include: {
          promoCode: { select: { id: true, code: true } },
          campaign: { select: { id: true, name: true } },
          ambassador: { select: { id: true, name: true, publicHandle: true } },
          user: { select: { id: true, plan: true } },
        },
      }),
      prisma.promoRedemption.count({ where }),
    ]);

    return Response.json({
      total,
      items: items.map((item) => ({
        id: item.id,
        promoCode: item.promoCode,
        campaign: item.campaign,
        ambassador: item.ambassador,
        userIdentifier: item.userId ? `user_${item.userId.slice(-6)}` : "anonymous",
        plan: item.plan,
        discountSnapshot: {
          type: item.discountTypeSnapshot,
          amount: item.discountAmountSnapshot,
          currency: item.currencySnapshot,
        },
        status: item.status,
        checkoutId: item.checkoutId,
        providerReference: item.providerReference,
        redeemedAt: item.redeemedAt,
        refundedAt: item.refundedAt,
        grossAmountCents: item.grossAmountCents,
        discountAmountCents: item.discountAmountCents,
        netAmountCents: item.netAmountCents,
      })),
    });
  } catch (error) {
    return apiAuthError(error);
  }
}
