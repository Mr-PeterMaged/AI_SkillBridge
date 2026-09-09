"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { isSafeHttpUrl } from "@/lib/security/url";

type Application = {
  id: string;
  jobTitle: string;
  company: string;
  applicationUrl: string | null;
  status: "SAVED" | "PREPARING" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
  notes: string | null;
  readinessScore: number | null;
};

const STATUSES = ["SAVED", "PREPARING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

export function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    applicationUrl: "",
    status: "SAVED" as Application["status"],
    notes: "",
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setApplications(data.applications ?? []);
      })
      .catch(() => toast.error("Couldn't load applications."))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, applicationUrl: form.applicationUrl.trim() || null, notes: form.notes.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        const fieldError = data.issues?.fieldErrors
          ? Object.values(data.issues.fieldErrors as Record<string, string[]>).flat()[0]
          : undefined;
        toast.error(fieldError ?? data.error ?? "Couldn't save this application.");
        return;
      }
      setApplications((prev) => [data.application, ...prev]);
      setForm({ jobTitle: "", company: "", applicationUrl: "", status: "SAVED", notes: "" });
      toast.success("Application saved.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Add application</h2>
        <div>
          <Label htmlFor="jobTitle" className="mb-1.5 block text-sm">Job title</Label>
          <Input id="jobTitle" value={form.jobTitle} onChange={(event) => setForm((prev) => ({ ...prev, jobTitle: event.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="company" className="mb-1.5 block text-sm">Company</Label>
          <Input id="company" value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="applicationUrl" className="mb-1.5 block text-sm">Application URL</Label>
          <Input id="applicationUrl" value={form.applicationUrl} onChange={(event) => setForm((prev) => ({ ...prev, applicationUrl: event.target.value }))} placeholder="https://company.com/careers/role" />
        </div>
        <div>
          <Label className="mb-1.5 block text-sm">Status</Label>
          <Select value={form.status} onValueChange={(status) => setForm((prev) => ({ ...prev, status: status as Application["status"] }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => <SelectItem key={status} value={status}>{status.replaceAll("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="notes" className="mb-1.5 block text-sm">Notes</Label>
          <Textarea id="notes" rows={3} value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />
        </div>
        <Button type="submit" disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Save application
        </Button>
      </form>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Applications</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track roles lightly. SkillBridge may suggest preparing evidence first, but never blocks you from applying.
        </p>
        <div className="mt-4 space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading applications...</p>}
          {!loading && applications.length === 0 && <p className="text-sm text-muted-foreground">No applications saved yet.</p>}
          {applications.map((application) => (
            <article key={application.id} className="rounded-xl border border-border/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium">{application.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{application.company}</p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {application.status.replaceAll("_", " ")}
                </span>
              </div>
              {application.readinessScore !== null && application.readinessScore < 70 && (
                <p className="mt-3 rounded-lg border border-warning/30 bg-warning/10 p-2 text-xs text-warning-foreground">
                  This role may still have unresolved priority gaps. Consider completing your recommended project before applying.
                </p>
              )}
              {application.applicationUrl && isSafeHttpUrl(application.applicationUrl) && (
                <a href={application.applicationUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  Open posting <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
