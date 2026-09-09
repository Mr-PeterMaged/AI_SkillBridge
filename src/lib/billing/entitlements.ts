import "server-only";
import type { Plan, Subscription } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { getPlan, type PlanCode, toPlanCode } from "@/lib/config/pricing";

export type ActiveEntitlement = {
  plan: PlanCode;
  source: "FREE" | "SUBSCRIPTION" | "LEGACY_USER_PLAN";
  subscription: Subscription | null;
  periodStart: Date;
  periodEnd: Date;
};

export class EntitlementError extends Error {
  constructor(
    public code: "PLAN_LIMIT_REACHED" | "FEATURE_LOCKED" | "RATE_LIMITED",
    message: string,
    public status: 402 | 429 = code === "RATE_LIMITED" ? 429 : 402
  ) {
    super(message);
  }
}

export function monthCycleFor(date = new Date()) {
  const periodStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const periodEnd = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  return { periodStart, periodEnd };
}

export async function getActiveEntitlement(user: { id: string; plan: Plan }, now = new Date()): Promise<ActiveEntitlement> {
  await expireOldSubscriptions(user.id, now);

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
      plan: { not: "FREE" },
      OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: now } }],
    },
    orderBy: [{ currentPeriodEnd: "desc" }, { activatedAt: "desc" }],
  });

  if (subscription) {
    return {
      plan: toPlanCode(subscription.plan),
      source: "SUBSCRIPTION",
      subscription,
      periodStart: subscription.startedAt,
      periodEnd: subscription.currentPeriodEnd ?? monthCycleFor(now).periodEnd,
    };
  }

  const legacyPlan = toPlanCode(user.plan);
  if (legacyPlan !== "FREE") {
    const { periodStart, periodEnd } = monthCycleFor(now);
    return { plan: legacyPlan, source: "LEGACY_USER_PLAN", subscription: null, periodStart, periodEnd };
  }

  const cycle = monthCycleFor(now);
  return { plan: "FREE", source: "FREE", subscription: null, ...cycle };
}

export async function expireOldSubscriptions(userId: string, now = new Date()) {
  const expired = await prisma.subscription.updateMany({
    where: {
      userId,
      status: "ACTIVE",
      currentPeriodEnd: { not: null, lte: now },
    },
    data: { status: "EXPIRED" },
  });

  if (expired.count > 0) {
    const activePaid = await prisma.subscription.count({
      where: {
        userId,
        status: "ACTIVE",
        plan: { not: "FREE" },
        OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: now } }],
      },
    });
    if (activePaid === 0) {
      await prisma.user.update({ where: { id: userId }, data: { plan: "FREE" } });
    }
  }
}

export async function getUsageForEntitlement(userId: string, entitlement: ActiveEntitlement) {
  const cycle = await prisma.planUsageCycle.findFirst({
    where: {
      userId,
      plan: entitlement.plan,
      periodStart: entitlement.periodStart,
    },
  });
  return cycle?.successfulAnalyses ?? 0;
}

export async function assertCanStartAnalysis(user: { id: string; clerkUserId: string; plan: Plan }) {
  const entitlement = await getActiveEntitlement(user);
  const plan = getPlan(entitlement.plan);
  const hourlyLimit = plan.fairUse?.analysisStartsPerHour ?? 10;
  const rateLimit = checkRateLimit(`analysis-start:${user.clerkUserId}`, hourlyLimit, 60 * 60 * 1000);
  if (!rateLimit.ok) {
    throw new EntitlementError("RATE_LIMITED", "Too many analysis starts. Please try again later.", 429);
  }

  if (plan.entitlements.analysesPerCycle !== null) {
    const used = await getUsageForEntitlement(user.id, entitlement);
    if (used >= plan.entitlements.analysesPerCycle) {
      throw new EntitlementError(
        "PLAN_LIMIT_REACHED",
        entitlement.plan === "FREE"
          ? "You've used your free analysis for this month. Upgrade to Starter or Pro for more."
          : `You've reached your ${plan.name} analysis limit for this billing cycle.`
      );
    }
  }

  return entitlement;
}

export async function recordAnalysisUse(userId: string, entitlement: ActiveEntitlement) {
  await prisma.planUsageCycle.upsert({
    where: {
      userId_plan_periodStart: {
        userId,
        plan: entitlement.plan,
        periodStart: entitlement.periodStart,
      },
    },
    update: { successfulAnalyses: { increment: 1 } },
    create: {
      userId,
      plan: entitlement.plan,
      periodStart: entitlement.periodStart,
      periodEnd: entitlement.periodEnd,
      successfulAnalyses: 1,
    },
  });
}

export async function assertFeature(user: { id: string; plan: Plan }, feature: keyof ReturnType<typeof getPlan>["entitlements"]) {
  const entitlement = await getActiveEntitlement(user);
  const plan = getPlan(entitlement.plan);
  if (!plan.entitlements[feature]) {
    throw new EntitlementError(
      "FEATURE_LOCKED",
      `${plan.name} does not include this feature. Upgrade to unlock it.`
    );
  }
  return entitlement;
}
