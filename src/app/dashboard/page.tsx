import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, FileSearch, Sparkles } from "lucide-react";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { prisma } from "@/lib/db/prisma";
import { getRoleTemplate } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/status-badge";

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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Welcome, {firstName}.</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Create your first skill-gap analysis to see your readiness score and a roadmap tailored to
          the job you want.
        </p>
        <Button className="mt-6 gap-2" asChild>
          <Link href="/dashboard/analysis/new">
            Create New Analysis <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
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
              <p className="mt-1 text-3xl font-bold tabular-nums">
                {latest.readinessScore !== null ? `${latest.readinessScore}%` : "—"}
                <span className="ml-2 text-sm font-normal text-muted-foreground">ready</span>
              </p>
            </div>
            <StatusBadge status={latest.status} />
          </CardHeader>
          <CardContent>
            {latest.readinessScore !== null && (
              <Progress value={latest.readinessScore} className="h-2.5" />
            )}

            {latest.skillGaps.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium">Top priority gaps</p>
                <div className="flex flex-wrap gap-2">
                  {latest.skillGaps.map((g) => (
                    <Badge key={g.id} variant="secondary" className="font-normal">
                      {g.skillName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {roadmapTasks.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Roadmap progress</span>
                  <span className="text-muted-foreground">
                    {completedTasks}/{roadmapTasks.length} tasks
                  </span>
                </div>
                <Progress value={progressPct} className="h-2" />
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
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
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm hover:bg-muted"
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
