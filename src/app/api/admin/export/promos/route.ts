import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { writeAdminAudit } from "@/lib/admin/audit";
import { csv, promoComputedStatus, remainingUses } from "@/lib/admin/promo-utils";

export async function GET() {
  try {
    const member = await requirePermission("promo.export");
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
      include: { campaign: true, ambassador: true },
    });
    await writeAdminAudit({ actorMemberId: member.id, action: "PROMO_CODES_EXPORTED", entityType: "PromoCode" });
    return new Response(
      csv(
        promos.map((promo) => ({
          code: promo.code,
          status: promoComputedStatus(promo),
          discountType: promo.discountType,
          discountAmount: promo.discountAmount,
          duration: promo.duration,
          durationMonths: promo.durationMonths,
          eligiblePlans: Array.isArray(promo.eligiblePlans) ? promo.eligiblePlans.join("|") : "",
          campaign: promo.campaign?.name ?? "",
          ambassador: promo.ambassador?.publicHandle ?? "",
          redemptions: promo.redemptionCount,
          remainingUses: remainingUses(promo) ?? "unlimited",
          startsAt: promo.startsAt,
          expiresAt: promo.expiresAt,
          createdAt: promo.createdAt,
        }))
      ),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=skillbridge-promos.csv",
        },
      }
    );
  } catch (error) {
    return apiAuthError(error);
  }
}
