"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ResumeBulletDTO } from "@/lib/types/analysis";

export function ResumeBulletDialog({
  analysisId,
  evidenceId,
  existingBullets,
  onSaved,
}: {
  analysisId: string;
  evidenceId: string;
  existingBullets: ResumeBulletDTO[];
  onSaved?: (bullets: ResumeBulletDTO[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bullets, setBullets] = useState(existingBullets);
  const [form, setForm] = useState({
    built: "",
    technologies: "",
    contribution: "",
    outcome: "",
    metric: "",
  });

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis/${analysisId}/evidence/${evidenceId}/cv-bullets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, metric: form.metric.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        const fieldError = data.issues?.fieldErrors
          ? Object.values(data.issues.fieldErrors as Record<string, string[]>).flat()[0]
          : undefined;
        toast.error(fieldError ?? data.error ?? "Couldn't create CV bullets.");
        return;
      }
      setBullets(data.bullets);
      onSaved?.(data.bullets);
      toast.success("CV bullet options saved to this evidence item.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied.");
    } catch {
      toast.error("Couldn't copy this bullet.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="gap-1.5">
          <FileText className="h-3.5 w-3.5" /> CV bullet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Turn my project into a CV bullet</DialogTitle>
          <DialogDescription>
            Review this text and include only work you genuinely completed. SkillBridge will not invent metrics,
            employers, certifications, clients, users, or results.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Field
            label="What did you build?"
            value={form.built}
            onChange={(built) => setForm((prev) => ({ ...prev, built }))}
            placeholder="A TypeScript job application tracker with saved roles and status filters."
          />
          <Field
            label="What technologies did you use?"
            value={form.technologies}
            onChange={(technologies) => setForm((prev) => ({ ...prev, technologies }))}
            placeholder="React, TypeScript, REST APIs, Prisma, Vercel"
          />
          <Field
            label="What was your contribution?"
            value={form.contribution}
            onChange={(contribution) => setForm((prev) => ({ ...prev, contribution }))}
            placeholder="Designed the UI, implemented forms, added validation and tests."
          />
          <Field
            label="What result can you honestly claim?"
            value={form.outcome}
            onChange={(outcome) => setForm((prev) => ({ ...prev, outcome }))}
            placeholder="Created a deployable portfolio project with a documented README and screenshots."
          />
          <div>
            <Label htmlFor="metric" className="mb-1.5 block text-sm">Real metric (optional)</Label>
            <Input
              id="metric"
              value={form.metric}
              onChange={(event) => setForm((prev) => ({ ...prev, metric: event.target.value }))}
              placeholder="Example: reduced manual tracking time by 30%"
            />
          </div>
        </div>

        <Button type="button" onClick={generate} disabled={loading} className="gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate bullet options
        </Button>

        {bullets.length > 0 && (
          <div className="space-y-2">
            {bullets.map((bullet) => (
              <div key={bullet.id} className="rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-sm">{bullet.content}</p>
                <Button type="button" size="sm" variant="ghost" onClick={() => copy(bullet.content)} className="mt-2 gap-1.5">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm">{label}</Label>
      <Textarea id={id} rows={2} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}
