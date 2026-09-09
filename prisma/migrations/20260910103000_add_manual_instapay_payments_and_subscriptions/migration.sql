-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ManualPaymentStatus" AS ENUM ('PENDING_PAYMENT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "billingInterval" "BillingInterval" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "activatedById" TEXT,
    "manualPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualPaymentRequest" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedPlan" "Plan" NOT NULL,
    "billingInterval" "BillingInterval" NOT NULL,
    "status" "ManualPaymentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "originalAmount" INTEGER NOT NULL,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "finalAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "promoCodeId" TEXT,
    "promoCodeSnapshot" JSONB,
    "userEmailSnapshot" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'INSTAPAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedByMemberId" TEXT,
    "rejectionReason" TEXT,
    "adminNotes" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ManualPaymentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanUsageCycle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "successfulAnalyses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanUsageCycle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_manualPaymentId_key" ON "Subscription"("manualPaymentId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Subscription_plan_status_idx" ON "Subscription"("plan", "status");

-- CreateIndex
CREATE INDEX "Subscription_currentPeriodEnd_idx" ON "Subscription"("currentPeriodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "ManualPaymentRequest_reference_key" ON "ManualPaymentRequest"("reference");

-- CreateIndex
CREATE INDEX "ManualPaymentRequest_userId_status_idx" ON "ManualPaymentRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "ManualPaymentRequest_status_createdAt_idx" ON "ManualPaymentRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ManualPaymentRequest_selectedPlan_status_idx" ON "ManualPaymentRequest"("selectedPlan", "status");

-- CreateIndex
CREATE INDEX "ManualPaymentRequest_promoCodeId_idx" ON "ManualPaymentRequest"("promoCodeId");

-- CreateIndex
CREATE INDEX "ManualPaymentRequest_expiresAt_idx" ON "ManualPaymentRequest"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlanUsageCycle_userId_plan_periodStart_key" ON "PlanUsageCycle"("userId", "plan", "periodStart");

-- CreateIndex
CREATE INDEX "PlanUsageCycle_userId_periodEnd_idx" ON "PlanUsageCycle"("userId", "periodEnd");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_manualPaymentId_fkey" FOREIGN KEY ("manualPaymentId") REFERENCES "ManualPaymentRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualPaymentRequest" ADD CONSTRAINT "ManualPaymentRequest_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualPaymentRequest" ADD CONSTRAINT "ManualPaymentRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualPaymentRequest" ADD CONSTRAINT "ManualPaymentRequest_reviewedByMemberId_fkey" FOREIGN KEY ("reviewedByMemberId") REFERENCES "PlatformMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanUsageCycle" ADD CONSTRAINT "PlanUsageCycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
