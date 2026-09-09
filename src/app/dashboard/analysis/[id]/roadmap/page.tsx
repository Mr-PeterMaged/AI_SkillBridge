"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ExternalLink } from "lucide-react";

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
import { LoadingSequence } from "@/components/analysis/loading-sequence";
import { getRoleTemplate } from "@/lib/roles";
import { AnalysisDTO, RoadmapTaskDTO } from "@/lib/types/analysis";

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [analysis, setAnalysis] = useState<AnalysisDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/analysis/${id}`);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't load your roadmap.");
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

  if (loading) return <LoadingSequence />;
  if (!analysis) return <p className="text-muted-foreground">Analysis not found.</p>;

  if (!analysis.roadmap) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="font-medium">No roadmap yet.</p>
        <Button className="mt-6" asChild>
          <Link href={`/dashboard/analysis/${id}/results`}>Go build your roadmap</Link>
        </Button>
      </div>
    );
  }

  const role = getRoleTemplate(analysis.targetRole);
  const allTasks = analysis.roadmap.weeks.flatMap((w) => w.tasks);
  const completed = allTasks.filter((t) => t.status === "COMPLETE").length;
  const progressPct = allTasks.length ? Math.round((completed / allTasks.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{role.label}</p>
        <h1 className="mt-1 text-2xl font-semibold">Your {analysis.roadmap.durationWeeks}-Week Plan</h1>
        <div className="mt-4 flex items-center gap-3">
          <Progress value={progressPct} className="h-2 flex-1" />
          <span className="shrink-0 text-sm text-muted-foreground">
            {completed}/{allTasks.length} tasks
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {analysis.roadmap.weeks.map((week) => (
          <div key={week.id} className="rounded-2xl border border-border p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">
                Week {week.weekNumber}: {week.focus}
              </h2>
              <Badge variant="secondary">~{week.estimatedHours}h</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{week.learningObjective}</p>

            {week.resources.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {week.resources.map((r) => (
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

            <div className="mt-5 space-y-3">
              {week.tasks.map((task) => (
                <TaskRow key={task.id} analysisId={id} task={task} onUpdate={updateTaskLocal} />
              ))}
            </div>
          </div>
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

  return (
    <div className="rounded-lg border border-border/70 p-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggleComplete}
          disabled={saving}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            task.status === "COMPLETE" ? "border-success bg-success text-success-foreground" : "border-border"
          }`}
          aria-label={task.status === "COMPLETE" ? "Mark incomplete" : "Mark complete"}
        >
          {task.status === "COMPLETE" && <Check className="h-3 w-3" />}
        </button>
        <div className="flex-1">
          <p className={`text-sm font-medium ${task.status === "COMPLETE" ? "text-muted-foreground line-through" : ""}`}>
            {task.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
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
            <Button type="button" size="sm" variant="outline" onClick={saveEvidence} disabled={saving} className="h-8">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
