import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { getRoleTemplate } from "@/lib/roles";
import { generateStructuredJSON } from "@/lib/ai/gemini";
import { buildExtractionPrompt, EXTRACTION_RESPONSE_SCHEMA } from "@/lib/ai/prompts";
import { skillExtractionResultSchema } from "@/lib/ai/schemas";
import { normalizeSkillName } from "@/lib/scoring/matching";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`extract:${userId}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many analysis requests. Please slow down and try again shortly." }, { status: 429 });
  }

  const { id } = await ctx.params;
  const { analysis } = await getOwnedAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!analysis.cvText || !analysis.jobDescriptionText) {
    return NextResponse.json({ error: "This analysis is missing CV or job description text." }, { status: 400 });
  }

  const role = getRoleTemplate(analysis.targetRole);

  try {
    await prisma.analysis.update({ where: { id }, data: { status: "EXTRACTING" } });

    const prompt = buildExtractionPrompt({
      role,
      cvText: analysis.cvText,
      jobDescriptionText: analysis.jobDescriptionText,
    });

    const raw = await generateStructuredJSON({ prompt, responseSchema: EXTRACTION_RESPONSE_SCHEMA, temperature: 0.15 });
    const result = skillExtractionResultSchema.parse(raw);

    // Normalize canonical names against the role taxonomy (pure code, not the LLM's call).
    const candidateSkills = result.candidateSkills.map((s) => ({
      ...s,
      canonicalName: normalizeSkillName(role, s.canonicalName || s.name),
    }));
    const jobRequirements = result.jobRequirements.map((r) => ({
      ...r,
      canonicalName: normalizeSkillName(role, r.canonicalName || r.name),
    }));

    await prisma.$transaction([
      prisma.candidateSkill.deleteMany({ where: { analysisId: id } }),
      prisma.jobRequirement.deleteMany({ where: { analysisId: id } }),
      prisma.candidateSkill.createMany({
        data: candidateSkills.map((s) => ({
          analysisId: id,
          name: s.name,
          canonicalName: s.canonicalName,
          category: s.category.toUpperCase() as "TECHNICAL" | "TOOL" | "SOFT",
          confidence: s.confidence,
          evidence: s.evidence,
          status: "MATCHED",
          userConfirmed: false,
        })),
      }),
      prisma.jobRequirement.createMany({
        data: jobRequirements.map((r) => ({
          analysisId: id,
          name: r.name,
          canonicalName: r.canonicalName,
          category: r.category.toUpperCase() as "TECHNICAL" | "TOOL" | "SOFT",
          priority: r.priority.toUpperCase() as "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE",
          evidence: r.evidence,
        })),
      }),
      prisma.analysis.update({
        where: { id },
        data: {
          status: "AWAITING_REVIEW",
          candidateSummary: result.candidateSummary,
          jobSummary: result.jobSummary,
        },
      }),
    ]);

    const [savedSkills, savedRequirements] = await Promise.all([
      prisma.candidateSkill.findMany({ where: { analysisId: id } }),
      prisma.jobRequirement.findMany({ where: { analysisId: id } }),
    ]);

    return NextResponse.json({
      candidateSkills: savedSkills,
      jobRequirements: savedRequirements,
      candidateSummary: result.candidateSummary,
      jobSummary: result.jobSummary,
    });
  } catch (err) {
    await prisma.analysis.update({ where: { id }, data: { status: "FAILED" } }).catch(() => {});
    console.error("Extraction failed", err instanceof Error ? err.message : err);
    const message =
      err instanceof Error && err.message.includes("GEMINI_API_KEY")
        ? err.message
        : "We couldn't analyze your CV right now. Please try again in a moment.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
