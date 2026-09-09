"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Archive, Copy, Loader2, Pause, Play, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

type Promo = {
  id: string;
  code: string;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  computedStatus: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountAmount: number;
  currency: string | null;
  duration: "ONCE" | "REPEATING" | "FOREVER";
  durationMonths: number | null;
  eligiblePlans: string[];
  maxRedemptions: number | null;
  perUserRedemptionLimit: number;
  redemptionCount: number;
  remainingUses: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  campaign: { id: string; name: string } | null;
  ambassador: { id: string; name: string; publicHandle: string } | null;
  internalOnly: boolean;
  firstTimeCustomersOnly: boolean;
};

type Option = { id: string; name: string; publicHandle?: string; status: string };

const plans = ["FREE", "STARTER", "PRO", "JOB_SPRINT", "ANNUAL_STUDENT"];

export function PromoCodeManager() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [campaigns, setCampaigns] = useState<Option[]>([]);
  const [ambassadors, setAmbassadors] = useState<Option[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm());

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ take: "20", skip: String(skip) });
    if (q) params.set("q", q);
    if (status !== "all") params.set("status", status);
    const res = await fetch(`/api/admin/promos?${params}`);
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't load promo codes.");
    else {
      setPromos(data.items ?? []);
      setTotal(data.total ?? 0);
      setCampaigns(data.campaigns ?? []);
      setAmbassadors(data.ambassadors ?? []);
    }
    setLoading(false);
  }

  // Data-fetching effect; see team-manager.tsx for why this is disabled.
  // Intentionally re-runs only on `skip` (pagination) — `load` also reads
  // `q`/`status`, applied via the "Search" button's own explicit call.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  const preview = useMemo(() => {
    const amount = form.discountType === "PERCENTAGE" ? `${form.discountAmount || 0}% off` : `${form.discountAmount || 0} ${form.currency || "USD"} off`;
    const duration = form.duration === "REPEATING" ? `for the first ${form.durationMonths || 1} months` : form.duration.toLowerCase();
    const parts = [`${form.code || "PETER50"} gives ${amount} ${duration}.`];
    if (form.firstTimeCustomersOnly) parts.push("Available to first-time customers.");
    if (form.maxRedemptions) parts.push(`Maximum ${form.maxRedemptions} redemptions.`);
    if (form.expiresAt) parts.push(`Expires ${new Date(form.expiresAt).toLocaleDateString()}.`);
    return parts.join(" ");
  }, [form]);

  async function createPromo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discountAmount: Number(form.discountAmount),
          durationMonths: form.durationMonths ? Number(form.durationMonths) : null,
          maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : null,
          perUserRedemptionLimit: Number(form.perUserRedemptionLimit || 1),
          startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
          campaignId: form.campaignId === "none" ? null : form.campaignId,
          ambassadorId: form.ambassadorId === "none" ? null : form.ambassadorId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const fieldError = data.issues?.fieldErrors ? Object.values(data.issues.fieldErrors as Record<string, string[]>).flat()[0] : undefined;
        toast.error(fieldError ?? data.error ?? "Couldn't create promo code.");
        return;
      }
      toast.success("Promo code created.");
      setForm(defaultForm());
      setSkip(0);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function action(id: string, name: "pause" | "activate" | "archive") {
    if (!window.confirm(`${name[0].toUpperCase()}${name.slice(1)} this promo code?`)) return;
    const res = await fetch(`/api/admin/promos/${id}/${name}`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? `Couldn't ${name} promo code.`);
    else {
      toast.success(`Promo code ${name}d.`);
      setPromos((prev) => prev.map((promo) => (promo.id === id ? { ...promo, status: data.promo.status, computedStatus: data.promo.status } : promo)));
    }
  }

  function duplicate(promo: Promo) {
    setForm({
      ...defaultForm(),
      code: `${promo.code}_COPY`,
      discountType: promo.discountType,
      discountAmount: String(promo.discountAmount),
      currency: promo.currency ?? "USD",
      duration: promo.duration,
      durationMonths: promo.durationMonths ? String(promo.durationMonths) : "",
      eligiblePlans: Array.isArray(promo.eligiblePlans) ? promo.eligiblePlans : [],
      maxRedemptions: promo.maxRedemptions ? String(promo.maxRedemptions) : "",
      perUserRedemptionLimit: String(promo.perUserRedemptionLimit),
      firstTimeCustomersOnly: promo.firstTimeCustomersOnly,
      internalOnly: promo.internalOnly,
      campaignId: promo.campaign?.id ?? "none",
      ambassadorId: promo.ambassador?.id ?? "none",
      confirmHighDiscount: promo.discountType === "PERCENTAGE" && promo.discountAmount >= 70,
      confirmFullDiscount: promo.discountType === "PERCENTAGE" && promo.discountAmount === 100,
    });
    toast.success("Promo copied into the create form.");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createPromo} className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Create promo code</h2>
            <p className="text-sm text-muted-foreground">Server validation enforces discount limits and date rules.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => setForm((prev) => ({ ...prev, code: generateCode() }))}>Auto-generate readable code</Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="Promotion code"><Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="PETER50" required /></Field>
          <Field label="Discount type">
            <Select value={form.discountType} onValueChange={(v) => setForm((p) => ({ ...p, discountType: v as typeof p.discountType }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="PERCENTAGE">Percentage</SelectItem><SelectItem value="FIXED_AMOUNT">Fixed amount</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Discount amount"><Input type="number" min="1" value={form.discountAmount} onChange={(e) => setForm((p) => ({ ...p, discountAmount: e.target.value }))} required /></Field>
          {form.discountType === "FIXED_AMOUNT" && <Field label="Currency"><Input value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value.toUpperCase() }))} maxLength={3} /></Field>}
          <Field label="Duration">
            <Select value={form.duration} onValueChange={(v) => setForm((p) => ({ ...p, duration: v as typeof p.duration }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="ONCE">Once</SelectItem><SelectItem value="REPEATING">Repeating</SelectItem><SelectItem value="FOREVER">Forever</SelectItem></SelectContent>
            </Select>
          </Field>
          {form.duration === "REPEATING" && <Field label="Number of months"><Input type="number" min="1" max="36" value={form.durationMonths} onChange={(e) => setForm((p) => ({ ...p, durationMonths: e.target.value }))} /></Field>}
          <Field label="Max redemptions"><Input type="number" min="1" value={form.maxRedemptions} onChange={(e) => setForm((p) => ({ ...p, maxRedemptions: e.target.value }))} /></Field>
          <Field label="Per-user limit"><Input type="number" min="1" value={form.perUserRedemptionLimit} onChange={(e) => setForm((p) => ({ ...p, perUserRedemptionLimit: e.target.value }))} /></Field>
          <Field label="Starts at"><Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((p) => ({ ...p, startsAt: e.target.value }))} /></Field>
          <Field label="Expires at"><Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))} /></Field>
          <Field label="Campaign">
            <Select value={form.campaignId} onValueChange={(v) => setForm((p) => ({ ...p, campaignId: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="none">No campaign</SelectItem>{campaigns.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Ambassador">
            <Select value={form.ambassadorId} onValueChange={(v) => setForm((p) => ({ ...p, ambassadorId: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="none">No ambassador</SelectItem>{ambassadors.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mt-4">
          <Label className="mb-2 block text-sm">Eligible plans</Label>
          <div className="flex flex-wrap gap-3">
            {plans.map((plan) => (
              <label key={plan} className="flex items-center gap-1.5 text-sm">
                <Checkbox checked={form.eligiblePlans.includes(plan)} onCheckedChange={() => setForm((p) => ({ ...p, eligiblePlans: p.eligiblePlans.includes(plan) ? p.eligiblePlans.filter((item) => item !== plan) : [...p.eligiblePlans, plan] }))} />
                {plan}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.firstTimeCustomersOnly} onCheckedChange={(v) => setForm((p) => ({ ...p, firstTimeCustomersOnly: Boolean(v) }))} /> First-time customers only</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.internalOnly} onCheckedChange={(v) => setForm((p) => ({ ...p, internalOnly: Boolean(v) }))} /> Internal-only</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.confirmHighDiscount} onCheckedChange={(v) => setForm((p) => ({ ...p, confirmHighDiscount: Boolean(v) }))} /> Confirm 70%+ discount</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.confirmFullDiscount} onCheckedChange={(v) => setForm((p) => ({ ...p, confirmFullDiscount: Boolean(v) }))} /> Confirm 100% discount</label>
        </div>

        <Field label="Internal notes"><Textarea value={form.internalNotes} onChange={(e) => setForm((p) => ({ ...p, internalNotes: e.target.value }))} rows={2} /></Field>
        <div className="mt-4 rounded-xl border border-ai/20 bg-ai/[0.04] p-3 text-sm text-muted-foreground">{preview}</div>
        <Button type="submit" disabled={saving} className="mt-4 gap-1.5">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create promo code</Button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search codes..." className="w-56" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="PAUSED">Paused</SelectItem><SelectItem value="ARCHIVED">Archived</SelectItem></SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={() => { setSkip(0); load(); }} className="gap-1.5"><RefreshCw className="h-4 w-4" /> Filter</Button>
          </div>
          <Button variant="outline" asChild><a href="/api/admin/export/promos">Export CSV</a></Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                {["Code", "Status", "Discount", "Duration", "Eligible plans", "Campaign", "Ambassador", "Redemptions", "Remaining", "Starts", "Expires", "Created", "Actions"].map((h) => <th key={h} className="py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={13} className="py-6 text-muted-foreground">Loading promo codes...</td></tr>}
              {!loading && promos.length === 0 && <tr><td colSpan={13} className="py-6 text-muted-foreground">No promo codes found.</td></tr>}
              {promos.map((promo) => (
                <tr key={promo.id} className="border-b border-border/60">
                  <td className="py-2 font-semibold">{promo.code}</td>
                  <td className="py-2"><Badge variant="secondary">{promo.computedStatus}</Badge></td>
                  <td className="py-2">{promo.discountType === "PERCENTAGE" ? `${promo.discountAmount}%` : `${promo.discountAmount / 100} ${promo.currency}`}</td>
                  <td className="py-2">{promo.duration}{promo.durationMonths ? ` ${promo.durationMonths}mo` : ""}</td>
                  <td className="py-2">{Array.isArray(promo.eligiblePlans) && promo.eligiblePlans.length ? promo.eligiblePlans.join(", ") : "All"}</td>
                  <td className="py-2">{promo.campaign?.name ?? "-"}</td>
                  <td className="py-2">{promo.ambassador?.publicHandle ?? "-"}</td>
                  <td className="py-2">{promo.redemptionCount}</td>
                  <td className="py-2">{promo.remainingUses ?? "Unlimited"}</td>
                  <td className="py-2">{promo.startsAt ? new Date(promo.startsAt).toLocaleDateString() : "-"}</td>
                  <td className="py-2">{promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : "-"}</td>
                  <td className="py-2">{new Date(promo.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-1">
                      <Button size="icon" variant="ghost" aria-label="Copy promo code" onClick={() => navigator.clipboard.writeText(promo.code).then(() => toast.success("Copied."))}><Copy className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" aria-label="Duplicate promo" onClick={() => duplicate(promo)}><Plus className="h-4 w-4" /></Button>
                      {promo.status === "ACTIVE" ? <Button size="icon" variant="ghost" aria-label="Pause promo" onClick={() => action(promo.id, "pause")}><Pause className="h-4 w-4" /></Button> : <Button size="icon" variant="ghost" aria-label="Activate promo" onClick={() => action(promo.id, "activate")}><Play className="h-4 w-4" /></Button>}
                      <Button size="icon" variant="ghost" aria-label="Archive promo" onClick={() => action(promo.id, "archive")}><Archive className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{total} total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={skip === 0} onClick={() => setSkip(Math.max(skip - 20, 0))}>Previous</Button>
            <Button variant="outline" size="sm" disabled={skip + 20 >= total} onClick={() => setSkip(skip + 20)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-4"><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}

function defaultForm() {
  return {
    code: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
    discountAmount: "50",
    currency: "USD",
    duration: "REPEATING" as "ONCE" | "REPEATING" | "FOREVER",
    durationMonths: "3",
    eligiblePlans: ["STARTER", "PRO"],
    maxRedemptions: "30",
    perUserRedemptionLimit: "1",
    startsAt: "",
    expiresAt: "",
    firstTimeCustomersOnly: true,
    internalOnly: false,
    active: true,
    campaignId: "none",
    ambassadorId: "none",
    internalNotes: "",
    confirmHighDiscount: false,
    confirmFullDiscount: false,
  };
}

function generateCode() {
  const words = ["BRIDGE", "CAREER", "READY", "SPRINT", "SKILL"];
  return `${words[Math.floor(Math.random() * words.length)]}${Math.floor(10 + Math.random() * 90)}`;
}
