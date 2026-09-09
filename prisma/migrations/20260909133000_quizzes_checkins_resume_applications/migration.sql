-- CreateEnum
CREATE TYPE "QuizSkill" AS ENUM ('REACT_FUNDAMENTALS', 'TYPESCRIPT_FUNDAMENTALS', 'REST_API_FUNDAMENTALS', 'GIT_FUNDAMENTALS', 'SQL_FUNDAMENTALS', 'PYTHON_FUNDAMENTALS', 'DATA_VISUALIZATION_FUNDAMENTALS');

-- CreateEnum
CREATE TYPE "QuizResultStatus" AS ENUM ('LEARNING', 'QUIZ_COMPLETED', 'STRONG_QUIZ_RESULT');

-- CreateEnum
CREATE TYPE "CheckInResponse" AS ENUM ('COMPLETED', 'MADE_PROGRESS', 'GOT_STUCK', 'DID_NOT_START');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SAVED', 'PREPARING', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED');

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "analysisId" TEXT,
    "skill" "QuizSkill" NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "status" "QuizResultStatus" NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "roadmapTaskId" TEXT,
    "response" "CheckInResponse" NOT NULL,
    "blocker" TEXT,
    "availableHours" INTEGER,
    "aiSuggestion" TEXT NOT NULL,
    "adjustedTask" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeBullet" (
    "id" TEXT NOT NULL,
    "evidenceItemId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeBullet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "analysisId" TEXT,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "applicationUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SAVED',
    "deadline" TIMESTAMP(3),
    "notes" TEXT,
    "readinessScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_skill_createdAt_idx" ON "QuizAttempt"("userId", "skill", "createdAt");

-- CreateIndex
CREATE INDEX "QuizAttempt_analysisId_idx" ON "QuizAttempt"("analysisId");

-- CreateIndex
CREATE INDEX "WeeklyCheckIn_userId_createdAt_idx" ON "WeeklyCheckIn"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "WeeklyCheckIn_analysisId_createdAt_idx" ON "WeeklyCheckIn"("analysisId", "createdAt");

-- CreateIndex
CREATE INDEX "WeeklyCheckIn_roadmapTaskId_idx" ON "WeeklyCheckIn"("roadmapTaskId");

-- CreateIndex
CREATE INDEX "ResumeBullet_evidenceItemId_idx" ON "ResumeBullet"("evidenceItemId");

-- CreateIndex
CREATE INDEX "JobApplication_userId_createdAt_idx" ON "JobApplication"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "JobApplication_analysisId_idx" ON "JobApplication"("analysisId");

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckIn" ADD CONSTRAINT "WeeklyCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckIn" ADD CONSTRAINT "WeeklyCheckIn_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckIn" ADD CONSTRAINT "WeeklyCheckIn_roadmapTaskId_fkey" FOREIGN KEY ("roadmapTaskId") REFERENCES "RoadmapTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeBullet" ADD CONSTRAINT "ResumeBullet_evidenceItemId_fkey" FOREIGN KEY ("evidenceItemId") REFERENCES "EvidenceItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
