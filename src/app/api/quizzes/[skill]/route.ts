import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSkillQuiz } from "@/lib/quizzes/catalog";
import { quizSkillSchema } from "@/lib/validation/quiz";

export async function GET(_req: Request, ctx: { params: Promise<{ skill: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { skill } = await ctx.params;
  const parsed = quizSkillSchema.safeParse(skill);
  if (!parsed.success) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const quiz = getSkillQuiz(parsed.data);
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  return NextResponse.json({
    quiz: {
      skill: quiz.skill,
      title: quiz.title,
      shortTitle: quiz.shortTitle,
      description: quiz.description,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        scenario: question.scenario,
        options: question.options,
        explanation: question.explanation,
      })),
    },
  });
}
