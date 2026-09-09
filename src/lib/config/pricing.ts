// ---------------------------------------------------------------
// Central pricing configuration — student-friendly EGP pricing.
// These are launch hypotheses to A/B test with real users, not
// final prices. Keep every price in this one file so the pricing
// page and plan-gating logic never drift apart.
// ---------------------------------------------------------------

export type PlanId = "FREE" | "STARTER" | "PRO" | "JOB_SPRINT" | "ANNUAL_STUDENT";

export type PlanConfig = {
  id: PlanId;
  name: string;
  tagline: string;
  price: { amount: number; currency: "EGP"; period: "month" | "year" | "one_time" };
  analysesPerMonth: number | "unlimited_fair_use";
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const PRICING_PLANS: PlanConfig[] = [
  {
    id: "FREE",
    name: "Free",
    tagline: "See your first skill gap snapshot",
    price: { amount: 0, currency: "EGP", period: "month" },
    analysesPerMonth: 1,
    features: [
      "1 skill-gap analysis per month",
      "Basic readiness score",
      "Top 3 priority gaps",
      "Roadmap preview (locked full detail)",
      "Limited job description templates",
    ],
    cta: "Start Free",
  },
  {
    id: "STARTER",
    name: "Starter",
    tagline: "For students actively closing gaps",
    price: { amount: 89, currency: "EGP", period: "month" },
    analysesPerMonth: 3,
    features: [
      "3 analyses per month",
      "Full 4-week roadmap",
      "Curated learning resources",
      "Basic progress tracking",
    ],
    cta: "Choose Starter",
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "For students preparing to apply now",
    price: { amount: 179, currency: "EGP", period: "month" },
    analysesPerMonth: "unlimited_fair_use",
    features: [
      "Unlimited analyses (fair use)",
      "Job-specific roadmaps",
      "Portfolio Evidence Builder",
      "Reassessment & before/after score",
      "Full analysis history",
    ],
    highlighted: true,
    cta: "Go Pro",
  },
  {
    id: "JOB_SPRINT",
    name: "Job Sprint",
    tagline: "One role, one deadline, one plan",
    price: { amount: 299, currency: "EGP", period: "one_time" },
    analysesPerMonth: "unlimited_fair_use",
    features: [
      "30 days of Pro access",
      "One complete role-specific roadmap",
      "CV evidence checklist",
      "Portfolio project plan",
    ],
    cta: "Start My Sprint",
  },
  {
    id: "ANNUAL_STUDENT",
    name: "Annual Student",
    tagline: "Best value for the whole academic year",
    price: { amount: 899, currency: "EGP", period: "year" },
    analysesPerMonth: "unlimited_fair_use",
    features: ["Everything in Pro", "~75 EGP/month equivalent", "Priority support"],
    cta: "Get Annual Access",
  },
];

export function getPlan(id: PlanId): PlanConfig {
  const plan = PRICING_PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}

/** Free-tier gating: how many analyses a FREE plan user may create per rolling 30 days. */
export const FREE_PLAN_MONTHLY_ANALYSIS_LIMIT = 1;
