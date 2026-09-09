"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, FolderGit2, Rocket, Briefcase, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EvidenceItemDTO } from "@/lib/types/analysis";

const EVIDENCE_TYPES = [
  { value: "GITHUB", label: "GitHub repository", icon: FolderGit2, needsUrl: true },
  { value: "DEMO_URL", label: "Live demo", icon: Rocket, needsUrl: true },
  { value: "PORTFOLIO_URL", label: "Portfolio URL", icon: Briefcase, needsUrl: true },
  { value: "CASE_STUDY", label: "Case study / reflection", icon: FileText, needsUrl: false },
] as const;

export function AddProofDialog({
  analysisId,
  roadmapTaskId,
  candidateSkillNames,
  children,
  onCreated,
}: {
  analysisId: string;
  roadmapTaskId?: string;
  /** Skill names the user can pick from for "which skill does this prove?" */
  candidateSkillNames: string[];
  children: React.ReactNode;
  onCreated: (evidence: EvidenceItemDTO) => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<(typeof EVIDENCE_TYPES)[number]["value"]>("GITHUB");
  const [url, setUrl] = useState("");
  const [reflectionBuilt, setReflectionBuilt] = useState("");
  const [reflectionLearned, setReflectionLearned] = useState("");
  const [provesSkills, setProvesSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const activeType = EVIDENCE_TYPES.find((t) => t.value === type)!;

  function toggleSkill(name: string) {
    setProvesSkills((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]));
  }

  function reset() {
    setType("GITHUB");
    setUrl("");
    setReflectionBuilt("");
    setReflectionLearned("");
    setProvesSkills([]);
    setError(null);
  }

  async function handleSubmit() {
    setError(null);
    if (activeType.needsUrl && !url.trim()) {
      setError("Add a link for this evidence type, or switch to Case study / reflection.");
      return;
    }
    if (!url.trim() && !reflectionBuilt.trim() && !reflectionLearned.trim()) {
      setError("Add a link or a short reflection so mentors have something to review.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/analysis/${analysisId}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapTaskId: roadmapTaskId ?? null,
          type,
          url: url.trim() || null,
          reflectionBuilt: reflectionBuilt.trim() || null,
          reflectionLearned: reflectionLearned.trim() || null,
          provesSkills,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const fieldError = data.issues?.fieldErrors
          ? Object.values(data.issues.fieldErrors as Record<string, string[]>).flat()[0]
          : undefined;
        setError(fieldError ?? data.error ?? "Couldn't save this evidence.");
        setSubmitting(false);
        return;
      }
      toast.success("Evidence added.");
      onCreated(data.evidence);
      setOpen(false);
      reset();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add proof</DialogTitle>
          <DialogDescription>
            Portfolio evidence that mentors and employers can review — a link, or a short written reflection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm">Evidence type</Label>
            <div className="grid grid-cols-2 gap-2">
              {EVIDENCE_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    type === t.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <t.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {activeType.needsUrl && (
            <div>
              <Label htmlFor="evidence-url" className="mb-1.5 block text-sm">
                Link
              </Label>
              <Input
                id="evidence-url"
                placeholder="https://github.com/you/project"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="evidence-built" className="mb-1.5 block text-sm">
              What did you build? (optional)
            </Label>
            <Textarea
              id="evidence-built"
              rows={2}
              value={reflectionBuilt}
              onChange={(e) => setReflectionBuilt(e.target.value)}
              placeholder="A job application tracker with typed React components and a REST API."
            />
          </div>

          <div>
            <Label htmlFor="evidence-learned" className="mb-1.5 block text-sm">
              What did you learn? (optional)
            </Label>
            <Textarea
              id="evidence-learned"
              rows={2}
              value={reflectionLearned}
              onChange={(e) => setReflectionLearned(e.target.value)}
              placeholder="How to type API responses end-to-end and handle loading/error states."
            />
          </div>

          {candidateSkillNames.length > 0 && (
            <div>
              <Label className="mb-2 block text-sm">Which skill(s) does this prove?</Label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {candidateSkillNames.map((name) => (
                  <label key={name} className="flex items-center gap-1.5 text-sm">
                    <Checkbox
                      checked={provesSkills.includes(name)}
                      onCheckedChange={() => toggleSkill(name)}
                    />
                    {name}
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                You decide which skills this proves — SkillBridge never assumes a link automatically verifies a
                skill.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting} className="gap-1.5">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save evidence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
