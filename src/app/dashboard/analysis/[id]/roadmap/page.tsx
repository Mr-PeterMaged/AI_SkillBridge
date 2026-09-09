"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Clock, ExternalLink, FilePlus2, Target, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnalysisSkeleton } from "@/components/analysis/analysis-skeleton";
import { EmptyNotice } from "@/components/analysis/empty-notice";
import { AddProofDialog } from "@/components/analysis/add-proof-dialog";
import { ProjectBuilder } from "@/components/analysis/project-builder";
import { WeeklyCheckInCard } from "@/components/roadmap/weekly-check-in-card";
import { isSafeHttpUrl } from "@/lib/security/url";
import { evidenceStatusForTask, EVIDENCE_STATUS_LABEL, EVIDENCE_STATUS_CLASS } from "@/lib/evidence-status";
import { getRoleTemplate } from "@/lib/roles";
import {
  AnalysisDTO,
  EvidenceItemDTO,
  ProjectRecommendationDTO,
  RoadmapTaskDTO,
  RoadmapWeekDTO,
  WeeklyCheckInDTO,
} from "@/lib/types/analysis";

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

  function addEvidenceLocal(evidence: EvidenceItemDTO) {
    setAnalysis((prev) => (prev ? { ...prev, evidenceItems: [evidence, ...prev.evidenceItems] } : prev));
  }

  function addCheckInLocal(checkIn: WeeklyCheckInDTO) {
    setAnalysis((prev) => (prev ? { ...prev, weeklyCheckIns: [checkIn, ...prev.weeklyCheckIns] } : prev));
    if (checkIn.roadmapTaskId && checkIn.response === "COMPLETED") {
      updateTaskLocal(checkIn.roadmapTaskId, { status: "COMPLETE", completedAt: new Date().toISOString() });
    } else if (checkIn.roadmapTaskId && checkIn.response === "MADE_PROGRESS") {
      updateTaskLocal(checkIn.roadmapTaskId, { status: "IN_PROGRESS" });
    }
  }

  function updateProjectLocal(project: ProjectRecommendationDTO) {
    setAnalysis((prev) =>
      prev
        ? {
            ...prev,
            projectRecommendations: [
              project,
              ...prev.projectRecommendations.filter((item) => item.id !== project.id && item.source !== "AI_GENERATED"),
            ],
          }
        : prev
    );
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
  const nextTask = allTasks.find((task) => task.status !== "COMPLETE") ?? null;

  const provableSkillNames = Array.from(
    new Set([
      ...analysis.candidateSkills.map((s) => s.canonicalName),
      ...analysis.skillGaps.map((g) => g.skillName),
    ])
  );

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
        <p className="mt-2 text-sm text-muted-foreground">
          Based on your available time, this plan is designed for {analysis.roadmap.durationWeeks} weeks.
        </p>
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

      <WeeklyCheckInCard
        analysisId={id}
        task={nextTask}
        latestCheckIn={analysis.weeklyCheckIns[0]}
        onCreated={addCheckInLocal}
      />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Build a project that proves your skills</h2>
        <ProjectBuilder
          analysisId={id}
          project={analysis.projectRecommendations.find((p) => p.source === "AI_GENERATED") ?? analysis.projectRecommendations[0] ?? null}
          hasRoadmap={Boolean(analysis.roadmap)}
          onProjectChange={updateProjectLocal}
        />
      </section>

      <div className="space-y-6">
        {analysis.roadmap.weeks.map((week, i) => (
          <motion.div
            key={week.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
          >
            <WeekCard
              analysisId={id}
              week={week}
              evidenceItems={analysis.evidenceItems}
              provableSkillNames={provableSkillNames}
              onUpdateTask={updateTaskLocal}
              onAddEvidence={addEvidenceLocal}
            />
          </motion.div>
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
  evidenceItems,
  provableSkillNames,
  onUpdateTask,
  onAddEvidence,
}: {
  analysisId: string;
  week: RoadmapWeekDTO;
  evidenceItems: EvidenceItemDTO[];
  provableSkillNames: string[];
  onUpdateTask: (taskId: string, patch: Partial<RoadmapTaskDTO>) => void;
  onAddEvidence: (evidence: EvidenceItemDTO) => void;
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
            <TaskRow
              key={task.id}
              analysisId={analysisId}
              task={task}
              evidenceItems={evidenceItems}
              provableSkillNames={provableSkillNames}
              onUpdate={onUpdateTask}
              onAddEvidence={onAddEvidence}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskRow({
  analysisId,
  task,
  evidenceItems,
  provableSkillNames,
  onUpdate,
  onAddEvidence,
}: {
  analysisId: string;
  task: RoadmapTaskDTO;
  evidenceItems: EvidenceItemDTO[];
  provableSkillNames: string[];
  onUpdate: (taskId: string, patch: Partial<RoadmapTaskDTO>) => void;
  onAddEvidence: (evidence: EvidenceItemDTO) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function toggleComplete() {
    setSaving(true);
    try {
      const nextStatus = task.status === "COMPLETE" ? "PENDING" : "COMPLETE";
      const res = await fetch(`/api/analysis/${analysisId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't save that change.");
        return;
      }
      onUpdate(task.id, data.task);
      if (nextStatus === "COMPLETE") toast.success("Task marked complete.");
    } finally {
      setSaving(false);
    }
  }

  const isComplete = task.status === "COMPLETE";
  const linkedEvidence = evidenceItems.filter((e) => e.roadmapTaskId === task.id);
  const status = evidenceStatusForTask(task, evidenceItems);

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
          <AnimatePresence>
            {isComplete && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
              >
                <Check className="h-3 w-3" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={`text-sm font-medium ${isComplete ? "text-muted-foreground line-through" : ""}`}>
              {task.title}
            </p>
            <Badge className={`font-normal ${EVIDENCE_STATUS_CLASS[status]}`}>{EVIDENCE_STATUS_LABEL[status]}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>

          {linkedEvidence.length > 0 && (
            <ul className="mt-2 space-y-1">
              {linkedEvidence.map((e) => (
                <li key={e.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 shrink-0 text-matched" />
                  {e.url && isSafeHttpUrl(e.url) ? (
                    <a href={e.url} target="_blank" rel="noreferrer" className="text-matched underline-offset-2 hover:underline">
                      {e.url}
                    </a>
                  ) : (
                    <span>Reflection added</span>
                  )}
                  {e.provesSkills.length > 0 && (
                    <span className="text-muted-foreground">— proves {e.provesSkills.join(", ")}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2.5">
            <AddProofDialog
              analysisId={analysisId}
              roadmapTaskId={task.id}
              candidateSkillNames={provableSkillNames}
              onCreated={onAddEvidence}
            >
              <Button type="button" size="sm" variant="outline" className="h-8 gap-1.5">
                <FilePlus2 className="h-3.5 w-3.5" /> Add proof
              </Button>
            </AddProofDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
