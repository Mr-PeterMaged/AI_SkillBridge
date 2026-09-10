-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TargetRole" ADD VALUE 'FULL_STACK_DEVELOPER';
ALTER TYPE "TargetRole" ADD VALUE 'MOBILE_APP_DEVELOPER';
ALTER TYPE "TargetRole" ADD VALUE 'QA_TEST_ENGINEER';
ALTER TYPE "TargetRole" ADD VALUE 'DEVOPS_ENGINEER';
ALTER TYPE "TargetRole" ADD VALUE 'UI_UX_DESIGNER';
ALTER TYPE "TargetRole" ADD VALUE 'DIGITAL_MARKETING_SPECIALIST';
