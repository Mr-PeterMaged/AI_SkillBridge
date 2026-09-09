import { RoleTemplate } from "@/lib/roles/types";

// ---------------------------------------------------------------
// Gemini response schemas (Gemini's structured-output format is a
// constrained subset of OpenAPI/JSON Schema — not a Zod schema).
// Keep these in sync with src/lib/ai/schemas.ts (the Zod mirror
// used to validate whatever comes back).
// ---------------------------------------------------------------

const skillPropertiesForExtraction = {
  type: "OBJECT",
  properties: {
    name: { type: "STRING" },
    canonicalName: { type: "STRING" },
    category: { type: "STRING", enum: ["technical", "tool", "soft"] },
    evidence: { type: "ARRAY", items: { type: "STRING" } },
    confidence: { type: "NUMBER" },
  },
  required: ["name", "canonicalName", "category", "evidence", "confidence"],
};

const requirementPropertiesForExtraction = {
  type: "OBJECT",
  properties: {
    name: { type: "STRING" },
    canonicalName: { type: "STRING" },
    category: { type: "STRING", enum: ["technical", "tool", "soft"] },
    priority: { type: "STRING", enum: ["critical", "important", "nice_to_have"] },
    evidence: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["name", "canonicalName", "category", "priority", "evidence"],
};

export const EXTRACTION_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    candidateSkills: { type: "ARRAY", items: skillPropertiesForExtraction },
    jobRequirements: { type: "ARRAY", items: requirementPropertiesForExtraction },
    candidateSummary: { type: "STRING" },
    jobSummary: { type: "STRING" },
  },
  required: ["candidateSkills", "jobRequirements", "candidateSummary", "jobSummary"],
};

export function buildExtractionPrompt(params: {
  role: RoleTemplate;
  cvText: string;
  jobDescriptionText: string;
}): string {
  const knownSkills = params.role.skills.map((s) => s.canonicalName).join(", ");

  return `Analyze the candidate CV and target job description below for a "${params.role.label}" role.

TASK 1 — Extract candidate skills from the CV.
For each skill you find EXPLICIT evidence for in the CV text (a project, a listed skill, an experience bullet, an
education entry), return it with the exact quote(s) from the CV as evidence. Do not invent skills that are not
supported by the text. If a skill is only vaguely implied, lower its confidence score instead of omitting the
evidence field.

TASK 2 — Extract job requirements from the job description.
For each requirement mentioned in the JD, classify its priority:
- "critical": explicitly required / must-have language, or clearly foundational to the role.
- "important": mentioned as a strong plus or clearly implied as expected.
- "nice_to_have": mentioned as a bonus, plus, or optional.
Include the supporting quote(s) from the JD as evidence.

Use these canonical skill names whenever a matching skill is found (map synonyms to them), but you MAY return
other canonical names for real skills not in this list: ${knownSkills}.

Also write:
- candidateSummary: 2-3 sentence neutral summary of the candidate's current profile relevant to this role.
- jobSummary: 2-3 sentence neutral summary of what the role is asking for.

--- CV / PROFILE TEXT ---
${params.cvText}

--- JOB DESCRIPTION ---
${params.jobDescriptionText}
--- END ---

Respond with JSON only, matching the required schema exactly.`;
}

const roadmapTaskSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    description: { type: "STRING" },
  },
  required: ["title", "description"],
};

const roadmapWeekResponseSchema = {
  type: "OBJECT",
  properties: {
    weekNumber: { type: "INTEGER" },
    focus: { type: "STRING" },
    learningObjective: { type: "STRING" },
    estimatedHours: { type: "NUMBER" },
    tasks: { type: "ARRAY", items: roadmapTaskSchema },
    deliverable: { type: "STRING" },
    evidenceToPublish: { type: "STRING" },
    resources: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { title: { type: "STRING" }, url: { type: "STRING" } },
        required: ["title", "url"],
      },
    },
  },
  required: [
    "weekNumber",
    "focus",
    "learningObjective",
    "estimatedHours",
    "tasks",
    "deliverable",
    "evidenceToPublish",
    "resources",
  ],
};

export const ROADMAP_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    weeks: { type: "ARRAY", items: roadmapWeekResponseSchema },
  },
  required: ["weeks"],
};

export function buildRoadmapPrompt(params: {
  role: RoleTemplate;
  experienceLevel: string;
  weeklyHours: number;
  durationWeeks: number;
  priorityGaps: Array<{ skill: string; priority: string; reason: string }>;
  matchedSkills: string[];
}): string {
  const gapLines = params.priorityGaps
    .map((g, i) => `${i + 1}. [${g.priority.toUpperCase()}] ${g.skill} — ${g.reason}`)
    .join("\n");

  return `Build a personalized ${params.durationWeeks}-week learning roadmap for a "${params.role.label}" candidate.

Candidate context:
- Experience level: ${params.experienceLevel}
- Available study time: ~${params.weeklyHours} hours/week
- Already-demonstrated skills (do not re-teach these from scratch): ${params.matchedSkills.join(", ") || "none yet"}

Priority skill gaps to address, in order of importance (critical first):
${gapLines || "No critical gaps found — focus the roadmap on strengthening and proving existing skills."}

Rules:
- Based on the student's available time, this plan must be designed for exactly ${params.durationWeeks} weeks.
- Cover the HIGHEST priority gaps first; do not spend a full week on a nice_to_have gap if critical gaps remain.
- Respect the candidate's weekly time budget — do not assign more hours than they have available.
- Each week must have ONE clear focus skill (or tightly related pair), 2-4 concrete micro-tasks, exactly one
  deliverable, and one piece of evidence to publish (GitHub commit, deployed link, screenshot, etc).
- Tasks must be concrete and actionable ("Build X", "Write Y tests for Z"), never vague ("Learn about X").
- Suggest 1-3 real, well-known, freely accessible learning resources per week (official docs, MDN, freeCodeCamp,
  Kaggle Learn, web.dev, etc). Use real URLs you are confident exist; if unsure of an exact URL, link to the
  resource's known homepage instead of guessing a deep link.
- Never suggest fabricating experience — only building and documenting real, verifiable work.

Respond with JSON only, matching the required schema exactly. Produce exactly ${params.durationWeeks} weeks.`;
}

// --- Portfolio Project Builder (Phase 3) ---

const buildPlanDayResponseSchema = {
  type: "OBJECT",
  properties: {
    day: { type: "INTEGER" },
    focus: { type: "STRING" },
    tasks: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["day", "focus", "tasks"],
};

export const PROJECT_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    valueProposition: { type: "STRING" },
    difficulty: { type: "STRING", enum: ["beginner", "intermediate", "advanced"] },
    estimatedHours: { type: "NUMBER" },
    description: { type: "STRING" },
    requiredSkills: { type: "ARRAY", items: { type: "STRING" } },
    userStories: { type: "ARRAY", items: { type: "STRING" } },
    suggestedStack: { type: "ARRAY", items: { type: "STRING" } },
    featureChecklist: { type: "ARRAY", items: { type: "STRING" } },
    buildPlan: { type: "ARRAY", items: buildPlanDayResponseSchema },
    deliverables: { type: "ARRAY", items: { type: "STRING" } },
    readmeOutline: { type: "STRING" },
    deploymentChecklist: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "title",
    "valueProposition",
    "difficulty",
    "estimatedHours",
    "description",
    "requiredSkills",
    "userStories",
    "suggestedStack",
    "featureChecklist",
    "buildPlan",
    "deliverables",
    "readmeOutline",
    "deploymentChecklist",
  ],
};

const PROJECT_TYPE_HINTS: Record<string, string> = {
  dashboard: "an analytics/admin dashboard that visualizes data the candidate fetches or generates",
  productivity: "a productivity tool (tracker, planner, or organizer) with persisted user data",
  data: "a data-focused project: ingest, clean, analyze, and visualize a real or public dataset",
  api_service: "a small backend API service with clear endpoints, validation, and documented routes",
};

export function buildProjectGenerationPrompt(params: {
  role: RoleTemplate;
  experienceLevel: string;
  weeklyHours: number;
  priorityGaps: Array<{ skill: string; priority: string }>;
  matchedSkills: string[];
  projectType?: string;
  avoidTitles?: string[];
}): string {
  const gapList = params.priorityGaps.map((g) => `${g.skill} (${g.priority})`).join(", ") || "none — reinforce existing skills";
  const typeHint = params.projectType ? PROJECT_TYPE_HINTS[params.projectType] : undefined;

  return `Design ONE realistic, scoped-for-one-week portfolio project for a "${params.role.label}" candidate that
demonstrates as many of their priority skill gaps as reasonably fit into a single project.

Candidate context:
- Experience level: ${params.experienceLevel}
- Available time: ~${params.weeklyHours} hours/week (design for roughly one week of that budget)
- Already-demonstrated skills (do not require re-proving these, but they may still be used): ${params.matchedSkills.join(", ") || "none yet"}
- Priority skill gaps to cover, in order of importance: ${gapList}
${typeHint ? `- The candidate asked for a project of this general shape: ${typeHint}.` : ""}
${params.avoidTitles?.length ? `- Do NOT reuse or lightly rename any of these previously suggested titles: ${params.avoidTitles.join(", ")}.` : ""}

Rules:
- Keep scope realistic for one person in about a week — never propose something that actually needs a team or a month.
- requiredSkills must be drawn primarily from the priority gaps above (cover as many CRITICAL and IMPORTANT ones as genuinely fit one coherent project); do not pad with unrelated skills.
- userStories: concrete "As a user, I want to ... so that ..." statements the project actually implements.
- buildPlan: exactly 7 entries (day 1-7), each with a clear focus and 2-4 concrete tasks. Day 7 must include deployment and README polish.
- featureChecklist: concrete, checkable features (not vague goals).
- deliverables: what the candidate ends up with (e.g. "Deployed live demo URL", "Public GitHub repo with README").
- readmeOutline: a short starter README a candidate could paste and fill in — include a problem statement, tech stack, how to run it locally, and where the live demo link goes. Plain text with line breaks, not markdown code fences.
- deploymentChecklist: concrete steps to actually ship it (e.g. to Vercel/Netlify/Render).
- Never suggest fabricating experience, fake users, fake metrics, or a fake company/client.

Respond with JSON only, matching the required schema exactly.`;
}

// --- Weekly check-in guidance ---

export const WEEKLY_CHECK_IN_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    suggestion: { type: "STRING" },
    adjustedTask: { type: "STRING", nullable: true },
  },
  required: ["suggestion", "adjustedTask"],
};

export function buildWeeklyCheckInPrompt(params: {
  targetRole: string;
  taskTitle: string;
  taskDescription: string;
  response: string;
  blocker?: string | null;
  availableHours?: number | null;
}): string {
  return `Write concise roadmap-linked guidance for a university student preparing for "${params.targetRole}".

Current roadmap task:
- Title: ${params.taskTitle}
- Description: ${params.taskDescription}

Check-in:
- Student selected: ${params.response}
${params.blocker ? `- Blocker: ${params.blocker}` : ""}
${params.availableHours ? `- New available time: ${params.availableHours} hours/week` : ""}

Rules:
- Do not act like a general chatbot.
- Give the next smallest useful action in 1-3 sentences.
- If the student is stuck, break the task into a smaller next step.
- If available time changed, mention how the remaining plan should be adjusted.
- Be encouraging but specific. Avoid generic motivational fluff.
- adjustedTask should be a short concrete task title if the roadmap task should be narrowed; otherwise null.

Respond with JSON only, matching the required schema exactly.`;
}

// --- Resume evidence builder ---

export const RESUME_BULLET_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    bullets: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["bullets"],
};

export function buildResumeBulletPrompt(params: {
  built: string;
  technologies: string;
  contribution: string;
  outcome: string;
  metric?: string | null;
}): string {
  return `Generate 2-3 editable CV bullet options from the student's own completed work.

Student-provided facts:
- What they built: ${params.built}
- Technologies: ${params.technologies}
- Contribution: ${params.contribution}
- Honest result/outcome: ${params.outcome}
${params.metric ? `- Real metric provided by student: ${params.metric}` : "- No metric was provided."}

Strict rules:
- Never invent metrics.
- Never invent employers, certifications, clients, users, or results.
- If no metric was provided, use qualitative wording only.
- Do not overclaim verification or job readiness.
- Write concise, credible entry-level CV bullets in past tense.

Respond with JSON only, matching the required schema exactly.`;
}
