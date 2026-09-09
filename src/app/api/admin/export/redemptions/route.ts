import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { writeAdminAudit } from "@/lib/admin/audit";
import { csv } from "@/lib/admin/promo-utils";

export async function GET() {
  try {
    const member = await requirePermission("analytics.export");
    const redemptions = await prisma.promoRedemption.findMany({
      orderBy: { redeemedAt: "desc" },
      include: { promoCode: true, campaign: true, ambassador: true },
      take: 5000,
    });
    await writeAdminAudit({ actorMemberId: member.id, action: "REDEMPTIONS_EXPORTED", entityType: "PromoRedemption" });
    return new Response(
      csv(
        redemptions.map((item) => ({
          promoCode: item.promoCode.code,
          campaign: item.campaign?.name ?? "",
          ambassador: item.ambassador?.publicHandle ?? "",
          userIdentifier: item.userId ? `user_${item.userId.slice(-6)}` : "anonymous",
          plan: item.plan ?? "",
          discountType: item.discountTypeSnapshot,
          discountAmount: item.discountAmountSnapshot,
          status: item.status,
          checkoutId: item.checkoutId ?? "",
          providerReference: item.providerReference ?? "",
          redeemedAt: item.redeemedAt,
          refundedAt: item.refundedAt,
          grossAmountCents: item.grossAmountCents,
          discountAmountCents: item.discountAmountCents,
          netAmountCents: item.netAmountCents,
        }))
      ),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=skillbridge-redemptions.csv",
        },
      }
    );
  } catch (error) {
    return apiAuthError(error);
  }
}
