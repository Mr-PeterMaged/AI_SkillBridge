import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { promoCodeInputSchema } from "@/lib/validation/admin";
import { promoComputedStatus, remainingUses } from "@/lib/admin/promo-utils";

export async function GET(req: Request) {
  try {
    await requirePermission("promo.read");
    const url = new URL(req.url);
    const where = buildPromoWhere(url.searchParams);
    const take = Math.min(Number(url.searchParams.get("take") ?? 25), 100);
    const skip = Math.max(Number(url.searchParams.get("skip") ?? 0), 0);

    const [items, total, campaigns, ambassadors] = await Promise.all([
      prisma.promoCode.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: { campaign: true, ambassador: true, redemptions: { select: { id: true } } },
      }),
      prisma.promoCode.count({ where }),
      prisma.promoCampaign.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, status: true } }),
      prisma.ambassador.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, publicHandle: true, status: true } }),
    ]);

    return Response.json({
      total,
      campaigns,
      ambassadors,
      items: items.map((code) => ({
        ...code,
        computedStatus: promoComputedStatus(code),
        remainingUses: remainingUses(code),
        redemptions: code.redemptions.length,
      })),
    });
  } catch (error) {
    return apiAuthError(error);
  }
}

export async function POST(req: Request) {
  try {
    const member = await requirePermission("promo.create");
    const body = await req.json().catch(() => null);
    const parsed = promoCodeInputSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });

    await assertAssignments(parsed.data.campaignId, parsed.data.ambassadorId);
    const created = await prisma.$transaction(async (tx) => {
      const promo = await tx.promoCode.create({
        data: {
          code: parsed.data.code,
          status: parsed.data.active ? "ACTIVE" : "PAUSED",
          discountType: parsed.data.discountType,
          discountAmount: parsed.data.discountAmount,
          currency: parsed.data.discountType === "FIXED_AMOUNT" ? parsed.data.currency : null,
          duration: parsed.data.duration,
          durationMonths: parsed.data.duration === "REPEATING" ? parsed.data.durationMonths : null,
          eligiblePlans: parsed.data.eligiblePlans,
          maxRedemptions: parsed.data.maxRedemptions,
          perUserRedemptionLimit: parsed.data.perUserRedemptionLimit,
          startsAt: parsed.data.startsAt,
          expiresAt: parsed.data.expiresAt,
          firstTimeCustomersOnly: parsed.data.firstTimeCustomersOnly,
          internalOnly: parsed.data.internalOnly,
          campaignId: parsed.data.campaignId ?? null,
          ambassadorId: parsed.data.ambassadorId ?? null,
          internalNotes: parsed.data.internalNotes ?? null,
        },
      });
      await tx.adminAuditLog.create({
        data: {
          actorMemberId: member.id,
          action: "PROMO_CODE_CREATED",
          entityType: "PromoCode",
          entityId: promo.id,
          after: promo,
        },
      });
      await tx.promoAuditLog.create({
        data: {
          adminUserId: member.id,
          action: "PROMO_CODE_CREATED",
          entityType: "PromoCode",
          entityId: promo.id,
          after: promo,
        },
      });
      return promo;
    });

    return Response.json({ promo: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "That promo code already exists." }, { status: 409 });
    }
    return apiAuthError(error);
  }
}

function buildPromoWhere(searchParams: URLSearchParams): Prisma.PromoCodeWhereInput {
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status");
  const campaignId = searchParams.get("campaignId");
  const ambassadorId = searchParams.get("ambassadorId");
  const internalOnly = searchParams.get("internalOnly");
  const expiringSoon = searchParams.get("expiringSoon") === "true";
  const minDiscount = Number(searchParams.get("minDiscount") ?? "");
  const maxDiscount = Number(searchParams.get("maxDiscount") ?? "");
  const where: Prisma.PromoCodeWhereInput = {};
  if (q) where.code = { contains: q, mode: "insensitive" };
  if (status && ["ACTIVE", "PAUSED", "ARCHIVED"].includes(status)) where.status = status as "ACTIVE" | "PAUSED" | "ARCHIVED";
  if (campaignId) where.campaignId = campaignId;
  if (ambassadorId) where.ambassadorId = ambassadorId;
  if (internalOnly === "true") where.internalOnly = true;
  if (!Number.isNaN(minDiscount) || !Number.isNaN(maxDiscount)) {
    where.discountAmount = {
      gte: Number.isNaN(minDiscount) ? undefined : minDiscount,
      lte: Number.isNaN(maxDiscount) ? undefined : maxDiscount,
    };
  }
  if (expiringSoon) {
    where.expiresAt = { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
  }
  return where;
}

async function assertAssignments(campaignId?: string | null, ambassadorId?: string | null) {
  if (campaignId) {
    const campaign = await prisma.promoCampaign.findUnique({ where: { id: campaignId }, select: { id: true } });
    if (!campaign) throw new Error("Invalid campaign assignment.");
  }
  if (ambassadorId) {
    const ambassador = await prisma.ambassador.findUnique({ where: { id: ambassadorId }, select: { id: true } });
    if (!ambassador) throw new Error("Invalid ambassador assignment.");
  }
}
