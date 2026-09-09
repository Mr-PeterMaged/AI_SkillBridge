"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Clock, ExternalLink, Link2, Target, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalysisSkeleton } from "@/components/analysis/analysis-skeleton";
import { EmptyNotice } from "@/components/analysis/empty-notice";
import { isSafeHttpUrl } from "@/lib/security/url";
import { getRoleTemplate } from "@/lib/roles";
import { AnalysisDTO, RoadmapTaskDTO, RoadmapWeekDTO } from "@/lib/types/analysis";

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [analysis, setAnalysis] = useState<AnalysisDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/analysis/${id}`);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't load your roadmap.");
        setNotFound(true);
        setLoading(false);
        return;
      }
      setAnalysis(data.analysis);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateTaskLocal(taskId: string, patch: Partial<RoadmapTaskDTO>) {
    setAnalysis((prev) => {
      if (!prev?.roadmap) return prev;
      return {
        ...prev,
        roadmap: {
          ...prev.roadmap,
          weeks: prev.roadmap.weeks.map((w) => ({
            ...w,
            tasks: w.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
          })),
        },
      };
    });
  }

  if (loading) return <AnalysisSkeleton />;

  if (notFound || !analysis) {
    return (
      <EmptyNotice
        icon={Target}
        title="Roadmap not found"
        description="This analysis may have been deleted, or you don't have access to it."
        action={{ href: "/dashboard", label: "Back to dashboard" }}
      />
    );
  }

  if (!analysis.roadmap) {
    return (
      <EmptyNotice
        icon={Target}
        title="No roadmap yet"
        description="Build your personalized 4-week plan from your results page."
        action={{ href: `/dashboard/analysis/${id}/results`, label: "Go build your roadmap" }}
      />
    );
  }

  const role = getRoleTemplate(analysis.targetRole);
  const allTasks = analysis.roadmap.weeks.flatMap((w) => w.tasks);
  const completed = allTasks.filter((t) => t.status === "COMPLETE").length;
  const progressPct = allTasks.length ? Math.round((completed / allTasks.length) * 100) : 0;
  const isDone = allTasks.length > 0 && completed === allTasks.length;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      <div className="rounded-2xl border border-ai/20 bg-gradient-to-br from-ai/[0.06] to-transparent p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ai/15 text-ai">
            <Target className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium text-muted-foreground">{role.label}</p>
        </div>
        <h1 className="mt-2 text-2xl font-semibold">Your {analysis.roadmap.durationWeeks}-Week Plan</h1>
        <div className="mt-4 flex items-center gap-3">
          <Progress
            value={progressPct}
            className="h-2 flex-1 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-ai"
          />
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {completed}/{allTasks.length} tasks
          </span>
        </div>
        {isDone && (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-matched">
            <Trophy className="h-4 w-4" /> All tasks complete — great work.
          </p>
        )}
      </div>

      <div className="space-y-6">
        {analysis.roadmap.weeks.map((week) => (
          <WeekCard key={week.id} analysisId={id} week={week} onUpdateTask={updateTaskLocal} />
        ))}
      </div>

      <div className="flex justify-center border-t border-border pt-8">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/analysis/${id}/results`}>Back to results</Link>
        </Button>
      </div>
    </div>
  );
}

function WeekCard({
  analysisId,
  week,
  onUpdateTask,
}: {
  analysisId: string;
  week: RoadmapWeekDTO;
  onUpdateTask: (taskId: string, patch: Partial<RoadmapTaskDTO>) => void;
}) {
  const completed = week.tasks.filter((t) => t.status === "COMPLETE").length;
  const weekDone = week.tasks.length > 0 && completed === week.tasks.length;

  return (
    <div
      className={`overflow-hidden rounded-2xl border p-6 transition-colors ${
        weekDone ? "border-matched/30 bg-matched/[0.03]" : "border-border"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
              weekDone ? "bg-matched text-matched-foreground" : "bg-ai/15 text-ai"
            }`}
          >
            {weekDone ? <Check className="h-4 w-4" /> : week.weekNumber}
          </span>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Week {week.weekNumber} focus</p>
            <h2 className="font-semibold">{week.focus}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 font-normal">
            <Clock className="h-3 w-3" /> ~{week.estimatedHours}h
          </Badge>
          <Badge variant="outline" className="font-normal">
            {completed}/{week.tasks.length} done
          </Badge>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-muted/40 p-4">
        <p className="text-xs font-medium text-muted-foreground">Goal</p>
        <p className="mt-1 text-sm">{week.learningObjective}</p>
      </div>

      {week.resources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {week.resources.filter((r) => isSafeHttpUrl(r.url)).map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-primary underline-offset-2 hover:underline"
            >
              {r.title} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Micro-tasks &amp; deliverable evidence
        </p>
        <div className="space-y-3">
          {week.tasks.map((task) => (
            <TaskRow key={task.id} analysisId={analysisId} task={task} onUpdate={onUpdateTask} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskRow({
  analysisId,
  task,
  onUpdate,
}: {
  analysisId: string;
  task: RoadmapTaskDTO;
  onUpdate: (taskId: string, patch: Partial<RoadmapTaskDTO>) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState(task.evidenceUrl ?? "");
  const [evidenceType, setEvidenceType] = useState(task.evidenceType ?? "GITHUB");

  async function patchTask(patch: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/analysis/${analysisId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't save that change.");
        return;
      }
      onUpdate(task.id, data.task);
      if (patch.status === "COMPLETE") toast.success("Task marked complete.");
      if (patch.evidenceUrl) toast.success("Evidence saved.");
    } finally {
      setSaving(false);
    }
  }

  function toggleComplete() {
    patchTask({ status: task.status === "COMPLETE" ? "PENDING" : "COMPLETE" });
  }

  function saveEvidence() {
    if (evidenceUrl && !/^https?:\/\//.test(evidenceUrl)) {
      toast.error("Evidence link must be a valid URL starting with http(s)://");
      return;
    }
    patchTask({ evidenceUrl: evidenceUrl || null, evidenceType: evidenceUrl ? evidenceType : null });
  }

  const isComplete = task.status === "COMPLETE";

  return (
    <div className={`rounded-xl border p-3.5 transition-colors ${isComplete ? "border-matched/25 bg-matched/[0.03]" : "border-border/70 bg-card"}`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggleComplete}
          disabled={saving}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isComplete ? "border-matched bg-matched text-matched-foreground" : "border-border hover:border-primary"
          }`}
          aria-label={isComplete ? "Mark incomplete" : "Mark complete"}
        >
          {isComplete && <Check className="h-3 w-3" />}
        </button>
        <div className="flex-1">
          <p className={`text-sm font-medium ${isComplete ? "text-muted-foreground line-through" : ""}`}>
            {task.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Select value={evidenceType} onValueChange={(v) => setEvidenceType(v as typeof evidenceType)}>
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GITHUB">GitHub repo</SelectItem>
                <SelectItem value="DEMO_URL">Live demo</SelectItem>
                <SelectItem value="PORTFOLIO_URL">Portfolio</SelectItem>
                <SelectItem value="CASE_STUDY">Case study</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="https://…"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="h-8 flex-1 text-xs"
            />
            <Button type="button" size="sm" variant="outline" onClick={saveEvidence} disabled={saving} className="h-8 gap-1.5">
              <Link2 className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
          {task.evidenceUrl && isSafeHttpUrl(task.evidenceUrl) && (
            <a
              href={task.evidenceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex w-fit items-center gap-1 text-xs text-matched underline-offset-2 hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> Evidence link saved
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
