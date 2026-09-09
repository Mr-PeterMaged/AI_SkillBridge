"use client";

import { useEffect, useMemo, useState } from "react";
import type { Plan } from "@prisma/client";
import { toast } from "sonner";
import { CheckCircle2, Copy, Loader2, RefreshCw, Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatEgp, getPlan, toPlanCode } from "@/lib/config/pricing";

type PaymentRequest = {
  id: string;
  reference: string;
  userEmailSnapshot: string;
  selectedPlan: string;
  billingInterval: string;
  status: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  promoCodeSnapshot: unknown;
  createdAt: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  expiresAt: string | null;
  rejectionReason: string | null;
  adminNotes: string | null;
  reviewedBy: { email: string | null; displayName: string | null } | null;
  subscription: { id: string; status: string; currentPeriodEnd: string | null } | null;
};

const statuses = ["all", "PENDING_PAYMENT", "UNDER_REVIEW", "APPROVED", "REJECTED", "CANCELLED", "EXPIRED"];
const plans = ["all", "STARTER", "PRO", "JOB_SPRINT"];
const rejectionReasons = [
  "Amount not matched",
  "Transfer could not be verified",
  "Duplicate request",
  "Expired request",
  "Other",
];

export function PaymentRequestManager() {
  const [items, setItems] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [promoCode, setPromoCode] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [expiringSoon, setExpiringSoon] = useState(false);
  const [approval, setApproval] = useState<PaymentRequest | null>(null);
  const [rejecting, setRejecting] = useState<PaymentRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState(rejectionReasons[0]);
  const [adminNotes, setAdminNotes] = useState("");

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ take: "50" });
    if (status !== "all") params.set("status", status);
    if (plan !== "all") params.set("plan", plan);
    if (promoCode) params.set("promoCode", promoCode);
    if (pendingOnly) params.set("pending", "true");
    if (expiringSoon) params.set("expiringSoon", "true");
    const res = await fetch(`/api/admin/payments?${params}`);
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Could not load payment requests.");
    else setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runAction(request: PaymentRequest, action: "under-review" | "approve" | "reject" | "cancel") {
    setActingId(request.id);
    try {
      const body =
        action === "reject"
          ? JSON.stringify({ rejectionReason, adminNotes: adminNotes || null })
          : JSON.stringify({ adminNotes: adminNotes || null });
      const res = await fetch(`/api/admin/payments/${request.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Action failed.");
        return;
      }
      toast.success(action === "approve" ? "Subscription activated." : "Payment request updated.");
      setApproval(null);
      setRejecting(null);
      setAdminNotes("");
      await load();
    } finally {
      setActingId(null);
    }
  }

  const totals = useMemo(() => {
    const pending = items.filter((item) => ["PENDING_PAYMENT", "UNDER_REVIEW"].includes(item.status)).length;
    const approved = items.filter((item) => item.status === "APPROVED").length;
    return { pending, approved };
  }, [items]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Pending review" value={totals.pending} />
        <Metric label="Approved" value={totals.approved} />
        <Metric label="Loaded requests" value={items.length} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{statuses.map((item) => <SelectItem key={item} value={item}>{label(item)}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{plans.map((item) => <SelectItem key={item} value={item}>{label(item)}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={promoCode} onChange={(event) => setPromoCode(event.target.value.toUpperCase())} placeholder="Promo code" />
          <Button type="button" onClick={load} className="gap-1.5">
            <Search className="h-4 w-4" /> Filter
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <button type="button" onClick={() => setPendingOnly((value) => !value)} className="rounded-lg border border-border px-3 py-1.5">
            {pendingOnly ? "Showing pending" : "Pending review"}
          </button>
          <button type="button" onClick={() => setExpiringSoon((value) => !value)} className="rounded-lg border border-border px-3 py-1.5">
            {expiringSoon ? "Showing expiring" : "Expiring soon"}
          </button>
          <Button type="button" variant="ghost" size="sm" onClick={load} className="gap-1.5">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              {["Reference", "User email", "Plan", "Original", "Discount", "Final", "Promo", "Status", "Created", "Submitted", "Reviewer", "Actions"].map((heading) => (
                <th key={heading} className="px-3 py-2">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={12} className="px-3 py-8 text-muted-foreground">Loading payment requests...</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={12} className="px-3 py-8 text-muted-foreground">No payment requests found.</td></tr>}
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/60">
                <td className="px-3 py-2 font-mono text-xs">{item.reference}</td>
                <td className="px-3 py-2">{item.userEmailSnapshot}</td>
                <td className="px-3 py-2">{getPlan(toPlanCode(item.selectedPlan as Plan)).name}</td>
                <td className="px-3 py-2">{formatEgp(item.originalAmount)}</td>
                <td className="px-3 py-2">-{formatEgp(item.discountAmount)}</td>
                <td className="px-3 py-2 font-medium">{formatEgp(item.finalAmount)}</td>
                <td className="px-3 py-2">{promoFromSnapshot(item.promoCodeSnapshot) ?? "-"}</td>
                <td className="px-3 py-2"><StatusBadge status={item.status} /></td>
                <td className="px-3 py-2">{formatDate(item.createdAt)}</td>
                <td className="px-3 py-2">{item.submittedAt ? formatDate(item.submittedAt) : "-"}</td>
                <td className="px-3 py-2">{item.reviewedBy?.displayName ?? item.reviewedBy?.email ?? "-"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => runAction(item, "under-review")} disabled={actingId === item.id || item.status === "APPROVED"}>
                      Review
                    </Button>
                    <Button size="sm" onClick={() => setApproval(item)} disabled={actingId === item.id || item.status === "APPROVED"}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setRejecting(item)} disabled={actingId === item.id || item.status === "APPROVED"}>
                      Reject
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => runAction(item, "cancel")} disabled={actingId === item.id || item.status === "APPROVED"}>
                      Cancel
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Copy WhatsApp payment message" onClick={() => copyMessage(item)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(approval)} onOpenChange={(open) => !open && setApproval(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve and activate?</DialogTitle>
            <DialogDescription>This will mark the payment approved and grant paid access immediately.</DialogDescription>
          </DialogHeader>
          {approval && (
            <div className="space-y-4">
              <DetailRows request={approval} />
              <div>
                <Label htmlFor="approval-note">Internal note (optional)</Label>
                <Textarea id="approval-note" value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} rows={2} />
              </div>
              <Button className="w-full gap-1.5" onClick={() => runAction(approval, "approve")} disabled={actingId === approval.id}>
                {actingId === approval.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Confirm approval and activation
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(rejecting)} onOpenChange={(open) => !open && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject payment request?</DialogTitle>
            <DialogDescription>The user will see a respectful verification failure message, not internal notes.</DialogDescription>
          </DialogHeader>
          {rejecting && (
            <div className="space-y-4">
              <DetailRows request={rejecting} />
              <div>
                <Label>Reason</Label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {rejectionReasons.map((reason) => <SelectItem key={reason} value={reason}>{reason}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reject-note">Internal note (optional)</Label>
                <Textarea id="reject-note" value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} rows={2} />
              </div>
              <Button variant="destructive" className="w-full gap-1.5" onClick={() => runAction(rejecting, "reject")} disabled={actingId === rejecting.id}>
                {actingId === rejecting.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Confirm rejection
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRows({ request }: { request: PaymentRequest }) {
  const plan = getPlan(toPlanCode(request.selectedPlan as Plan));
  const start = new Date();
  const end = plan.code === "JOB_SPRINT" ? new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000) : addMonth(start);
  return (
    <dl className="space-y-2 rounded-lg border border-border p-3 text-sm">
      <Row label="User email" value={request.userEmailSnapshot} />
      <Row label="Plan" value={plan.name} />
      <Row label="Final amount expected" value={formatEgp(request.finalAmount)} />
      <Row label="Promo code and discount" value={`${promoFromSnapshot(request.promoCodeSnapshot) ?? "None"} / -${formatEgp(request.discountAmount)}`} />
      <Row label="Payment reference" value={request.reference} />
      <Row label="Subscription start date" value={formatDate(start.toISOString())} />
      <Row label="Subscription end date" value={formatDate(end.toISOString())} />
      <Row label="Access granted" value={plan.fairUse?.label ?? plan.entitlements.analysisLimitLabel} />
    </dl>
  );
}

function Row({ label: rowLabel, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{rowLabel}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function Metric({ label: metricLabel, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{metricLabel}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    PENDING_PAYMENT: "bg-warning/15 text-warning-foreground",
    UNDER_REVIEW: "bg-ai/15 text-ai",
    APPROVED: "bg-success/15 text-success",
    REJECTED: "bg-destructive/15 text-destructive",
  };
  return <Badge className={classes[status] ?? "bg-muted text-muted-foreground"}>{label(status)}</Badge>;
}

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

function addMonth(date: Date) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return next;
}

function promoFromSnapshot(snapshot: unknown) {
  if (snapshot && typeof snapshot === "object" && "code" in snapshot) {
    const code = (snapshot as { code?: unknown }).code;
    return typeof code === "string" ? code : null;
  }
  return null;
}

async function copyMessage(request: PaymentRequest) {
  const promo = promoFromSnapshot(request.promoCodeSnapshot) ?? "None";
  const plan = getPlan(toPlanCode(request.selectedPlan as Plan));
  const finalAmount = formatEgp(request.finalAmount);
  const message = `Hello SkillBridge AI,
I completed an InstaPay transfer for my subscription.

Payment Request ID: ${request.reference}
SkillBridge account email: ${request.userEmailSnapshot}
Selected plan: ${plan.name}
Final amount transferred: ${finalAmount}
Promo code used: ${promo}

I will send the transfer screenshot below.`;
  await navigator.clipboard.writeText(message);
  toast.success("WhatsApp payment message copied.");
}
