"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MapIcon, Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSequence } from "@/components/analysis/loading-sequence";
import { GapCard } from "@/components/analysis/gap-card";
import { getRoleTemplate } from "@/lib/roles";
import { AnalysisDTO, MatchedRequirementDTO } from "@/lib/types/analysis";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [analysis, setAnalysis] = useState<AnalysisDTO | null>(null);
  const [matched, setMatched] = useState<MatchedRequirementDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [buildingRoadmap, setBuildingRoadmap] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/analysis/${id}`);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't load this analysis.");
        setLoading(false);
        return;
      }
      setAnalysis(data.analysis);
      setMatched(data.matchedRequirements ?? []);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function buildRoadmap() {
    setBuildingRoadmap(true);
    try {
      const res = await fetch(`/api/analysis/${id}/roadmap`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't build your roadmap.");
        setBuildingRoadmap(false);
        return;
      }
      router.push(`/dashboard/analysis/${id}/roadmap`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setBuildingRoadmap(false);
    }
  }

  if (loading) return <LoadingSequence />;
  if (!analysis) return <p className="text-muted-foreground">Analysis not found.</p>;

  if (analysis.status !== "SCORED" && analysis.status !== "ROADMAP_READY") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="font-medium">This analysis hasn&apos;t been scored yet.</p>
        <Button className="mt-6" asChild>
          <Link href={`/dashboard/analysis/${id}/review`}>Go review your skills</Link>
        </Button>
      </div>
    );
  }

  const role = getRoleTemplate(analysis.targetRole);
  const score = analysis.readinessScore ?? 0;
  const matchedSkills = matched.filter((m) => m.status === "matched");
  const partialSkills = matched.filter((m) => m.status === "partial");
  const criticalGaps = analysis.skillGaps.filter((g) => g.priority === "CRITICAL");
  const importantGaps = analysis.skillGaps.filter((g) => g.priority === "IMPORTANT");
  const niceGaps = analysis.skillGaps.filter((g) => g.priority === "NICE_TO_HAVE");

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Hero score card */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="text-sm font-medium text-muted-foreground">{role.label}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          You are {score}% ready for {role.label}.
        </h1>
        {analysis.candidateSummary && (
          <p className="mt-3 max-w-2xl text-muted-foreground">{analysis.candidateSummary}</p>
        )}

        <div className="mt-6">
          <Progress value={score} className="h-3" />
        </div>

        {analysis.scoreBreakdown && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <BreakdownStat
              label="Critical skills"
              matched={analysis.scoreBreakdown.criticalMatched}
              total={analysis.scoreBreakdown.criticalTotal}
              coverage={analysis.scoreBreakdown.criticalCoverage}
            />
            <BreakdownStat
              label="Important skills"
              matched={analysis.scoreBreakdown.importantMatched}
              total={analysis.scoreBreakdown.importantTotal}
              coverage={analysis.scoreBreakdown.importantCoverage}
            />
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">Evidence coverage</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {Math.round(analysis.scoreBreakdown.evidenceCoverage * 100)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">of matched skills have proof</p>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          This score is a learning and preparation indicator. It is not a hiring decision.
        </p>
      </div>

      {/* Matched skills */}
      {(matchedSkills.length > 0 || partialSkills.length > 0) && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <CheckCircle2 className="h-5 w-5 text-success" /> Matched skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((m) => (
              <Badge key={m.canonicalName} className="bg-success/15 text-success-foreground hover:bg-success/15">
                {m.canonicalName}
              </Badge>
            ))}
            {partialSkills.map((m) => (
              <Badge key={m.canonicalName} variant="outline" className="border-warning/50 text-warning-foreground/90">
                {m.canonicalName} (partial)
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Gaps */}
      <section className="space-y-6">
        {criticalGaps.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold">Critical gaps</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {criticalGaps.map((g) => (
                <GapCard key={g.id} gap={g} />
              ))}
            </div>
          </div>
        )}
        {importantGaps.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold">Important gaps</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {importantGaps.map((g) => (
                <GapCard key={g.id} gap={g} />
              ))}
            </div>
          </div>
        )}
        {niceGaps.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold">Nice-to-have</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {niceGaps.map((g) => (
                <GapCard key={g.id} gap={g} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Project recommendation */}
      {analysis.projectRecommendations.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Recommended project</h2>
          {analysis.projectRecommendations.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">{p.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.requiredSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* CTA */}
      <div className="flex justify-center border-t border-border pt-8">
        {analysis.status === "ROADMAP_READY" ? (
          <Button size="lg" className="gap-2" asChild>
            <Link href={`/dashboard/analysis/${id}/roadmap`}>
              <MapIcon className="h-4 w-4" /> View My 4-Week Plan
            </Link>
          </Button>
        ) : (
          <Button size="lg" className="gap-2" onClick={buildRoadmap} disabled={buildingRoadmap}>
            {buildingRoadmap ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapIcon className="h-4 w-4" />}
            Build My 4-Week Plan
          </Button>
        )}
      </div>
    </div>
  );
}

function BreakdownStat({
  label,
  matched,
  total,
  coverage,
}: {
  label: string;
  matched: number;
  total: number;
  coverage: number;
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">
        {matched}/{total}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{Math.round(coverage * 100)}% covered</p>
    </div>
  );
}
