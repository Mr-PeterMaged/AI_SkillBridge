"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Campaign = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  startsAt: string | null;
  endsAt: string | null;
  promoCodes: unknown[];
  ambassadors: unknown[];
  redemptions: unknown[];
  attributions: Array<{ eventType: string }>;
};

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", status: "ACTIVE", startsAt: "", endsAt: "", internalNotes: "" });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/campaigns");
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't load campaigns.");
    else setCampaigns(data.campaigns ?? []);
    setLoading(false);
  }

  // Data-fetching effect; see team-manager.tsx for why this is disabled.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
        description: form.description || null,
        internalNotes: form.internalNotes || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't create campaign.");
    else {
      toast.success("Campaign created.");
      setForm({ name: "", slug: "", description: "", status: "ACTIVE", startsAt: "", endsAt: "", internalNotes: "" });
      await load();
    }
    setSaving(false);
  }

  async function updateStatus(id: string, status: Campaign["status"]) {
    const res = await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't update campaign.");
    else {
      toast.success("Campaign updated.");
      setCampaigns((prev) => prev.map((item) => (item.id === id ? { ...item, status: data.campaign.status } : item)));
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Create campaign</h2>
        <Field label="Name"><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: p.slug || slugify(e.target.value) }))} required /></Field>
        <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))} required /></Field>
        <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} /></Field>
        <Field label="Start date"><Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((p) => ({ ...p, startsAt: e.target.value }))} /></Field>
        <Field label="End date"><Input type="datetime-local" value={form.endsAt} onChange={(e) => setForm((p) => ({ ...p, endsAt: e.target.value }))} /></Field>
        <Field label="Internal notes"><Textarea value={form.internalNotes} onChange={(e) => setForm((p) => ({ ...p, internalNotes: e.target.value }))} rows={2} /></Field>
        <Button disabled={saving} className="gap-1.5">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create campaign</Button>
      </form>
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Campaign performance</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs text-muted-foreground"><tr className="border-b border-border"><th className="py-2">Name</th><th>Status</th><th>Codes</th><th>Ambassadors</th><th>Visits</th><th>Signups</th><th>Redemptions</th><th>Actions</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="py-6 text-muted-foreground">Loading campaigns...</td></tr>}
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border/60">
                  <td className="py-2"><p className="font-medium">{campaign.name}</p><p className="text-xs text-muted-foreground">{campaign.slug}</p></td>
                  <td><Badge variant="secondary">{campaign.status}</Badge></td>
                  <td>{campaign.promoCodes.length}</td>
                  <td>{campaign.ambassadors.length}</td>
                  <td>{campaign.attributions.filter((item) => item.eventType === "VISIT").length}</td>
                  <td>{campaign.attributions.filter((item) => item.eventType === "SIGNUP").length}</td>
                  <td>{campaign.redemptions.length}</td>
                  <td><StatusSelect value={campaign.status} onChange={(value) => updateStatus(campaign.id, value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}

function StatusSelect({ value, onChange }: { value: Campaign["status"]; onChange: (value: Campaign["status"]) => void }) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as Campaign["status"])}>
      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="PAUSED">Paused</SelectItem><SelectItem value="ARCHIVED">Archived</SelectItem></SelectContent>
    </Select>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}
