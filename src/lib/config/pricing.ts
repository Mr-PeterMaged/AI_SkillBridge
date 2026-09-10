import type { BillingInterval, Plan } from "@prisma/client";

export const PLAN_CODES = ["FREE", "STARTER", "PRO", "ANNUAL_STUDENT", "JOB_SPRINT"] as const;
export type PlanCode = (typeof PLAN_CODES)[number];

export type BillingType = "FREE" | "RECURRING" | "ONE_TIME";

export type PlanEntitlements = {
  analysesPerCycle: number | null;
  analysisLimitLabel: string;
  fullRoadmap: boolean;
  roadmapPreview: boolean;
  curatedResources: boolean;
  progressTracking: boolean;
  projectBuilder: boolean;
  evidenceBuilder: boolean;
  reassessment: boolean;
  fullAnalysisHistory: boolean;
  jobSpecificRoadmaps: boolean;
  limitedJobDescriptionTemplates: boolean;
  topPriorityGaps: number | null;
};

export type PlanConfig = {
  code: PlanCode;
  id: PlanCode;
  name: string;
  tagline: string;
  billingType: BillingType;
  billingInterval: BillingInterval;
  pricePiastres: number;
  currency: "EGP";
  priceLabel: string;
  cta: string;
  highlighted?: boolean;
  paid: boolean;
  accessDays?: number;
  fairUse?: {
    successfulAnalysesPerCycle: number;
    analysisStartsPerHour: number;
    label: string;
  };
  entitlements: PlanEntitlements;
  features: string[];
};

const FREE_ENTITLEMENTS: PlanEntitlements = {
  analysesPerCycle: 1,
  analysisLimitLabel: "1 skill-gap analysis per month",
  fullRoadmap: false,
  roadmapPreview: true,
  curatedResources: false,
  progressTracking: false,
  projectBuilder: false,
  evidenceBuilder: false,
  reassessment: false,
  fullAnalysisHistory: false,
  jobSpecificRoadmaps: false,
  limitedJobDescriptionTemplates: true,
  topPriorityGaps: 3,
};

const PRO_ENTITLEMENTS: PlanEntitlements = {
  ...FREE_ENTITLEMENTS,
  analysesPerCycle: 50,
  analysisLimitLabel: "Unlimited analyses under fair-use policy",
  fullRoadmap: true,
  roadmapPreview: false,
  curatedResources: true,
  progressTracking: true,
  projectBuilder: true,
  evidenceBuilder: true,
  reassessment: true,
  fullAnalysisHistory: true,
  jobSpecificRoadmaps: true,
  topPriorityGaps: null,
};

export const PLAN_CONFIG = {
  FREE: {
    code: "FREE",
    id: "FREE",
    name: "Free",
    tagline: "A useful first skill-gap snapshot",
    billingType: "FREE",
    billingInterval: "MONTHLY",
    pricePiastres: 0,
    currency: "EGP",
    priceLabel: "0 EGP",
    cta: "Start Free",
    paid: false,
    entitlements: FREE_ENTITLEMENTS,
    features: [
      "1 skill-gap analysis per month",
      "Basic readiness score",
      "Top 3 priority gaps",
      "Locked roadmap preview",
      "Limited job-description templates",
    ],
  },
  STARTER: {
    code: "STARTER",
    id: "STARTER",
    name: "Starter",
    tagline: "For students actively closing gaps",
    billingType: "RECURRING",
    billingInterval: "MONTHLY",
    pricePiastres: 8900,
    currency: "EGP",
    priceLabel: "89 EGP/month",
    cta: "Choose Starter",
    paid: true,
    entitlements: {
      ...FREE_ENTITLEMENTS,
      analysesPerCycle: 10,
      analysisLimitLabel: "10 analyses per month",
      fullRoadmap: true,
      roadmapPreview: false,
      curatedResources: true,
      progressTracking: true,
      projectBuilder: false,
      fullAnalysisHistory: true,
      topPriorityGaps: null,
    },
    features: [
      "10 analyses per month",
      "Full roadmap",
      "Curated learning resources",
      "Basic progress tracking",
    ],
  },
  PRO: {
    code: "PRO",
    id: "PRO",
    name: "Pro",
    tagline: "For students preparing to apply now",
    billingType: "RECURRING",
    billingInterval: "MONTHLY",
    pricePiastres: 17900,
    currency: "EGP",
    priceLabel: "179 EGP/month",
    cta: "Go Pro",
    highlighted: true,
    paid: true,
    fairUse: {
      successfulAnalysesPerCycle: 50,
      analysisStartsPerHour: 5,
      label: "Unlimited analyses under fair-use policy",
    },
    entitlements: PRO_ENTITLEMENTS,
    features: [
      "Unlimited analyses under fair-use policy",
      "Job-specific roadmaps",
      "Portfolio Evidence Builder",
      "Reassessment and before/after score",
      "Full analysis history",
    ],
  },
  ANNUAL_STUDENT: {
    code: "ANNUAL_STUDENT",
    id: "ANNUAL_STUDENT",
    name: "Annual",
    tagline: "Everything in Pro, billed once a year",
    billingType: "RECURRING",
    billingInterval: "YEARLY",
    pricePiastres: 149900,
    currency: "EGP",
    priceLabel: "1,499 EGP/year",
    cta: "Go Annual",
    paid: true,
    fairUse: {
      successfulAnalysesPerCycle: 50,
      analysisStartsPerHour: 5,
      label: "Unlimited analyses under fair-use policy",
    },
    entitlements: PRO_ENTITLEMENTS,
    features: [
      "Everything in Pro",
      "Billed once a year instead of monthly",
      "Save vs. paying for Pro month to month",
      "Same monthly fair-use analysis allowance",
    ],
  },
  JOB_SPRINT: {
    code: "JOB_SPRINT",
    id: "JOB_SPRINT",
    name: "Job Sprint",
    tagline: "One role, one deadline, one plan",
    billingType: "ONE_TIME",
    billingInterval: "ONE_TIME",
    pricePiastres: 29900,
    currency: "EGP",
    priceLabel: "299 EGP one-time",
    cta: "Buy Job Sprint",
    paid: true,
    accessDays: 30,
    fairUse: {
      successfulAnalysesPerCycle: 50,
      analysisStartsPerHour: 5,
      label: "30 days of Pro access under fair-use policy",
    },
    entitlements: {
      ...FREE_ENTITLEMENTS,
      analysesPerCycle: 50,
      analysisLimitLabel: "30 days of Pro access under fair-use policy",
      fullRoadmap: true,
      roadmapPreview: false,
      curatedResources: true,
      progressTracking: true,
      projectBuilder: true,
      evidenceBuilder: true,
      reassessment: true,
      fullAnalysisHistory: true,
      jobSpecificRoadmaps: true,
      topPriorityGaps: null,
    },
    features: [
      "30 days of Pro access from manual activation",
      "One complete role-specific roadmap",
      "CV evidence checklist",
      "Portfolio project plan",
      "Not a recurring subscription",
    ],
  },
} satisfies Record<PlanCode, PlanConfig>;

export const PRICING_PLANS: PlanConfig[] = PLAN_CODES.map((code) => PLAN_CONFIG[code]);
export const PAID_PLAN_CODES = PLAN_CODES.filter((code) => PLAN_CONFIG[code].paid) as Exclude<PlanCode, "FREE">[];

export function isPlanCode(value: unknown): value is PlanCode {
  return typeof value === "string" && (PLAN_CODES as readonly string[]).includes(value);
}

export function toPlanCode(plan: Plan): PlanCode {
  return isPlanCode(plan) ? plan : "FREE";
}

export function getPlan(code: PlanCode): PlanConfig {
  return PLAN_CONFIG[code];
}

export function isPaidPlan(code: PlanCode) {
  return PLAN_CONFIG[code].paid;
}

export function formatPiastres(amountPiastres: number) {
  const amount = amountPiastres / 100;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatEgp(amountPiastres: number) {
  return `${formatPiastres(amountPiastres)} EGP`;
}
