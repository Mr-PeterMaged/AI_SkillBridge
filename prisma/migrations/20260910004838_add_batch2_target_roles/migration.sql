-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TargetRole" ADD VALUE 'CYBERSECURITY_ANALYST';
ALTER TYPE "TargetRole" ADD VALUE 'CLOUD_ENGINEER';
ALTER TYPE "TargetRole" ADD VALUE 'DATA_ENGINEER';
ALTER TYPE "TargetRole" ADD VALUE 'PRODUCT_MANAGER';
ALTER TYPE "TargetRole" ADD VALUE 'TECHNICAL_WRITER';
ALTER TYPE "TargetRole" ADD VALUE 'IT_SUPPORT_SPECIALIST';
