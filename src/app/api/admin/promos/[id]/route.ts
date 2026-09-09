import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { promoPatchSchema } from "@/lib/validation/admin";
import { writeAdminAudit } from "@/lib/admin/audit";
import { promoComputedStatus, remainingUses } from "@/lib/admin/promo-utils";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("promo.read");
    const { id } = await ctx.params;
    const promo = await prisma.promoCode.findUnique({
      where: { id },
      include: { campaign: true, ambassador: true, redemptions: { orderBy: { redeemedAt: "desc" }, take: 20 } },
    });
    if (!promo) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ promo: { ...promo, computedStatus: promoComputedStatus(promo), remainingUses: remainingUses(promo) } });
  } catch (error) {
    return apiAuthError(error);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const member = await requirePermission("promo.update");
    const { id } = await ctx.params;
    const before = await prisma.promoCode.findUnique({ where: { id } });
    if (!before) return Response.json({ error: "Not found" }, { status: 404 });

    const body = await req.json().catch(() => null);
    const parsed = promoPatchSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });

    if (parsed.data.maxRedemptions && before.redemptionCount > 0 && parsed.data.maxRedemptions > (before.maxRedemptions ?? 0) && !parsed.data.confirmLimitIncrease) {
      return Response.json({ error: "Increasing max redemptions after use requires confirmation." }, { status: 400 });
    }
    if (parsed.data.expiresAt && before.redemptionCount > 0 && (!before.expiresAt || parsed.data.expiresAt > before.expiresAt) && !parsed.data.confirmExpiryExtension) {
      return Response.json({ error: "Extending expiry after redemptions requires confirmation." }, { status: 400 });
    }

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        code: parsed.data.code,
        status: parsed.data.active === undefined ? undefined : parsed.data.active ? "ACTIVE" : "PAUSED",
        discountType: parsed.data.discountType,
        discountAmount: parsed.data.discountAmount,
        currency: parsed.data.discountType === "FIXED_AMOUNT" ? parsed.data.currency : parsed.data.discountType === "PERCENTAGE" ? null : undefined,
        duration: parsed.data.duration,
        durationMonths: parsed.data.duration === "REPEATING" ? parsed.data.durationMonths : parsed.data.duration ? null : undefined,
        eligiblePlans: parsed.data.eligiblePlans,
        maxRedemptions: parsed.data.maxRedemptions,
        perUserRedemptionLimit: parsed.data.perUserRedemptionLimit,
        startsAt: parsed.data.startsAt,
        expiresAt: parsed.data.expiresAt,
        firstTimeCustomersOnly: parsed.data.firstTimeCustomersOnly,
        internalOnly: parsed.data.internalOnly,
        campaignId: parsed.data.campaignId,
        ambassadorId: parsed.data.ambassadorId,
        internalNotes: parsed.data.internalNotes,
      },
    });

    await writeAdminAudit({
      actorMemberId: member.id,
      action: "PROMO_CODE_UPDATED",
      entityType: "PromoCode",
      entityId: id,
      before,
      after: updated,
    });

    return Response.json({ promo: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "That promo code already exists." }, { status: 409 });
    }
    return apiAuthError(error);
  }
}
