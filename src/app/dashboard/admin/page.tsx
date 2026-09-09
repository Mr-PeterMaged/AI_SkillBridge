import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import { hasPermission } from "@/lib/auth/permissions";
import { getPromotionMetrics } from "@/lib/admin/metrics";
import { money } from "@/lib/admin/promo-utils";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminOverviewPage() {
  const member = await requireAdminPage("admin.dashboard.view");
  const metrics = await getPromotionMetrics();
  const canManagePromos = hasPermission(member.role, "promo.create");

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Promotion Center</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage discounts, campaigns, ambassador performance, and conversions.
          </p>
        </div>
        {canManagePromos && (
          <Button asChild className="gap-2">
            <Link href="/dashboard/admin/promos">
              Manage promo codes <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard label="Active promo codes" value={metrics.summary.activePromoCodes} />
        <AdminMetricCard label="Total redemptions" value={metrics.summary.totalRedemptions} />
        <AdminMetricCard label="Promo-attributed signups" value={metrics.summary.promoAttributedSignups} />
        <AdminMetricCard label="Paid conversions" value={metrics.summary.successfulPaidConversions} />
        <AdminMetricCard label="Gross revenue" value={metrics.summary.grossRevenue / 100} suffix=" EGP" />
        <AdminMetricCard label="Total discount amount" value={metrics.summary.totalDiscountAmount / 100} suffix=" EGP" />
        <AdminMetricCard label="Net revenue" value={metrics.summary.netRevenue / 100} suffix=" EGP" />
        <AdminMetricCard label="Overall conversion rate" value={Math.round(metrics.summary.overallPromoConversionRate * 100)} suffix="%" />
        <AdminMetricCard label="Expiring within 7 days" value={metrics.summary.codesExpiringWithin7Days} />
        <AdminMetricCard label="Exhausted promo codes" value={metrics.summary.exhaustedPromoCodes} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent redemptions</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-2">Code</th>
                  <th className="py-2">Campaign</th>
                  <th className="py-2">Ambassador</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentRedemptions.length === 0 && (
                  <tr><td className="py-6 text-muted-foreground" colSpan={6}>No redemptions tracked yet.</td></tr>
                )}
                {metrics.recentRedemptions.map((item) => (
                  <tr key={item.id} className="border-b border-border/60">
                    <td className="py-2 font-medium">{item.code}</td>
                    <td className="py-2 text-muted-foreground">{item.campaign ?? "-"}</td>
                    <td className="py-2 text-muted-foreground">{item.ambassador ?? "-"}</td>
                    <td className="py-2 text-muted-foreground">{item.userIdentifier}</td>
                    <td className="py-2"><Badge variant="secondary">{item.status}</Badge></td>
                    <td className="py-2 text-right">{money(item.netAmountCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" /> Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.alerts.length === 0 && <p className="text-sm text-muted-foreground">No promo alerts right now.</p>}
            {metrics.alerts.slice(0, 8).map((alert) => (
              <div key={`${alert.type}-${alert.entityId}`} className="rounded-lg border border-border/70 p-3 text-sm">
                <p className="font-medium">{alert.type.replaceAll("_", " ")}</p>
                <p className="mt-1 text-muted-foreground">{alert.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SummaryList title="Top performing promo codes" rows={metrics.topCodes.map((code) => ({ label: code.code, value: `${code.redemptions} redemptions` }))} />
        <SummaryList title="Top ambassadors" rows={metrics.topAmbassadors.map((ambassador) => ({ label: ambassador.name, value: `${ambassador.redemptions} redemptions` }))} />
        <SummaryList title="Campaign performance" rows={metrics.campaignPerformance.map((campaign) => ({ label: campaign.name, value: money(campaign.netRevenue) }))} />
      </div>
    </div>
  );
}

function SummaryList({ title, rows }: { title: string; rows: Array<{ label: string; value: string }> }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
        {rows.slice(0, 6).map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 text-sm">
            <span className="truncate font-medium">{row.label}</span>
            <span className="shrink-0 text-muted-foreground">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
