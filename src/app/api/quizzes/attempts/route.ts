import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedAnalysis } from "@/lib/db/analysis";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { getSkillQuiz, quizStatus } from "@/lib/quizzes/catalog";
import { submitQuizAttemptSchema } from "@/lib/validation/quiz";
import { normalizeSkillName } from "@/lib/scoring/matching";
import { getRoleTemplate } from "@/lib/roles";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = submitQuizAttemptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const quiz = getSkillQuiz(parsed.data.skill);
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const user = await getOrCreateCurrentUser();
  const analysisId: string | null = parsed.data.analysisId ?? null;
  let targetRole = null;

  if (analysisId) {
    const { analysis } = await getOwnedAnalysis(analysisId);
    if (!analysis) return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    targetRole = analysis.targetRole;
  }

  const latestAttempt = await prisma.quizAttempt.findFirst({
    where: { userId: user.id, skill: parsed.data.skill },
    orderBy: { createdAt: "desc" },
  });
  if (latestAttempt && Date.now() - latestAttempt.createdAt.getTime() < 12 * 60 * 60 * 1000) {
    return NextResponse.json(
      { error: "Give yourself a little review time before retrying this quiz." },
      { status: 429 }
    );
  }

  const answers = parsed.data.answers.map((answer) => {
    const question = quiz.questions.find((q) => q.id === answer.questionId);
    return {
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
      correct: Boolean(question && question.correctOptionId === answer.selectedOptionId),
    };
  });
  const score = answers.filter((answer) => answer.correct).length;
  const status = quizStatus(score, quiz.questions.length);

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      analysisId,
      skill: parsed.data.skill,
      score,
      total: quiz.questions.length,
      status,
      answers,
    },
  });

  if (analysisId && status !== "LEARNING" && targetRole) {
    const role = getRoleTemplate(targetRole);
    const canonicalName = normalizeSkillName(role, quiz.shortTitle);
    const roleSkill = role.skills.find((skill) => skill.canonicalName.toLowerCase() === canonicalName.toLowerCase());
    const existing = await prisma.candidateSkill.findFirst({
      where: { analysisId, canonicalName: { equals: canonicalName, mode: "insensitive" } },
    });
    const evidenceNote = `${quiz.title} quiz completed with ${score}/${quiz.questions.length}. This result helps personalize the next learning task.`;

    if (existing) {
      const evidence = Array.isArray(existing.evidence) ? (existing.evidence as string[]) : [];
      await prisma.candidateSkill.update({
        where: { id: existing.id },
        data: {
          confidence: Math.max(existing.confidence, status === "STRONG_QUIZ_RESULT" ? 0.75 : 0.65),
          evidence: [...evidence, evidenceNote].slice(-5),
          mastery: status === "STRONG_QUIZ_RESULT" ? "PRACTICED" : existing.mastery,
          userConfirmed: true,
        },
      });
    } else {
      await prisma.candidateSkill.create({
        data: {
          analysisId,
          name: canonicalName,
          canonicalName,
          category: (roleSkill?.category ?? "technical").toUpperCase() as "TECHNICAL" | "TOOL" | "SOFT",
          confidence: status === "STRONG_QUIZ_RESULT" ? 0.75 : 0.65,
          evidence: [evidenceNote],
          mastery: status === "STRONG_QUIZ_RESULT" ? "PRACTICED" : "FAMILIAR",
          status: "USER_ADDED",
          userConfirmed: true,
        },
      });
    }
  }

  return NextResponse.json({
    attempt,
    result: {
      score,
      total: quiz.questions.length,
      status,
      explanations: quiz.questions.map((question) => ({
        questionId: question.id,
        correctOptionId: question.correctOptionId,
        explanation: question.explanation,
      })),
      message: "This result helps personalize your next learning task.",
    },
  });
}
