import { z } from "zod";

export const quizSkillSchema = z.enum([
  "REACT_FUNDAMENTALS",
  "TYPESCRIPT_FUNDAMENTALS",
  "REST_API_FUNDAMENTALS",
  "GIT_FUNDAMENTALS",
  "SQL_FUNDAMENTALS",
  "PYTHON_FUNDAMENTALS",
  "DATA_VISUALIZATION_FUNDAMENTALS",
]);

export const submitQuizAttemptSchema = z.object({
  analysisId: z.string().min(1).max(80).nullable().optional(),
  skill: quizSkillSchema,
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1).max(80),
        selectedOptionId: z.string().min(1).max(80),
      })
    )
    .min(5)
    .max(6),
});

export type SubmitQuizAttemptInput = z.infer<typeof submitQuizAttemptSchema>;
