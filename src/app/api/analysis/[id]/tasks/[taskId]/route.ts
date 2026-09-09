import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { updateTaskSchema } from "@/lib/validation/analysis";
import { EntitlementError, assertFeature } from "@/lib/billing/entitlements";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string; taskId: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, taskId } = await ctx.params;
  const { user, analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await assertFeature(user, "progressTracking");
  } catch (error) {
    if (error instanceof EntitlementError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    throw error;
  }

  const task = await prisma.roadmapTask.findFirst({
    where: { id: taskId, roadmapWeek: { roadmap: { analysisId: id } } },
  });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.roadmapTask.update({
    where: { id: taskId },
    data: {
      ...parsed.data,
      completedAt: parsed.data.status === "COMPLETE" ? new Date() : parsed.data.status ? null : undefined,
    },
  });

  return NextResponse.json({ task: updated });
}
