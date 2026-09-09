import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { getRoleTemplate } from "@/lib/roles";
import { generateStructuredJSON } from "@/lib/ai/gemini";
import { buildRoadmapPrompt, ROADMAP_RESPONSE_SCHEMA } from "@/lib/ai/prompts";
import { roadmapGenerationResultSchema } from "@/lib/ai/schemas";
import { WEEKLY_HOURS_NUMBER } from "@/lib/validation/analysis";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`roadmap:${userId}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (analysis.status !== "SCORED" && analysis.status !== "ROADMAP_READY") {
    return NextResponse.json({ error: "Confirm your skills before generating a roadmap." }, { status: 400 });
  }

  const role = getRoleTemplate(analysis.targetRole);
  const [gaps, candidateSkills] = await Promise.all([
    prisma.skillGap.findMany({ where: { analysisId: id }, orderBy: { priority: "asc" } }),
    prisma.candidateSkill.findMany({ where: { analysisId: id } }),
  ]);

  try {
    const prompt = buildRoadmapPrompt({
      role,
      experienceLevel: analysis.experienceLevel,
      weeklyHours: WEEKLY_HOURS_NUMBER[analysis.weeklyHours],
      priorityGaps: gaps.map((g) => ({ skill: g.skillName, priority: g.priority.toLowerCase(), reason: g.reason })),
      matchedSkills: candidateSkills.map((s) => s.canonicalName),
    });

    const raw = await generateStructuredJSON({ prompt, responseSchema: ROADMAP_RESPONSE_SCHEMA, temperature: 0.4 });
    const result = roadmapGenerationResultSchema.parse(raw);

    await prisma.roadmap.deleteMany({ where: { analysisId: id } });

    const roadmap = await prisma.roadmap.create({
      data: {
        analysisId: id,
        durationWeeks: result.weeks.length,
        weeks: {
          create: result.weeks.map((week) => ({
            weekNumber: week.weekNumber,
            focus: week.focus,
            learningObjective: week.learningObjective,
            estimatedHours: Math.round(week.estimatedHours),
            resources: week.resources,
            tasks: {
              create: [
                ...week.tasks.map((t) => ({ title: t.title, description: t.description })),
                { title: `Deliverable: ${week.deliverable}`, description: week.deliverable },
                { title: `Publish evidence: ${week.evidenceToPublish}`, description: week.evidenceToPublish },
              ],
            },
          })),
        },
      },
      include: { weeks: { include: { tasks: true }, orderBy: { weekNumber: "asc" } } },
    });

    await prisma.analysis.update({ where: { id }, data: { status: "ROADMAP_READY" } });

    return NextResponse.json({ roadmap });
  } catch (err) {
    console.error("Roadmap generation failed", err instanceof Error ? err.message : err);
    const message =
      err instanceof Error && err.message.includes("GEMINI_API_KEY")
        ? err.message
        : "We couldn't build your roadmap right now. Please try again in a moment.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
