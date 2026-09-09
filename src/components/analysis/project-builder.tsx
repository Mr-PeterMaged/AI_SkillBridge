"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  Code2,
  Layers,
  ListChecks,
  Rocket,
  Copy,
  Check,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { buttonPress } from "@/lib/animations";
import { ProjectRecommendationDTO } from "@/lib/types/analysis";

const PROJECT_TYPES = [
  { value: "default", label: "Best fit for my gaps" },
  { value: "dashboard", label: "Dashboard" },
  { value: "productivity", label: "Productivity tool" },
  { value: "data", label: "Data project" },
  { value: "api_service", label: "API service" },
] as const;

const DIFFICULTY_CLASS: Record<string, string> = {
  beginner: "bg-matched/15 text-matched",
  intermediate: "bg-partial/20 text-partial-foreground",
  advanced: "bg-critical/15 text-critical",
};

export function ProjectBuilder({
  analysisId,
  project,
  hasRoadmap,
  onProjectChange,
}: {
  analysisId: string;
  project: ProjectRecommendationDTO | null;
  hasRoadmap: boolean;
  onProjectChange: (project: ProjectRecommendationDTO) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [addingToRoadmap, setAddingToRoadmap] = useState(false);
  const [projectType, setProjectType] = useState<(typeof PROJECT_TYPES)[number]["value"]>("default");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/analysis/${analysisId}/project/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectType }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't build a project right now.");
        return;
      }
      onProjectChange(data.project);
      toast.success("Project ready.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function addToRoadmap() {
    if (!project) return;
    setAddingToRoadmap(true);
    try {
      const res = await fetch(`/api/analysis/${analysisId}/project/${project.id}/add-to-roadmap`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't add this project to your roadmap.");
        return;
      }
      onProjectChange({ ...project, addedToRoadmap: true });
      toast.success("Added a project week to your roadmap.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setAddingToRoadmap(false);
    }
  }

  async function copyReadme() {
    if (!project?.readmeTemplate) return;
    try {
      await navigator.clipboard.writeText(project.readmeTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — select and copy the text manually.");
    }
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-ai/25 bg-gradient-to-br from-ai/[0.06] to-transparent p-6 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-ai/15 text-ai">
          <Code2 className="h-5 w-5" />
        </span>
        <h2 className="mt-3 text-lg font-semibold">Build proof, not just knowledge</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
          Turn your priority gaps into one practical, portfolio-ready project — scoped to about a week of your
          time.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Select value={projectType} onValueChange={(v) => setProjectType(v as typeof projectType)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <motion.div {...buttonPress}>
            <Button onClick={generate} disabled={generating} className="gap-2 bg-ai text-ai-foreground hover:bg-ai/90">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate my project
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const coveragePct = project.skillCoverage.length
    ? Math.round((project.skillCoverage.filter((c) => c.isGapCovered).length / project.skillCoverage.length) * 100)
    : 0;
  const gapsCoveredCount = project.skillCoverage.filter((c) => c.isGapCovered).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-ai">Portfolio project</p>
            <h2 className="mt-0.5 text-xl font-semibold">{project.title}</h2>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{project.valueProposition}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {project.difficulty && (
              <Badge className={DIFFICULTY_CLASS[project.difficulty] ?? "bg-secondary"}>{project.difficulty}</Badge>
            )}
            {project.estimatedHours && (
              <Badge variant="outline" className="gap-1 font-normal">
                <CalendarDays className="h-3 w-3" /> ~{project.estimatedHours}h
              </Badge>
            )}
          </div>
        </div>

        {project.skillCoverage.length > 0 && (
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">
                Covers <AnimatedNumber value={gapsCoveredCount} className="inline" /> of{" "}
                <AnimatedNumber value={project.skillCoverage.length} className="inline" /> targeted skills
              </span>
              <span className="text-muted-foreground">{coveragePct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-ai"
                initial={{ width: 0 }}
                animate={{ width: `${coveragePct}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.skillCoverage.map((c) => (
                <Badge
                  key={c.skill}
                  title={c.howCovered}
                  className={c.isGapCovered ? "bg-primary/15 text-primary" : "bg-matched/15 text-matched"}
                >
                  {c.skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2">
        {project.userStories.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <ListChecks className="h-4 w-4 text-muted-foreground" /> What it does
            </h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {project.userStories.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {project.featureChecklist.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Check className="h-4 w-4 text-muted-foreground" /> Feature checklist
            </h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {project.featureChecklist.map((f) => (
                <li key={f} className="flex items-start gap-1.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-border" /> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.suggestedStack.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Layers className="h-4 w-4 text-muted-foreground" /> Suggested stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.suggestedStack.map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {project.deliverables.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Rocket className="h-4 w-4 text-muted-foreground" /> Deliverables
            </h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {project.deliverables.map((d) => (
                <li key={d}>• {d}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {project.buildPlan.length > 0 && (
        <div className="border-t border-border p-6">
          <h3 className="mb-3 text-sm font-semibold">7-day build plan</h3>
          <div className="grid gap-2 sm:grid-cols-7">
            {project.buildPlan.map((d) => (
              <div key={d.day} className="rounded-lg border border-border/70 p-2.5">
                <p className="text-[10px] font-semibold text-ai">Day {d.day}</p>
                <p className="mt-0.5 text-xs font-medium">{d.focus}</p>
                <ul className="mt-1.5 space-y-1 text-[11px] text-muted-foreground">
                  {d.tasks.slice(0, 3).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.readmeTemplate && (
        <details className="border-t border-border p-6">
          <summary className="cursor-pointer text-sm font-semibold">README starter</summary>
          <div className="relative mt-3">
            <pre className="max-h-64 overflow-auto rounded-lg bg-muted/50 p-4 text-xs whitespace-pre-wrap text-muted-foreground">
              {project.readmeTemplate}
            </pre>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={copyReadme}
              className="absolute top-2 right-2 gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Review this text and include only work you genuinely completed.
          </p>
        </details>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border p-6">
        <motion.div {...buttonPress}>
          <Button
            onClick={addToRoadmap}
            disabled={addingToRoadmap || project.addedToRoadmap || !hasRoadmap}
            className="gap-2"
          >
            {addingToRoadmap ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {project.addedToRoadmap ? "Added to your roadmap" : "Add this project to my roadmap"}
          </Button>
        </motion.div>
        <div className="flex items-center gap-2">
          <Select value={projectType} onValueChange={(v) => setProjectType(v as typeof projectType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={generate} disabled={generating} className="gap-1.5">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Regenerate
          </Button>
        </div>
        {!hasRoadmap && (
          <p className="w-full text-xs text-muted-foreground">Build your 4-week roadmap to add this project to it.</p>
        )}
      </div>
    </div>
  );
}
