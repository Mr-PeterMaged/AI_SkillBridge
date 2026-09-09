"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Ambassador = {
  id: string;
  name: string;
  organization: string | null;
  publicHandle: string;
  contactEmail: string | null;
  referralKey: string;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  referralUrl: string;
  shareText: { en: string; ar: string } | null;
  promoCodes: unknown[];
  redemptions: unknown[];
  attributions: Array<{ eventType: string }>;
  campaign: { id: string; name: string } | null;
};

export function AmbassadorManager() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", organization: "", publicHandle: "", contactEmail: "", referralKey: "", notes: "" });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/ambassadors");
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't load ambassadors.");
    else setAmbassadors(data.ambassadors ?? []);
    setLoading(false);
  }

  // Data-fetching effect; see team-manager.tsx for why this is disabled.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/ambassadors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        organization: form.organization || null,
        contactEmail: form.contactEmail || null,
        referralKey: form.referralKey || undefined,
        notes: form.notes || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't create ambassador.");
    else {
      toast.success("Ambassador created.");
      setForm({ name: "", organization: "", publicHandle: "", contactEmail: "", referralKey: "", notes: "" });
      await load();
    }
    setSaving(false);
  }

  async function updateStatus(id: string, status: Ambassador["status"]) {
    const res = await fetch(`/api/admin/ambassadors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't update ambassador.");
    else {
      toast.success("Ambassador updated.");
      setAmbassadors((prev) => prev.map((item) => (item.id === id ? { ...item, status: data.ambassador.status } : item)));
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied."));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Create ambassador</h2>
        <Field label="Name"><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required /></Field>
        <Field label="Organization"><Input value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} /></Field>
        <Field label="Public handle"><Input value={form.publicHandle} onChange={(e) => setForm((p) => ({ ...p, publicHandle: e.target.value.toLowerCase() }))} required /></Field>
        <Field label="Contact email (admin-only)"><Input type="email" value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} /></Field>
        <Field label="Referral key"><Input value={form.referralKey} onChange={(e) => setForm((p) => ({ ...p, referralKey: e.target.value.toUpperCase() }))} placeholder="Auto-generated if blank" /></Field>
        <Field label="Notes (admin-only)"><Textarea rows={2} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></Field>
        <Button disabled={saving} className="gap-1.5">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create ambassador</Button>
      </form>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Ambassador performance</h2>
        <div className="mt-4 space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading ambassadors...</p>}
          {ambassadors.map((ambassador) => (
            <article key={ambassador.id} className="rounded-xl border border-border/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{ambassador.name}</h3>
                  <p className="text-sm text-muted-foreground">@{ambassador.publicHandle} {ambassador.organization ? `- ${ambassador.organization}` : ""}</p>
                </div>
                <Badge variant="secondary">{ambassador.status}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
                <Metric label="Codes" value={ambassador.promoCodes.length} />
                <Metric label="Visits" value={ambassador.attributions.filter((item) => item.eventType === "VISIT").length} />
                <Metric label="Signups" value={ambassador.attributions.filter((item) => item.eventType === "SIGNUP").length} />
                <Metric label="Redemptions" value={ambassador.redemptions.length} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => copy(ambassador.referralUrl)} className="gap-1.5"><Copy className="h-3.5 w-3.5" /> Referral URL</Button>
                {ambassador.shareText && <Button size="sm" variant="outline" onClick={() => copy(ambassador.shareText!.en)}>Copy English share text</Button>}
                {ambassador.shareText && <Button size="sm" variant="outline" onClick={() => copy(ambassador.shareText!.ar)}>Copy Arabic share text</Button>}
                <StatusSelect value={ambassador.status} onChange={(value) => updateStatus(ambassador.id, value)} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg bg-muted/40 p-2"><p className="text-xs text-muted-foreground">{label}</p><p className="font-semibold">{value}</p></div>;
}

function StatusSelect({ value, onChange }: { value: Ambassador["status"]; onChange: (value: Ambassador["status"]) => void }) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as Ambassador["status"])}>
      <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="PAUSED">Paused</SelectItem><SelectItem value="ARCHIVED">Archived</SelectItem></SelectContent>
    </Select>
  );
}
