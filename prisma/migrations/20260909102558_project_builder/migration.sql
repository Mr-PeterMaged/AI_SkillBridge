-- CreateEnum
CREATE TYPE "ProjectSource" AS ENUM ('STATIC', 'AI_GENERATED');

-- AlterTable
ALTER TABLE "ProjectRecommendation" ADD COLUMN     "addedToRoadmap" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "buildPlan" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "deploymentChecklist" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "estimatedHours" INTEGER,
ADD COLUMN     "featureChecklist" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "readmeTemplate" TEXT,
ADD COLUMN     "skillCoverage" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "source" "ProjectSource" NOT NULL DEFAULT 'STATIC',
ADD COLUMN     "suggestedStack" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "userStories" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "valueProposition" TEXT;
