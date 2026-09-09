-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'STARTER', 'PRO', 'JOB_SPRINT', 'ANNUAL_STUDENT');

-- CreateEnum
CREATE TYPE "TargetRole" AS ENUM ('JUNIOR_FRONTEND_DEVELOPER', 'JUNIOR_BACKEND_DEVELOPER', 'JUNIOR_DATA_ANALYST');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('STUDENT', 'FRESH_GRADUATE', 'JUNIOR');

-- CreateEnum
CREATE TYPE "WeeklyHours" AS ENUM ('H3', 'H5', 'H8', 'H10_PLUS');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('DRAFT', 'EXTRACTING', 'AWAITING_REVIEW', 'SCORED', 'ROADMAP_READY', 'FAILED');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('TECHNICAL', 'TOOL', 'SOFT');

-- CreateEnum
CREATE TYPE "SkillStatus" AS ENUM ('MATCHED', 'PARTIAL', 'MISSING', 'USER_ADDED');

-- CreateEnum
CREATE TYPE "SkillMastery" AS ENUM ('FAMILIAR', 'PRACTICED', 'PROVEN');

-- CreateEnum
CREATE TYPE "RequirementPriority" AS ENUM ('CRITICAL', 'IMPORTANT', 'NICE_TO_HAVE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETE');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('GITHUB', 'DEMO_URL', 'PORTFOLIO_URL', 'CASE_STUDY', 'NOTE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetRole" "TargetRole" NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "weeklyHours" "WeeklyHours" NOT NULL,
    "cvText" TEXT,
    "jobDescriptionText" TEXT,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'DRAFT',
    "readinessScore" INTEGER,
    "scoreBreakdown" JSONB,
    "candidateSummary" TEXT,
    "jobSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSkill" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "SkillStatus" NOT NULL DEFAULT 'MATCHED',
    "mastery" "SkillMastery",
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "userConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRequirement" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "priority" "RequirementPriority" NOT NULL,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillGap" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "priority" "RequirementPriority" NOT NULL,
    "reason" TEXT NOT NULL,
    "suggestedProof" TEXT NOT NULL,
    "estimatedHours" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillGap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "durationWeeks" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapWeek" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "focus" TEXT NOT NULL,
    "learningObjective" TEXT NOT NULL,
    "estimatedHours" INTEGER NOT NULL,
    "resources" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "RoadmapWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapTask" (
    "id" TEXT NOT NULL,
    "roadmapWeekId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "evidenceUrl" TEXT,
    "evidenceType" "EvidenceType",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRecommendation" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredSkills" JSONB NOT NULL DEFAULT '[]',
    "deliverables" JSONB NOT NULL DEFAULT '[]',
    "githubChecklist" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkUserId_idx" ON "User"("clerkUserId");

-- CreateIndex
CREATE INDEX "Analysis_userId_idx" ON "Analysis"("userId");

-- CreateIndex
CREATE INDEX "Analysis_userId_createdAt_idx" ON "Analysis"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CandidateSkill_analysisId_idx" ON "CandidateSkill"("analysisId");

-- CreateIndex
CREATE INDEX "JobRequirement_analysisId_idx" ON "JobRequirement"("analysisId");

-- CreateIndex
CREATE INDEX "SkillGap_analysisId_idx" ON "SkillGap"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_analysisId_key" ON "Roadmap"("analysisId");

-- CreateIndex
CREATE INDEX "RoadmapWeek_roadmapId_idx" ON "RoadmapWeek"("roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapWeek_roadmapId_weekNumber_key" ON "RoadmapWeek"("roadmapId", "weekNumber");

-- CreateIndex
CREATE INDEX "RoadmapTask_roadmapWeekId_idx" ON "RoadmapTask"("roadmapWeekId");

-- CreateIndex
CREATE INDEX "ProjectRecommendation_analysisId_idx" ON "ProjectRecommendation"("analysisId");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSkill" ADD CONSTRAINT "CandidateSkill_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequirement" ADD CONSTRAINT "JobRequirement_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillGap" ADD CONSTRAINT "SkillGap_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapWeek" ADD CONSTRAINT "RoadmapWeek_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapTask" ADD CONSTRAINT "RoadmapTask_roadmapWeekId_fkey" FOREIGN KEY ("roadmapWeekId") REFERENCES "RoadmapWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRecommendation" ADD CONSTRAINT "ProjectRecommendation_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
