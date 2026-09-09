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
  priorityGaps: Array<{ skill: string; priority: string; reason: string }>;
  matchedSkills: string[];
}): string {
  const gapLines = params.priorityGaps
    .map((g, i) => `${i + 1}. [${g.priority.toUpperCase()}] ${g.skill} — ${g.reason}`)
    .join("\n");

  return `Build a personalized 4-week learning roadmap for a "${params.role.label}" candidate.

Candidate context:
- Experience level: ${params.experienceLevel}
- Available study time: ~${params.weeklyHours} hours/week
- Already-demonstrated skills (do not re-teach these from scratch): ${params.matchedSkills.join(", ") || "none yet"}

Priority skill gaps to address, in order of importance (critical first):
${gapLines || "No critical gaps found — focus the roadmap on strengthening and proving existing skills."}

Rules:
- Cover the HIGHEST priority gaps first; do not spend a full week on a nice_to_have gap if critical gaps remain.
- Respect the candidate's weekly time budget — do not assign more hours than they have available.
- Each week must have ONE clear focus skill (or tightly related pair), 2-4 concrete micro-tasks, exactly one
  deliverable, and one piece of evidence to publish (GitHub commit, deployed link, screenshot, etc).
- Tasks must be concrete and actionable ("Build X", "Write Y tests for Z"), never vague ("Learn about X").
- Suggest 1-3 real, well-known, freely accessible learning resources per week (official docs, MDN, freeCodeCamp,
  Kaggle Learn, web.dev, etc). Use real URLs you are confident exist; if unsure of an exact URL, link to the
  resource's known homepage instead of guessing a deep link.
- Never suggest fabricating experience — only building and documenting real, verifiable work.

Respond with JSON only, matching the required schema exactly. Produce exactly 4 weeks.`;
}
