import Link from "next/link";
import { ArrowRight, ShieldAlert, WalletCards } from "lucide-react";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { prisma } from "@/lib/db/prisma";
import { getActiveEntitlement, getUsageForEntitlement } from "@/lib/billing/entitlements";
import { formatEgp, getPlan, PRICING_PLANS, toPlanCode } from "@/lib/config/pricing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function BillingPage() {
  const user = await getOrCreateCurrentUser();
  const entitlement = await getActiveEntitlement(user);
  const plan = getPlan(entitlement.plan);
  const usage = await getUsageForEntitlement(user.id, entitlement);
  const remaining =
    plan.entitlements.analysesPerCycle === null
      ? null
      : Math.max(plan.entitlements.analysesPerCycle - usage, 0);

  const [subscriptions, paymentRequests] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { manualPayment: true },
    }),
    prisma.manualPaymentRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const activeSubscription = subscriptions.find((item) => item.status === "ACTIVE") ?? null;
  const activePromo = activeSubscription?.manualPayment?.promoCodeSnapshot;

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Payments are currently verified manually through InstaPay.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/pricing?checkout=PRO">
            Upgrade plan <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <WalletCards className="h-4 w-4 text-primary" /> Current access
            </CardTitle>
            <CardDescription>Expired paid access falls back to Free without deleting your history.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Info label="Current plan" value={plan.name} />
            <Info label="Status" value={activeSubscription?.status ?? "FREE"} />
            <Info label="Billing" value={plan.billingType === "ONE_TIME" ? "One-time" : plan.billingInterval.toLowerCase()} />
            <Info label="Activated" value={activeSubscription?.activatedAt ? formatDate(activeSubscription.activatedAt) : "-"} />
            <Info label="Expiry / renewal" value={entitlement.subscription?.currentPeriodEnd ? formatDate(entitlement.subscription.currentPeriodEnd) : "-"} />
            <Info label="Active promo" value={promoCodeFromSnapshot(activePromo) ?? "-"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage this cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{usage}</p>
            <p className="text-sm text-muted-foreground">analyses used</p>
            <p className="mt-4 text-sm">
              {remaining === null
                ? plan.fairUse?.label ?? "No configured analysis cap."
                : `${remaining} analyses remaining this cycle.`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRICING_PLANS.filter((item) => item.paid).map((item) => (
          <Button key={item.code} variant={item.highlighted ? "default" : "outline"} asChild>
            <Link href={`/pricing?checkout=${item.code}`}>
              {item.code === "JOB_SPRINT" ? "Buy Job Sprint" : entitlement.plan === item.code ? `Renew ${item.name}` : `Upgrade to ${item.name}`}
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning-foreground">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>SkillBridge will never ask for your OTP, PIN, card number, or banking password. Activation is manual after payment verification.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment request history</CardTitle>
          <CardDescription>Pending requests show here while the transfer is reviewed.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                {["Reference", "Plan", "Original", "Discount", "Final", "Status", "Created", "Reviewed"].map((heading) => (
                  <th key={heading} className="py-2">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paymentRequests.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-muted-foreground">No payment requests yet.</td></tr>
              )}
              {paymentRequests.map((request) => (
                <tr key={request.id} className="border-b border-border/60">
                  <td className="py-2 font-mono text-xs">{request.reference}</td>
                  <td className="py-2">{getPlan(toPlanCode(request.selectedPlan)).name}</td>
                  <td className="py-2">{formatEgp(request.originalAmount)}</td>
                  <td className="py-2">-{formatEgp(request.discountAmount)}</td>
                  <td className="py-2 font-medium">{formatEgp(request.finalAmount)}</td>
                  <td className="py-2"><StatusBadge status={request.status} /></td>
                  <td className="py-2">{formatDate(request.createdAt)}</td>
                  <td className="py-2">
                    <span>{request.reviewedAt ? formatDate(request.reviewedAt) : "-"}</span>
                    <span className="block text-xs text-muted-foreground">{statusMessage(request.status, toPlanCode(request.selectedPlan))}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
  return <Badge variant={status === "APPROVED" ? "default" : "secondary"}>{label}</Badge>;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function promoCodeFromSnapshot(snapshot: unknown) {
  if (snapshot && typeof snapshot === "object" && "code" in snapshot) {
    const code = (snapshot as { code?: unknown }).code;
    return typeof code === "string" ? code : null;
  }
  return null;
}

function statusMessage(status: string, plan: ReturnType<typeof toPlanCode>) {
  if (status === "PENDING_PAYMENT" || status === "UNDER_REVIEW") {
    return "Payment submitted / waiting for verification.";
  }
  if (status === "APPROVED") {
    return `Your ${getPlan(plan).name} access is active.`;
  }
  if (status === "REJECTED") {
    return "We could not verify this payment. Contact support or submit a corrected reference.";
  }
  return "";
}
