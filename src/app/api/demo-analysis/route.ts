import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOrCreateCurrentUser } from "@/lib/db/users";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateCurrentUser();
  const analysis = await prisma.analysis.create({
    data: {
      userId: user.id,
      targetRole: "JUNIOR_FRONTEND_DEVELOPER",
      experienceLevel: "STUDENT",
      weeklyHours: "H8",
      status: "ROADMAP_READY",
      cvText: "[Sample Data] Synthetic student profile for demo mode.",
      jobDescriptionText: "[Sample Data] Junior Frontend Developer role requiring React, TypeScript, REST APIs, testing, deployment, and accessibility.",
      readinessScore: 74,
      scoreBreakdown: {
        criticalCoverage: 0.75,
        importantCoverage: 0.6,
        evidenceCoverage: 0.85,
        criticalTotal: 4,
        criticalMatched: 3,
        importantTotal: 5,
        importantMatched: 3,
      },
      candidateSummary:
        "Sample Data: This synthetic student has HTML, CSS, JavaScript, React, and Git foundations, with portfolio evidence added for a small TypeScript project.",
      jobSummary:
        "Sample Data: The target job expects React fundamentals plus TypeScript, REST API integration, testing, deployment, and accessible UI practices.",
      candidateSkills: {
        create: [
          skill("HTML", "TECHNICAL", "PROVEN"),
          skill("CSS", "TECHNICAL", "PROVEN"),
          skill("JavaScript", "TECHNICAL", "PROVEN"),
          skill("React", "TECHNICAL", "PRACTICED"),
          skill("Git", "TOOL", "PRACTICED"),
          skill("TypeScript", "TECHNICAL", "PROVEN", ["Sample portfolio project uses typed components and API response models."]),
          skill("REST APIs", "TECHNICAL", "PRACTICED", ["Sample project fetches and renders remote job data."]),
        ],
      },
      jobRequirements: {
        create: [
          requirement("HTML", "TECHNICAL", "IMPORTANT", ["Build semantic user interfaces."]),
          requirement("CSS", "TECHNICAL", "IMPORTANT", ["Implement responsive layouts."]),
          requirement("JavaScript", "TECHNICAL", "CRITICAL", ["Strong JavaScript fundamentals required."]),
          requirement("React", "TECHNICAL", "CRITICAL", ["Experience building React components."]),
          requirement("Git", "TOOL", "IMPORTANT", ["Use Git and GitHub in a team workflow."]),
          requirement("TypeScript", "TECHNICAL", "CRITICAL", ["TypeScript experience required."]),
          requirement("REST APIs", "TECHNICAL", "CRITICAL", ["Integrate REST APIs and handle loading states."]),
          requirement("Testing", "TECHNICAL", "IMPORTANT", ["Write tests for critical UI behavior."]),
          requirement("Deployment", "TOOL", "IMPORTANT", ["Deploy frontend applications."]),
          requirement("Accessibility", "TECHNICAL", "IMPORTANT", ["Build accessible, keyboard-friendly UI."]),
        ],
      },
      skillGaps: {
        create: [
          gap("Testing", "IMPORTANT", "The job asks for tested UI behavior, but the sample profile has not shown tests yet."),
          gap("Deployment", "IMPORTANT", "The sample profile has limited deployment proof beyond a portfolio site."),
          gap("Accessibility", "IMPORTANT", "The role expects accessible UI practices that need stronger evidence."),
        ],
      },
      readinessSnapshots: {
        create: [
          {
            kind: "BASELINE",
            readinessScore: 62,
            scoreBreakdown: {
              criticalCoverage: 0.6,
              importantCoverage: 0.45,
              evidenceCoverage: 0.5,
              criticalTotal: 4,
              criticalMatched: 2,
              importantTotal: 5,
              importantMatched: 2,
            },
          },
          {
            kind: "REASSESSMENT",
            readinessScore: 74,
            scoreBreakdown: {
              criticalCoverage: 0.75,
              importantCoverage: 0.6,
              evidenceCoverage: 0.85,
              criticalTotal: 4,
              criticalMatched: 3,
              importantTotal: 5,
              importantMatched: 3,
            },
          },
        ],
      },
      projectRecommendations: {
        create: {
          source: "AI_GENERATED",
          title: "Job Application Tracker",
          valueProposition: "Track job opportunities, preparation tasks, and application status in one polished dashboard.",
          difficulty: "intermediate",
          estimatedHours: 16,
          description:
            "Sample Data: A portfolio project that demonstrates TypeScript, React state, REST-style data flows, loading and empty states, deployment, and accessible forms.",
          requiredSkills: ["TypeScript", "React", "REST APIs", "Testing", "Deployment", "Accessibility"],
          userStories: [
            "As a student, I want to save target jobs so that I can prepare intentionally.",
            "As a student, I want to filter applications by status so that I know what needs attention.",
            "As a reviewer, I want a clear README and live demo so that I can inspect the project quickly.",
          ],
          suggestedStack: ["Next.js", "TypeScript", "React", "Prisma", "Vercel"],
          featureChecklist: [
            "Typed application form",
            "Status filters",
            "Loading, empty, and error states",
            "Accessible labels and keyboard focus",
            "Basic component tests",
            "Live deployment",
          ],
          buildPlan: [
            { day: 1, focus: "Scope and models", tasks: ["Define data model", "Sketch main states"] },
            { day: 2, focus: "Typed UI", tasks: ["Build form", "Add TypeScript types"] },
            { day: 3, focus: "API flow", tasks: ["Create API route", "Handle validation errors"] },
            { day: 4, focus: "Dashboard", tasks: ["Render list", "Add filters"] },
            { day: 5, focus: "Quality", tasks: ["Add tests", "Check empty states"] },
            { day: 6, focus: "Accessibility", tasks: ["Audit labels", "Test keyboard flow"] },
            { day: 7, focus: "Ship", tasks: ["Deploy", "Polish README"] },
          ],
          deliverables: ["GitHub repository", "Clear README", "Live demo", "Screenshots", "Tests where relevant"],
          readmeTemplate:
            "# Job Application Tracker\n\nProblem: Students need a focused place to track roles and preparation.\n\nStack: Next.js, TypeScript, React, Prisma.\n\nRun locally: npm install && npm run dev.\n\nLive demo: add your deployed URL here.\n\nScreenshots: add dashboard and form screenshots.",
          githubChecklist: ["Public repo", "README", "Screenshots", "Live demo link"],
          deploymentChecklist: ["Set environment variables", "Run build", "Deploy to Vercel", "Add live URL to README"],
          skillCoverage: [
            { skill: "TypeScript", isGapCovered: true, howCovered: "Typed components and API models." },
            { skill: "REST APIs", isGapCovered: true, howCovered: "Create and consume JSON API routes." },
            { skill: "Testing", isGapCovered: true, howCovered: "Tests for filtering and form validation." },
            { skill: "Deployment", isGapCovered: true, howCovered: "Vercel production deployment." },
            { skill: "Accessibility", isGapCovered: true, howCovered: "Semantic forms and keyboard support." },
          ],
        },
      },
      roadmap: {
        create: {
          durationWeeks: 4,
          weeks: {
            create: [1, 2, 3, 4].map((weekNumber) => ({
              weekNumber,
              focus: ["TypeScript Foundations", "REST API Integration", "Testing and Accessibility", "Deployment and Evidence"][weekNumber - 1],
              learningObjective:
                ["Type a small React feature end-to-end.", "Load and render remote data with safe states.", "Add tests and keyboard-friendly UI.", "Deploy and document the finished project."][weekNumber - 1],
              estimatedHours: 8,
              resources: [],
              tasks: {
                create: [
                  {
                    title: ["Create typed models", "Build API data view", "Write validation tests", "Deploy live demo"][weekNumber - 1],
                    description: "Sample Data roadmap task.",
                    status: weekNumber === 1 ? "COMPLETE" : "PENDING",
                    completedAt: weekNumber === 1 ? new Date() : null,
                  },
                  {
                    title: ["Convert React state", "Handle loading and errors", "Audit keyboard flow", "Polish README"][weekNumber - 1],
                    description: "Sample Data roadmap task.",
                  },
                ],
              },
            })),
          },
        },
      },
      evidenceItems: {
        create: {
          type: "GITHUB",
          url: "https://github.com/sample/skillbridge-job-tracker",
          reflectionBuilt: "Sample Data: Built a TypeScript job application tracker with REST-style data flows.",
          reflectionLearned: "Sample Data: Practiced typed API models, loading states, and portfolio documentation.",
          provesSkills: ["TypeScript", "REST APIs"],
        },
      },
    },
  });

  return NextResponse.json({ id: analysis.id });
}

function skill(
  canonicalName: string,
  category: "TECHNICAL" | "TOOL" | "SOFT",
  mastery: "FAMILIAR" | "PRACTICED" | "PROVEN",
  evidence = [`Sample Data: ${canonicalName} appears in the synthetic profile.`]
) {
  return {
    name: canonicalName,
    canonicalName,
    category,
    confidence: mastery === "PROVEN" ? 0.9 : 0.75,
    status: "MATCHED" as const,
    mastery,
    evidence,
    userConfirmed: true,
  };
}

function requirement(
  canonicalName: string,
  category: "TECHNICAL" | "TOOL" | "SOFT",
  priority: "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE",
  evidence: string[]
) {
  return { name: canonicalName, canonicalName, category, priority, evidence };
}

function gap(skillName: string, priority: "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE", reason: string) {
  return {
    skillName,
    canonicalName: skillName,
    priority,
    reason,
    suggestedProof: `Build a small portfolio feature that visibly uses ${skillName}.`,
    estimatedHours: 4,
  };
}
