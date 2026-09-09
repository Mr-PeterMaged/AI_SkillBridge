"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  MapIcon,
  Code2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnalysisSkeleton } from "@/components/analysis/analysis-skeleton";
import { EmptyNotice } from "@/components/analysis/empty-notice";
import { GapCard } from "@/components/analysis/gap-card";
import { ScoreRing } from "@/components/analysis/score-ring";
import { getRoleTemplate } from "@/lib/roles";
import { AnalysisDTO, MatchedRequirementDTO } from "@/lib/types/analysis";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [analysis, setAnalysis] = useState<AnalysisDTO | null>(null);
  const [matched, setMatched] = useState<MatchedRequirementDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buildingRoadmap, setBuildingRoadmap] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/analysis/${id}`);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't load this analysis.");
        setNotFound(true);
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

  if (loading) return <AnalysisSkeleton />;

  if (notFound || !analysis) {
    return (
      <EmptyNotice
        icon={AlertTriangle}
        title="Analysis not found"
        description="This analysis may have been deleted, or you don't have access to it."
        action={{ href: "/dashboard", label: "Back to dashboard" }}
      />
    );
  }

  if (analysis.status !== "SCORED" && analysis.status !== "ROADMAP_READY") {
    return (
      <EmptyNotice
        icon={Sparkles}
        title="This analysis hasn't been scored yet"
        description="Finish reviewing your extracted skills to unlock your readiness score."
        action={{ href: `/dashboard/analysis/${id}/review`, label: "Go review your skills" }}
      />
    );
  }

  const role = getRoleTemplate(analysis.targetRole);
  const score = analysis.readinessScore ?? 0;
  const matchedSkills = matched.filter((m) => m.status === "matched");
  const partialSkills = matched.filter((m) => m.status === "partial");
  const missingSkills = matched.filter((m) => m.status === "missing");
  const topGaps = analysis.skillGaps.slice(0, 3);
  const remainingGapsCount = Math.max(analysis.skillGaps.length - topGaps.length, 0);

  function evidenceQuoteFor(skillName: string) {
    const req = analysis!.jobRequirements.find(
      (r) => r.canonicalName.toLowerCase() === skillName.toLowerCase()
    );
    return req?.evidence?.[0];
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-16">
      {/* Hero score card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          <ScoreRing score={score} />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-medium text-muted-foreground">{role.label}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              You are {score}% ready for this role.
            </h1>
            {analysis.candidateSummary && (
              <p className="mt-3 text-sm text-muted-foreground sm:max-w-xl">{analysis.candidateSummary}</p>
            )}

            {analysis.scoreBreakdown && (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
                <div className="rounded-xl bg-muted/40 p-3.5">
                  <p className="text-xs text-muted-foreground">Evidence coverage</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {Math.round(analysis.scoreBreakdown.evidenceCoverage * 100)}%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">of matched skills have proof</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          This score is a learning and preparation indicator, computed deterministically from your confirmed
          skills. It is not a hiring decision.
        </p>
      </div>

      {/* Strengths */}
      {matchedSkills.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-matched/15 text-matched">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            Your strengths
          </h2>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((m) => (
              <Badge key={m.canonicalName} className="bg-matched/15 text-matched hover:bg-matched/15">
                {m.canonicalName}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Top priority gaps */}
      {topGaps.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-critical/15 text-critical">
                <AlertTriangle className="h-4 w-4" />
              </span>
              Top priority gaps
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {topGaps.map((g) => (
              <GapCard key={g.id} gap={g} evidenceQuote={evidenceQuoteFor(g.skillName)} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended project */}
      {analysis.projectRecommendations.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Recommended project</h2>
          {analysis.projectRecommendations.map((p) => (
            <Card key={p.id} className="border border-border">
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

      {/* Expandable full skills analysis */}
      <section>
        <button
          type="button"
          onClick={() => setShowFullAnalysis((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-4 text-left transition-colors hover:bg-muted/40"
          aria-expanded={showFullAnalysis}
        >
          <span className="font-medium">
            Full skills analysis
            {remainingGapsCount > 0 && !showFullAnalysis && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({remainingGapsCount} more gap{remainingGapsCount === 1 ? "" : "s"})
              </span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${showFullAnalysis ? "rotate-180" : ""}`}
          />
        </button>

        {showFullAnalysis && (
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <Tabs defaultValue="gaps">
              <TabsList>
                <TabsTrigger value="gaps">All gaps ({analysis.skillGaps.length})</TabsTrigger>
                <TabsTrigger value="matched">Matched ({matchedSkills.length})</TabsTrigger>
                <TabsTrigger value="partial">Partial ({partialSkills.length})</TabsTrigger>
                <TabsTrigger value="missing">Not covered ({missingSkills.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="gaps" className="mt-4 grid gap-3 sm:grid-cols-2">
                {analysis.skillGaps.map((g) => (
                  <GapCard key={g.id} gap={g} evidenceQuote={evidenceQuoteFor(g.skillName)} />
                ))}
              </TabsContent>

              <TabsContent value="matched" className="mt-4 flex flex-wrap gap-2">
                {matchedSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No strongly matched skills yet.</p>
                )}
                {matchedSkills.map((m) => (
                  <Badge key={m.canonicalName} className="bg-matched/15 text-matched hover:bg-matched/15">
                    {m.canonicalName}
                  </Badge>
                ))}
              </TabsContent>

              <TabsContent value="partial" className="mt-4 flex flex-wrap gap-2">
                {partialSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No partially matched skills.</p>
                )}
                {partialSkills.map((m) => (
                  <Badge key={m.canonicalName} variant="outline" className="border-partial/50 text-partial-foreground/90">
                    {m.canonicalName}
                  </Badge>
                ))}
              </TabsContent>

              <TabsContent value="missing" className="mt-4 flex flex-wrap gap-2">
                {missingSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nothing missing outside the gaps above.</p>
                )}
                {missingSkills.map((m) => (
                  <Badge key={m.canonicalName} variant="outline" className="border-critical/40 text-critical">
                    {m.canonicalName}
                  </Badge>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="flex flex-col items-center gap-2 border-t border-border pt-8">
        {analysis.status === "ROADMAP_READY" ? (
          <Button size="lg" className="gap-2 shadow-lg shadow-primary/20" asChild>
            <Link href={`/dashboard/analysis/${id}/roadmap`}>
              <MapIcon className="h-4 w-4" /> View My 4-Week Plan
            </Link>
          </Button>
        ) : (
          <Button
            size="lg"
            className="gap-2 bg-ai text-ai-foreground shadow-lg shadow-ai/20 hover:bg-ai/90"
            onClick={buildRoadmap}
            disabled={buildingRoadmap}
          >
            {buildingRoadmap ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Build My 4-Week Plan
          </Button>
        )}
        <p className="text-xs text-muted-foreground">Turns your gaps into a week-by-week action plan.</p>
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
    <div className="rounded-xl bg-muted/40 p-3.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">
        {matched}/{total}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{Math.round(coverage * 100)}% covered</p>
    </div>
  );
}

