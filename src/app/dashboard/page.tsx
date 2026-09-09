import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, BriefcaseBusiness, ClipboardCheck, FileCheck2, FileSearch, Map, Sparkles, Target, TrendingUp } from "lucide-react";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { prisma } from "@/lib/db/prisma";
import { getRoleTemplate } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ScoreRing } from "@/components/analysis/score-ring";
import { WeeklyCheckInCard } from "@/components/roadmap/weekly-check-in-card";

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
      evidenceItems: { orderBy: { createdAt: "desc" }, take: 3, include: { resumeBullets: true } },
      projectRecommendations: { orderBy: { createdAt: "desc" }, take: 1 },
      weeklyCheckIns: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  const applications = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
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
        <div className="mt-6 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/quizzes">Explore skill quizzes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const roadmapTasks = latest.roadmap?.weeks.flatMap((w) => w.tasks) ?? [];
  const completedTasks = roadmapTasks.filter((t) => t.status === "COMPLETE").length;
  const progressPct = roadmapTasks.length ? Math.round((completedTasks / roadmapTasks.length) * 100) : 0;
  const nextTask = roadmapTasks.find((task) => task.status !== "COMPLETE") ?? null;
  const nextTaskDto = nextTask
    ? {
        id: nextTask.id,
        title: nextTask.title,
        description: nextTask.description,
        status: nextTask.status,
        completedAt: nextTask.completedAt?.toISOString() ?? null,
        evidenceUrl: nextTask.evidenceUrl,
        evidenceType: nextTask.evidenceType,
        notes: nextTask.notes,
      }
    : null;
  const latestCheckInDto = latest.weeklyCheckIns[0]
    ? {
        id: latest.weeklyCheckIns[0].id,
        roadmapTaskId: latest.weeklyCheckIns[0].roadmapTaskId,
        response: latest.weeklyCheckIns[0].response,
        blocker: latest.weeklyCheckIns[0].blocker,
        availableHours: latest.weeklyCheckIns[0].availableHours,
        aiSuggestion: latest.weeklyCheckIns[0].aiSuggestion,
        adjustedTask: latest.weeklyCheckIns[0].adjustedTask,
        createdAt: latest.weeklyCheckIns[0].createdAt.toISOString(),
      }
    : null;

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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyCheckInCard
            analysisId={latest.id}
            task={nextTaskDto}
            latestCheckIn={latestCheckInDto}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" /> Next smallest action
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextTask ? (
              <>
                <p className="font-medium">{nextTask.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{nextTask.description}</p>
                <Button className="mt-4" size="sm" asChild>
                  <Link href={`/dashboard/analysis/${latest.id}/roadmap`}>Open roadmap</Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Generate or continue a roadmap to see your next action.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck2 className="h-4 w-4 text-matched" /> Recent evidence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latest.evidenceItems.length === 0 && (
              <p className="text-sm text-muted-foreground">Add proof from a roadmap task to build your portfolio trail.</p>
            )}
            {latest.evidenceItems.map((evidence) => (
              <div key={evidence.id} className="rounded-lg border border-border/70 p-3 text-sm">
                <p className="font-medium">{evidence.type.replaceAll("_", " ")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stringArray(evidence.provesSkills).length
                    ? stringArray(evidence.provesSkills).join(", ")
                    : "Reflection or link saved"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardCheck className="h-4 w-4 text-ai" /> Skill quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Short checks for React, TypeScript, REST APIs, Git, SQL, Python, and data visualization.
            </p>
            <Button className="mt-4" variant="outline" size="sm" asChild>
              <Link href="/dashboard/quizzes">Start a quiz</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BriefcaseBusiness className="h-4 w-4 text-primary" /> Application tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications.length === 0 && <p className="text-sm text-muted-foreground">Save target roles when you are preparing to apply.</p>}
            {applications.map((application) => (
              <div key={application.id} className="rounded-lg border border-border/70 p-3 text-sm">
                <p className="font-medium">{application.jobTitle}</p>
                <p className="text-xs text-muted-foreground">{application.company} - {application.status}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/applications">Open tracker</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function FeatureHint({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
