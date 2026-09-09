import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { SKILL_QUIZZES } from "@/lib/quizzes/catalog";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateCurrentUser();
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    quizzes: SKILL_QUIZZES.map((quiz) => ({
      skill: quiz.skill,
      title: quiz.title,
      shortTitle: quiz.shortTitle,
      description: quiz.description,
      questionCount: quiz.questions.length,
    })),
    attempts,
  });
}
