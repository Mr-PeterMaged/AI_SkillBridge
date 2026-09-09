"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ClipboardCheck, Flag, FileCheck2, MessageSquareText, TrendingUp, Sparkles } from "lucide-react";
import { EvidenceItemDTO, QuizAttemptDTO, ReadinessSnapshotDTO, WeeklyCheckInDTO } from "@/lib/types/analysis";
import { fadeUp, reducedVariants, staggerContainer } from "@/lib/animations";
import { ResumeBulletDialog } from "@/components/analysis/resume-bullet-dialog";

const EVIDENCE_TYPE_LABEL: Record<string, string> = {
  GITHUB: "GitHub repository added",
  DEMO_URL: "Live demo added",
  PORTFOLIO_URL: "Portfolio link added",
  CASE_STUDY: "Case study added",
  NOTE: "Note added",
};

type TimelineNode =
  | { kind: "baseline"; date: string; score: number }
  | { kind: "evidence"; date: string; label: string; evidence: EvidenceItemDTO }
  | { kind: "check-in"; date: string; checkIn: WeeklyCheckInDTO }
  | { kind: "quiz"; date: string; attempt: QuizAttemptDTO }
  | { kind: "reassessment"; date: string; score: number };

export function EvidenceTimeline({
  analysisId,
  snapshots,
  evidence,
  checkIns = [],
  quizAttempts = [],
}: {
  analysisId: string;
  snapshots: ReadinessSnapshotDTO[];
  evidence: EvidenceItemDTO[];
  checkIns?: WeeklyCheckInDTO[];
  quizAttempts?: QuizAttemptDTO[];
}) {
  const shouldReduceMotion = useReducedMotion();

  const nodes: TimelineNode[] = [
    ...snapshots.map((s): TimelineNode =>
      s.kind === "BASELINE"
        ? { kind: "baseline", date: s.createdAt, score: s.readinessScore }
        : { kind: "reassessment", date: s.createdAt, score: s.readinessScore }
    ),
    ...evidence.map(
      (e): TimelineNode => ({
        kind: "evidence",
        date: e.createdAt,
        label: EVIDENCE_TYPE_LABEL[e.type] ?? "Evidence added",
        evidence: e,
      })
    ),
    ...checkIns.map((checkIn): TimelineNode => ({ kind: "check-in", date: checkIn.createdAt, checkIn })),
    ...quizAttempts.map((attempt): TimelineNode => ({ kind: "quiz", date: attempt.createdAt, attempt })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (nodes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Your timeline will fill in as you add evidence and reassess your readiness.
      </p>
    );
  }

  // Animates on mount (not scroll-into-view) — this is real data the user
  // needs to see reliably, not a marketing reveal that can afford to be
  // gated behind an intersection observer that might never fire.
  return (
    <motion.div
      className="relative space-y-5 pl-6"
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.06)}
    >
      <div className="absolute top-1.5 bottom-1.5 left-[7px] w-px bg-border" aria-hidden />
      {nodes.map((node, i) => (
        <motion.div key={i} className="relative" variants={shouldReduceMotion ? reducedVariants : fadeUp}>
          <span
            className={`absolute -left-6 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background ${
              node.kind === "reassessment"
                ? "bg-ai"
                : node.kind === "check-in"
                  ? "bg-warning"
                  : node.kind === "quiz"
                    ? "bg-primary"
                : node.kind === "baseline"
                  ? "bg-primary"
                  : "bg-matched"
            }`}
          />
          <div className="flex items-center gap-2 text-sm font-medium">
            {node.kind === "baseline" && (
              <>
                <Flag className="h-3.5 w-3.5 text-primary" /> Baseline score: {node.score}%
              </>
            )}
            {node.kind === "evidence" && (
              <>
                <FileCheck2 className="h-3.5 w-3.5 text-matched" /> {node.label}
              </>
            )}
            {node.kind === "reassessment" && (
              <>
                <TrendingUp className="h-3.5 w-3.5 text-ai" /> Reassessed: {node.score}%
              </>
            )}
            {node.kind === "check-in" && (
              <>
                <MessageSquareText className="h-3.5 w-3.5 text-warning" /> Weekly check-in saved
              </>
            )}
            {node.kind === "quiz" && (
              <>
                <ClipboardCheck className="h-3.5 w-3.5 text-primary" /> Quiz completed:{" "}
                {node.attempt.skill.replaceAll("_", " ").toLowerCase()} ({node.attempt.score}/{node.attempt.total})
              </>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date(node.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
          </p>
          {node.kind === "evidence" && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {node.evidence.provesSkills.length > 0 && (
                <p className="text-xs text-muted-foreground">Supports: {node.evidence.provesSkills.join(", ")}</p>
              )}
              <ResumeBulletDialog
                analysisId={analysisId}
                evidenceId={node.evidence.id}
                existingBullets={node.evidence.resumeBullets ?? []}
              />
            </div>
          )}
          {node.kind === "check-in" && (
            <p className="mt-1 text-xs text-muted-foreground">{node.checkIn.aiSuggestion}</p>
          )}
        </motion.div>
      ))}
      <motion.div
        className="relative flex items-center gap-2 text-xs text-muted-foreground"
        variants={shouldReduceMotion ? reducedVariants : fadeUp}
      >
        <Sparkles className="h-3 w-3" /> More milestones appear here as you keep going.
      </motion.div>
    </motion.div>
  );
}
