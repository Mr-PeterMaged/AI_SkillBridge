import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { EntitlementError, assertFeature } from "@/lib/billing/entitlements";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string; projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, projectId } = await ctx.params;
  const { user, analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await assertFeature(user, "projectBuilder");
  } catch (error) {
    if (error instanceof EntitlementError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    throw error;
  }

  const project = await prisma.projectRecommendation.findFirst({ where: { id: projectId, analysisId: id } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const roadmap = await prisma.roadmap.findUnique({
    where: { analysisId: id },
    include: { weeks: { orderBy: { weekNumber: "desc" }, take: 1 } },
  });
  if (!roadmap) {
    return NextResponse.json({ error: "Build your roadmap before adding a project week to it." }, { status: 400 });
  }
  if (project.addedToRoadmap) {
    return NextResponse.json({ error: "This project is already on your roadmap." }, { status: 400 });
  }

  const nextWeekNumber = (roadmap.weeks[0]?.weekNumber ?? 0) + 1;
  const featureChecklist = (project.featureChecklist as string[]) ?? [];

  const [, week] = await prisma.$transaction([
    prisma.projectRecommendation.update({ where: { id: projectId }, data: { addedToRoadmap: true } }),
    prisma.roadmapWeek.create({
      data: {
        roadmapId: roadmap.id,
        weekNumber: nextWeekNumber,
        focus: project.title,
        learningObjective: project.valueProposition ?? project.description,
        estimatedHours: project.estimatedHours ?? 8,
        resources: [],
        tasks: {
          create: featureChecklist.slice(0, 12).map((feature) => ({
            title: feature,
            description: `Portfolio project: ${project.title}`,
          })),
        },
      },
      include: { tasks: true },
    }),
  ]);

  await prisma.roadmap.update({ where: { id: roadmap.id }, data: { durationWeeks: nextWeekNumber } });

  return NextResponse.json({ week });
}
