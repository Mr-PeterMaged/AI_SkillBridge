-- CreateEnum
CREATE TYPE "SnapshotKind" AS ENUM ('BASELINE', 'REASSESSMENT');

-- CreateTable
CREATE TABLE "EvidenceItem" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "roadmapTaskId" TEXT,
    "type" "EvidenceType" NOT NULL,
    "url" TEXT,
    "reflectionBuilt" TEXT,
    "reflectionLearned" TEXT,
    "provesSkills" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvidenceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadinessSnapshot" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "kind" "SnapshotKind" NOT NULL,
    "readinessScore" INTEGER NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadinessSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EvidenceItem_analysisId_idx" ON "EvidenceItem"("analysisId");

-- CreateIndex
CREATE INDEX "EvidenceItem_roadmapTaskId_idx" ON "EvidenceItem"("roadmapTaskId");

-- CreateIndex
CREATE INDEX "ReadinessSnapshot_analysisId_idx" ON "ReadinessSnapshot"("analysisId");

-- CreateIndex
CREATE INDEX "ReadinessSnapshot_analysisId_createdAt_idx" ON "ReadinessSnapshot"("analysisId", "createdAt");

-- AddForeignKey
ALTER TABLE "EvidenceItem" ADD CONSTRAINT "EvidenceItem_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceItem" ADD CONSTRAINT "EvidenceItem_roadmapTaskId_fkey" FOREIGN KEY ("roadmapTaskId") REFERENCES "RoadmapTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessSnapshot" ADD CONSTRAINT "ReadinessSnapshot_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
