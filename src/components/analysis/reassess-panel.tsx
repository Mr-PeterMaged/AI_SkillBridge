"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Loader2, Sparkles, TrendingDown, TrendingUp, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { buttonPress, fadeUp } from "@/lib/animations";

export type ReassessResult = {
  previousScore: number;
  newScore: number;
  scoreChange: number;
  strengthenedSkills: string[];
  remainingGaps: { skillName: string; priority: string }[];
};

export function ReassessPanel({
  analysisId,
  eligible,
  ineligibleReason,
  onReassessed,
}: {
  analysisId: string;
  eligible: boolean;
  ineligibleReason: string;
  onReassessed: (result: ReassessResult) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReassessResult | null>(null);

  async function handleReassess() {
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis/${analysisId}/reassess`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't reassess your readiness right now.");
        return;
      }
      const next: ReassessResult = {
        previousScore: data.previousScore,
        newScore: data.newScore,
        scoreChange: data.scoreChange,
        strengthenedSkills: data.strengthenedSkills ?? [],
        remainingGaps: (data.remainingGaps ?? []).map((g: { skillName: string; priority: string }) => ({
          skillName: g.skillName,
          priority: g.priority,
        })),
      };
      setResult(next);
      onReassessed(next);
      toast.success("Readiness reassessed.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ai/25 bg-gradient-to-br from-ai/[0.06] to-transparent p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ai/15 text-ai">
          <Sparkles className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold">Reassess my readiness</h2>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="cta" variants={fadeUp} initial="hidden" animate="show" className="mt-3">
            <p className="text-sm text-muted-foreground">
              Prove real progress — completed tasks and submitted evidence deterministically update your score
              using the same scoring engine as your first analysis.
            </p>
            {eligible ? (
              <motion.div {...buttonPress} className="mt-4 inline-block">
                <Button onClick={handleReassess} disabled={loading} className="gap-2 bg-ai text-ai-foreground hover:bg-ai/90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Reassess My Readiness
                </Button>
              </motion.div>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">{ineligibleReason}</p>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" variants={fadeUp} initial="hidden" animate="show" className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Previous</p>
                <p className="text-2xl font-bold tabular-nums text-muted-foreground">{result.previousScore}%</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">New score</p>
                <p className="text-2xl font-bold tabular-nums">
                  <AnimatedNumber value={result.newScore} suffix="%" />
                </p>
              </div>
              <Badge
                className={`gap-1 ${
                  result.scoreChange > 0
                    ? "bg-matched/15 text-matched"
                    : result.scoreChange < 0
                      ? "bg-critical/15 text-critical"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {result.scoreChange > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : result.scoreChange < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {result.scoreChange > 0 ? "+" : ""}
                {result.scoreChange} pts
              </Badge>
            </div>

            {result.strengthenedSkills.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Strengthened with proof</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.strengthenedSkills.map((s) => (
                    <Badge key={s} className="bg-matched/15 text-matched hover:bg-matched/15">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {result.remainingGaps.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  {result.remainingGaps.length} priority gap{result.remainingGaps.length === 1 ? "" : "s"} remaining
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.remainingGaps.slice(0, 6).map((g) => (
                    <Badge key={g.skillName} variant="outline" className="font-normal">
                      {g.skillName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setResult(null)}
              className="gap-1.5"
            >
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
        This is an educational readiness indicator, not a hiring decision.
      </p>
    </div>
  );
}
