import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, FileSearch, Map, Sparkles, Target, TrendingUp } from "lucide-react";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { prisma } from "@/lib/db/prisma";
import { getRoleTemplate } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ScoreRing } from "@/components/analysis/score-ring";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  const user = await getOrCreateCurrentUser();

  const analyses = await prisma.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      skillGaps: { orderBy: { priority: "asc" }, take: 3 },
      roadmap: { include: { weeks: { include: { tasks: true } } } },
    },
  });

  const latest = analyses[0];
  const firstName = clerkUser?.firstName ?? "there";

  if (analyses.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-primary/[0.06] to-transparent p-10 text-center sm:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Welcome, {firstName}.</h1>
          <p className="mt-2 text-muted-foreground">
            Create your first skill-gap analysis to see your readiness score and a roadmap tailored to
            the job you want.
          </p>
          <Button className="mt-7 gap-2 shadow-lg shadow-primary/20" size="lg" asChild>
            <Link href="/dashboard/analysis/new">
              Create New Analysis <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <FeatureHint icon={Target} text="A readiness score tied to a real job description" />
          <FeatureHint icon={TrendingUp} text="Gaps ranked by what actually matters" />
          <FeatureHint icon={Map} text="A 4-week roadmap with proof, not just theory" />
        </div>
      </div>
    );
  }

  const roadmapTasks = latest.roadmap?.weeks.flatMap((w) => w.tasks) ?? [];
  const completedTasks = roadmapTasks.filter((t) => t.status === "COMPLETE").length;
  const progressPct = roadmapTasks.length ? Math.round((completedTasks / roadmapTasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {firstName}.</h1>
          <p className="text-sm text-muted-foreground">Here&apos;s where your latest analysis stands.</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/dashboard/analysis/new">
            <Sparkles className="h-4 w-4" /> New Analysis
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-medium text-muted-foreground">
                {getRoleTemplate(latest.targetRole).label}
              </CardTitle>
            </div>
            <StatusBadge status={latest.status} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {latest.readinessScore !== null ? (
                <ScoreRing score={latest.readinessScore} />
              ) : (
                <div className="flex h-[148px] w-[148px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border text-xs text-muted-foreground">
                  Not scored yet
                </div>
              )}

              <div className="flex-1 space-y-5">
                {latest.skillGaps.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Top priority gaps</p>
                    <div className="flex flex-wrap gap-2">
                      {latest.skillGaps.map((g) => (
                        <Badge
                          key={g.id}
                          className={
                            g.priority === "CRITICAL"
                              ? "bg-critical/15 text-critical hover:bg-critical/15"
                              : "bg-partial/20 text-partial-foreground hover:bg-partial/20"
                          }
                        >
                          {g.skillName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {roadmapTasks.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">Roadmap progress</span>
                      <span className="text-muted-foreground">
                        {completedTasks}/{roadmapTasks.length} tasks
                      </span>
                    </div>
                    <Progress
                      value={progressPct}
                      className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-ai"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-1">
                  {latest.status === "DRAFT" || latest.status === "EXTRACTING" ? (
                    <Button asChild>
                      <Link href={`/dashboard/analysis/${latest.id}/review`}>Continue analysis</Link>
                    </Button>
                  ) : latest.status === "AWAITING_REVIEW" ? (
                    <Button asChild>
                      <Link href={`/dashboard/analysis/${latest.id}/review`}>Review extracted skills</Link>
                    </Button>
                  ) : latest.status === "SCORED" ? (
                    <Button asChild>
                      <Link href={`/dashboard/analysis/${latest.id}/results`}>View results</Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href={`/dashboard/analysis/${latest.id}/roadmap`}>Continue My Roadmap</Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/analysis/${latest.id}/results`}>View full results</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent analyses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {analyses.map((a) => (
              <Link
                key={a.id}
                href={
                  a.status === "SCORED" || a.status === "ROADMAP_READY"
                    ? `/dashboard/analysis/${a.id}/results`
                    : `/dashboard/analysis/${a.id}/review`
                }
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2 truncate">
                  <FileSearch className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{getRoleTemplate(a.targetRole).shortLabel}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {a.readinessScore !== null ? `${a.readinessScore}%` : "In progress"}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureHint({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
