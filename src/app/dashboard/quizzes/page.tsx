import { QuizRunner } from "@/components/quizzes/quiz-runner";
import { SKILL_QUIZZES } from "@/lib/quizzes/catalog";

export default async function QuizzesPage({
  searchParams,
}: {
  searchParams: Promise<{ analysisId?: string }>;
}) {
  const { analysisId } = await searchParams;

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Skill verification quizzes</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Short, supportive checks for student-level fundamentals. Quiz results can modestly improve confidence
          signals, but real portfolio evidence remains the stronger proof.
        </p>
      </div>
      <QuizRunner quizzes={SKILL_QUIZZES} analysisId={analysisId} />
    </div>
  );
}
