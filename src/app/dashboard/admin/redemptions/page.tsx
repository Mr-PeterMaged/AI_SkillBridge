import { requireAdminPage } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { money } from "@/lib/admin/promo-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminRedemptionsPage() {
  await requireAdminPage("redemption.read_limited");
  const redemptions = await prisma.promoRedemption.findMany({
    orderBy: { redeemedAt: "desc" },
    take: 50,
    include: {
      promoCode: { select: { id: true, code: true } },
      campaign: { select: { id: true, name: true } },
      ambassador: { select: { id: true, name: true, publicHandle: true } },
    },
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Redemptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Privacy-minimized redemption records, checkout references, and refund/revocation status.
          </p>
        </div>
        <Button variant="outline" asChild><a href="/api/admin/export/redemptions">Export CSV</a></Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-5">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              {["Promo code", "Campaign", "Ambassador", "User", "Plan", "Discount", "Status", "Checkout ID", "Redeemed", "Refunded", "Net"].map((h) => <th key={h} className="py-2">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {redemptions.length === 0 && <tr><td colSpan={11} className="py-6 text-muted-foreground">No redemptions tracked yet.</td></tr>}
            {redemptions.map((item) => (
              <tr key={item.id} className="border-b border-border/60">
                <td className="py-2 font-medium">{item.promoCode.code}</td>
                <td>{item.campaign?.name ?? "-"}</td>
                <td>{item.ambassador?.publicHandle ?? "-"}</td>
                <td>{item.userId ? `user_${item.userId.slice(-6)}` : "anonymous"}</td>
                <td>{item.plan ?? "-"}</td>
                <td>{item.discountTypeSnapshot === "PERCENTAGE" ? `${item.discountAmountSnapshot}%` : money(item.discountAmountSnapshot, item.currencySnapshot ?? "USD")}</td>
                <td><Badge variant="secondary">{item.status}</Badge></td>
                <td className="max-w-40 truncate">{item.checkoutId ?? item.providerReference ?? "-"}</td>
                <td>{item.redeemedAt.toLocaleDateString()}</td>
                <td>{item.refundedAt ? item.refundedAt.toLocaleDateString() : "-"}</td>
                <td>{money(item.netAmountCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
