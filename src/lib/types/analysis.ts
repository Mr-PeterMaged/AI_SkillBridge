// Shared client-side view types for analysis API responses.

export type CandidateSkillDTO = {
  id: string;
  name: string;
  canonicalName: string;
  category: "TECHNICAL" | "TOOL" | "SOFT";
  confidence: number;
  status: string;
  mastery: "FAMILIAR" | "PRACTICED" | "PROVEN" | null;
  evidence: string[];
  userConfirmed: boolean;
};

export type JobRequirementDTO = {
  id: string;
  name: string;
  canonicalName: string;
  category: "TECHNICAL" | "TOOL" | "SOFT";
  priority: "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE";
  evidence: string[];
};

export type SkillGapDTO = {
  id: string;
  skillName: string;
  priority: "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE";
  reason: string;
  suggestedProof: string;
  estimatedHours: number;
};

export type ProjectRecommendationDTO = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  deliverables: string[];
  githubChecklist: string[];
};

export type RoadmapTaskDTO = {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETE";
  completedAt: string | null;
  evidenceUrl: string | null;
  evidenceType: string | null;
  notes: string | null;
};

export type RoadmapWeekDTO = {
  id: string;
  weekNumber: number;
  focus: string;
  learningObjective: string;
  estimatedHours: number;
  resources: { title: string; url: string }[];
  tasks: RoadmapTaskDTO[];
};

export type RoadmapDTO = {
  id: string;
  durationWeeks: number;
  weeks: RoadmapWeekDTO[];
};

export type EvidenceItemDTO = {
  id: string;
  roadmapTaskId: string | null;
  type: "GITHUB" | "DEMO_URL" | "PORTFOLIO_URL" | "CASE_STUDY" | "NOTE";
  url: string | null;
  reflectionBuilt: string | null;
  reflectionLearned: string | null;
  provesSkills: string[];
  createdAt: string;
  updatedAt: string;
};

export type ReadinessSnapshotDTO = {
  id: string;
  kind: "BASELINE" | "REASSESSMENT";
  readinessScore: number;
  scoreBreakdown: AnalysisDTO["scoreBreakdown"];
  createdAt: string;
};

export type MatchedRequirementDTO = {
  canonicalName: string;
  priority: "critical" | "important" | "nice_to_have";
  category: "technical" | "tool" | "soft";
  status: "matched" | "partial" | "missing";
  candidateEvidence: string[];
  requirementEvidence: string[];
  candidateConfidence: number;
};

export type AnalysisDTO = {
  id: string;
  targetRole: "JUNIOR_FRONTEND_DEVELOPER" | "JUNIOR_BACKEND_DEVELOPER" | "JUNIOR_DATA_ANALYST";
  experienceLevel: string;
  weeklyHours: string;
  status: string;
  readinessScore: number | null;
  scoreBreakdown: {
    criticalCoverage: number;
    importantCoverage: number;
    evidenceCoverage: number;
    criticalTotal: number;
    criticalMatched: number;
    importantTotal: number;
    importantMatched: number;
  } | null;
  candidateSummary: string | null;
  jobSummary: string | null;
  candidateSkills: CandidateSkillDTO[];
  jobRequirements: JobRequirementDTO[];
  skillGaps: SkillGapDTO[];
  projectRecommendations: ProjectRecommendationDTO[];
  roadmap: RoadmapDTO | null;
  evidenceItems: EvidenceItemDTO[];
  readinessSnapshots: ReadinessSnapshotDTO[];
};
