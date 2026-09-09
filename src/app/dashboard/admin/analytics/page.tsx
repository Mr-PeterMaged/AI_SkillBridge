import { requireAdminPage } from "@/lib/auth/admin";
import { getPromotionMetrics } from "@/lib/admin/metrics";
import { money } from "@/lib/admin/promo-utils";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { SimpleBarChart } from "@/components/admin/simple-bar-chart";

export default async function AdminAnalyticsPage() {
  await requireAdminPage("analytics.read");
  const metrics = await getPromotionMetrics({ start: daysAgo(30), end: new Date() });

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Promo Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Referral attribution uses a first-touch model and may not capture every marketing touchpoint.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Referral visits" value={metrics.summary.referralVisits} />
        <AdminMetricCard label="Attributed signups" value={metrics.summary.promoAttributedSignups} />
        <AdminMetricCard label="Checkout attempts" value={metrics.summary.checkoutAttempts} />
        <AdminMetricCard label="Paid conversions" value={metrics.summary.successfulPaidConversions} />
        <AdminMetricCard label="Promo redemptions" value={metrics.summary.totalRedemptions} />
        <AdminMetricCard label="Gross revenue" value={metrics.summary.grossRevenue / 100} suffix=" EGP" />
        <AdminMetricCard label="Discounts granted" value={metrics.summary.totalDiscountAmount / 100} suffix=" EGP" />
        <AdminMetricCard label="Net revenue" value={metrics.summary.netRevenue / 100} suffix=" EGP" />
        <AdminMetricCard label="Conversion rate" value={Math.round(metrics.summary.overallPromoConversionRate * 100)} suffix="%" />
        <AdminMetricCard label="Average discount" value={Math.round(metrics.summary.averageDiscountPercentage)} suffix="%" />
        <AdminMetricCard label="Expired/exhausted codes" value={metrics.summary.exhaustedPromoCodes} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SimpleBarChart title="Promo conversions over time" valueLabel="Redemptions" rows={metrics.charts.conversionsOverTime.map((row) => ({ label: row.date, value: row.redemptions }))} />
        <SimpleBarChart title="Gross revenue vs net revenue" valueLabel="Revenue cents" rows={metrics.charts.revenueOverTime.flatMap((row) => [{ label: `${row.date} gross`, value: row.grossRevenue }, { label: `${row.date} net`, value: row.netRevenue }])} />
        <SimpleBarChart title="Redemptions by promo code" valueLabel="Redemptions" rows={metrics.charts.redemptionsByPromoCode.map((row) => ({ label: row.code, value: row.redemptions }))} />
        <SimpleBarChart title="Performance by campaign" valueLabel="Net revenue cents" rows={metrics.charts.performanceByCampaign.map((row) => ({ label: row.name, value: row.netRevenue }))} />
        <SimpleBarChart title="Performance by ambassador" valueLabel="Net revenue cents" rows={metrics.charts.performanceByAmbassador.map((row) => ({ label: row.name, value: row.netRevenue }))} />
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Revenue per campaign</h2>
          <div className="mt-4 space-y-2 text-sm">
            {metrics.campaignPerformance.length === 0 && <p className="text-muted-foreground">No campaign revenue yet.</p>}
            {metrics.campaignPerformance.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2">
                <span>{campaign.name}</span>
                <span className="text-muted-foreground">{money(campaign.netRevenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
