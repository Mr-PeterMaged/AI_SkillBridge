"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SkillQuizDefinition } from "@/lib/quizzes/catalog";

type AttemptResult = {
  score: number;
  total: number;
  status: "LEARNING" | "QUIZ_COMPLETED" | "STRONG_QUIZ_RESULT";
  explanations: Array<{ questionId: string; correctOptionId: string; explanation: string }>;
  message: string;
};

const STATUS_LABEL = {
  LEARNING: "Learning",
  QUIZ_COMPLETED: "Quiz completed",
  STRONG_QUIZ_RESULT: "Strong quiz result",
};

export function QuizRunner({ quizzes, analysisId }: { quizzes: SkillQuizDefinition[]; analysisId?: string }) {
  const [activeSkill, setActiveSkill] = useState(quizzes[0]?.skill);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);

  const quiz = useMemo(() => quizzes.find((item) => item.skill === activeSkill) ?? quizzes[0], [activeSkill, quizzes]);
  const question = quiz.questions[index];
  const selected = answers[question.id];
  const progress = Math.round(((index + 1) / quiz.questions.length) * 100);

  function selectQuiz(skill: typeof activeSkill) {
    setActiveSkill(skill);
    setIndex(0);
    setAnswers({});
    setResult(null);
  }

  function choose(optionId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/quizzes/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysisId ?? null,
          skill: quiz.skill,
          answers: quiz.questions.map((item) => ({
            questionId: item.id,
            selectedOptionId: answers[item.id],
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't submit this quiz.");
        return;
      }
      setResult(data.result);
      toast.success("Quiz completed.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!quiz) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-2">
        {quizzes.map((item) => (
          <button
            key={item.skill}
            type="button"
            onClick={() => selectQuiz(item.skill)}
            className={`w-full rounded-xl border p-3 text-left transition-colors ${
              activeSkill === item.skill ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <span className="block text-sm font-medium">{item.title}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>
          </button>
        ))}
      </aside>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge variant="secondary" className="mb-2 font-normal">5-8 minutes</Badge>
            <h1 className="text-2xl font-semibold">{quiz.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This helps personalize your next learning task. It is not a certification.
            </p>
          </div>
          <span className="text-sm text-muted-foreground">{index + 1}/{quiz.questions.length}</span>
        </div>

        <Progress value={progress} className="mt-5 h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-ai" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${quiz.skill}-${question.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="mt-6"
          >
            {question.scenario && (
              <div className="mb-4 rounded-xl border border-ai/20 bg-ai/[0.04] p-3 text-sm text-muted-foreground">
                {question.scenario}
              </div>
            )}
            <h2 className="text-lg font-semibold">{question.prompt}</h2>
            <div className="mt-4 grid gap-2">
              {question.options.map((option) => {
                const isSelected = selected === option.id;
                const explanation = result?.explanations.find((item) => item.questionId === question.id);
                const isCorrect = explanation?.correctOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => !result && choose(option.id)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      result
                        ? isCorrect
                          ? "border-matched bg-matched/10 text-matched"
                          : isSelected
                            ? "border-critical bg-critical/10 text-critical"
                            : "border-border"
                        : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/40"
                    }`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
            {result && (
              <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                {result.explanations.find((item) => item.questionId === question.id)?.explanation}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {result ? (
          <div className="mt-6 rounded-2xl border border-matched/25 bg-matched/[0.04] p-4">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-matched" />
              {STATUS_LABEL[result.status]}: {result.score}/{result.total}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIndex((value) => Math.max(value - 1, 0))}
            disabled={index === 0}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {index < quiz.questions.length - 1 ? (
            <Button
              type="button"
              onClick={() => setIndex((value) => Math.min(value + 1, quiz.questions.length - 1))}
              disabled={!selected}
              className="gap-1.5"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submit}
              disabled={submitting || quiz.questions.some((item) => !answers[item.id]) || Boolean(result)}
              className="gap-1.5"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Submit quiz
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
