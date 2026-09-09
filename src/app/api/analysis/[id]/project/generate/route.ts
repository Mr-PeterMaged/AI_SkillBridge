import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { getRoleTemplate } from "@/lib/roles";
import { generateStructuredJSON } from "@/lib/ai/gemini";
import { buildProjectGenerationPrompt, PROJECT_RESPONSE_SCHEMA } from "@/lib/ai/prompts";
import { projectGenerationResultSchema } from "@/lib/ai/schemas";
import { computeSkillCoverage } from "@/lib/scoring/project-coverage";
import { generateProjectSchema } from "@/lib/validation/project";
import { WEEKLY_HOURS_NUMBER } from "@/lib/validation/analysis";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`generate-project:${userId}`, 8, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many project generations. Please try again later." }, { status: 429 });
  }

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (analysis.status !== "SCORED" && analysis.status !== "ROADMAP_READY") {
    return NextResponse.json({ error: "Confirm your skills before building a project." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = generateProjectSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const role = getRoleTemplate(analysis.targetRole);
  const [gaps, candidateSkills, previousAiProjects] = await Promise.all([
    prisma.skillGap.findMany({ where: { analysisId: id }, orderBy: { priority: "asc" } }),
    prisma.candidateSkill.findMany({ where: { analysisId: id } }),
    prisma.projectRecommendation.findMany({ where: { analysisId: id, source: "AI_GENERATED" } }),
  ]);

  try {
    const prompt = buildProjectGenerationPrompt({
      role,
      experienceLevel: analysis.experienceLevel,
      weeklyHours: WEEKLY_HOURS_NUMBER[analysis.weeklyHours],
      priorityGaps: gaps.map((g) => ({ skill: g.skillName, priority: g.priority.toLowerCase() })),
      matchedSkills: candidateSkills.map((s) => s.canonicalName),
      projectType: parsed.data.projectType === "default" ? undefined : parsed.data.projectType,
      avoidTitles: previousAiProjects.map((p) => p.title),
    });

    const raw = await generateStructuredJSON({ prompt, responseSchema: PROJECT_RESPONSE_SCHEMA, temperature: 0.6 });
    const result = projectGenerationResultSchema.parse(raw);

    const { coverage, gapsCoveredCount, totalGaps } = computeSkillCoverage({
      role,
      requiredSkills: result.requiredSkills,
      openGapNames: gaps.map((g) => g.skillName),
    });

    // Regenerating replaces the current AI-generated suggestion — we keep at
    // most one "active" AI project per analysis, not an ever-growing list.
    await prisma.projectRecommendation.deleteMany({ where: { analysisId: id, source: "AI_GENERATED" } });

    const project = await prisma.projectRecommendation.create({
      data: {
        analysisId: id,
        source: "AI_GENERATED",
        title: result.title,
        description: result.description,
        requiredSkills: result.requiredSkills,
        deliverables: result.deliverables,
        githubChecklist: result.deploymentChecklist,
        valueProposition: result.valueProposition,
        difficulty: result.difficulty,
        estimatedHours: Math.round(result.estimatedHours),
        userStories: result.userStories,
        suggestedStack: result.suggestedStack,
        featureChecklist: result.featureChecklist,
        buildPlan: result.buildPlan,
        readmeTemplate: result.readmeOutline,
        deploymentChecklist: result.deploymentChecklist,
        skillCoverage: coverage,
      },
    });

    return NextResponse.json({ project, gapsCoveredCount, totalGaps });
  } catch (err) {
    console.error("Project generation failed", err instanceof Error ? err.message : err);
    const message =
      err instanceof Error && err.message.includes("GEMINI_API_KEY")
        ? err.message
        : "We couldn't build a project recommendation right now. Please try again in a moment.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
