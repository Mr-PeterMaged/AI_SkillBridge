import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { createCheckInSchema } from "@/lib/validation/check-in";
import { generateStructuredJSON } from "@/lib/ai/gemini";
import { buildWeeklyCheckInPrompt, WEEKLY_CHECK_IN_RESPONSE_SCHEMA } from "@/lib/ai/prompts";
import { weeklyCheckInResultSchema } from "@/lib/ai/schemas";
import { getRoleTemplate } from "@/lib/roles";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { analysisId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ checkIns });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`check-in:${userId}`, 20, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many check-ins. Please try again later." }, { status: 429 });

  const { id } = await ctx.params;
  const { user, analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = createCheckInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  let task = null;
  if (parsed.data.roadmapTaskId) {
    task = await prisma.roadmapTask.findFirst({
      where: { id: parsed.data.roadmapTaskId, roadmapWeek: { roadmap: { analysisId: id } } },
    });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  } else {
    const activeTasks = await prisma.roadmapTask.findMany({
      where: { roadmapWeek: { roadmap: { analysisId: id } }, status: { not: "COMPLETE" } },
      include: { roadmapWeek: { select: { weekNumber: true } } },
    });
    task =
      activeTasks.sort(
        (a, b) => a.roadmapWeek.weekNumber - b.roadmapWeek.weekNumber || a.createdAt.getTime() - b.createdAt.getTime()
      )[0] ?? null;
  }

  if (!task) {
    return NextResponse.json({ error: "No active roadmap task is available for check-in." }, { status: 400 });
  }

  let guidance = {
    suggestion: fallbackSuggestion(parsed.data.response, task.title, parsed.data.blocker),
    adjustedTask: null as string | null,
  };

  try {
    const role = getRoleTemplate(analysis.targetRole);
    const raw = await generateStructuredJSON({
      prompt: buildWeeklyCheckInPrompt({
        targetRole: role.label,
        taskTitle: task.title,
        taskDescription: task.description,
        response: parsed.data.response,
        blocker: parsed.data.blocker,
        availableHours: parsed.data.availableHours,
      }),
      responseSchema: WEEKLY_CHECK_IN_RESPONSE_SCHEMA,
      temperature: 0.4,
    });
    guidance = weeklyCheckInResultSchema.parse(raw);
  } catch {
    // Keep check-ins useful even when the AI provider is temporarily unavailable.
  }

  const checkIn = await prisma.weeklyCheckIn.create({
    data: {
      userId: user.id,
      analysisId: id,
      roadmapTaskId: task.id,
      response: parsed.data.response,
      blocker: parsed.data.blocker ?? null,
      availableHours: parsed.data.availableHours ?? null,
      aiSuggestion: guidance.suggestion,
      adjustedTask: guidance.adjustedTask,
    },
  });

  if (parsed.data.response === "COMPLETED") {
    await prisma.roadmapTask.update({
      where: { id: task.id },
      data: { status: "COMPLETE", completedAt: new Date() },
    });
  } else if (parsed.data.response === "MADE_PROGRESS" && task.status === "PENDING") {
    await prisma.roadmapTask.update({
      where: { id: task.id },
      data: { status: "IN_PROGRESS" },
    });
  }

  return NextResponse.json({ checkIn });
}

function fallbackSuggestion(response: string, taskTitle: string, blocker?: string | null) {
  if (response === "COMPLETED") return `Nice progress. Add portfolio evidence for "${taskTitle}" so the work can be reviewed later.`;
  if (response === "MADE_PROGRESS") return `Keep the scope tight: finish one visible part of "${taskTitle}" and publish a small proof update.`;
  if (response === "GOT_STUCK") {
    return `Shrink "${taskTitle}" to one 30-minute action: reproduce the blocker, write down what failed, then fix the smallest next step.${blocker ? ` Blocker noted: ${blocker}` : ""}`;
  }
  return `Restart with a small version of "${taskTitle}" today: open the project, create one file or note, and stop after a concrete first commit.`;
}
