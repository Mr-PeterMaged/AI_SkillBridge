import "server-only";
import type { PromoCode, PromoDuration, DiscountType } from "@prisma/client";

export function discountDescription(input: {
  discountType: DiscountType;
  discountAmount: number;
  currency?: string | null;
  duration: PromoDuration;
  durationMonths?: number | null;
}) {
  const amount =
    input.discountType === "PERCENTAGE"
      ? `${input.discountAmount}% off`
      : `${input.discountAmount / 100} ${input.currency ?? "EGP"} off`;
  if (input.duration === "ONCE") return `${amount} once`;
  if (input.duration === "REPEATING") return `${amount} for the first ${input.durationMonths ?? 1} months`;
  return `${amount} forever`;
}

export function promoComputedStatus(code: Pick<PromoCode, "status" | "expiresAt" | "maxRedemptions" | "redemptionCount">) {
  if (code.status === "ARCHIVED") return "ARCHIVED";
  if (code.status === "PAUSED") return "PAUSED";
  if (code.expiresAt && code.expiresAt.getTime() < Date.now()) return "EXPIRED";
  if (code.maxRedemptions !== null && code.redemptionCount >= code.maxRedemptions) return "EXHAUSTED";
  return "ACTIVE";
}

export function remainingUses(code: Pick<PromoCode, "maxRedemptions" | "redemptionCount">) {
  if (code.maxRedemptions === null) return null;
  return Math.max(code.maxRedemptions - code.redemptionCount, 0);
}

export function referralLink(referralKey: string, origin?: string) {
  const base = origin || "https://skillbridge.ai";
  return `${base.replace(/\/$/, "")}/?ref=${encodeURIComponent(referralKey)}`;
}

export function shareText(params: { code: string; discount: string; referralLink: string }) {
  return {
    en: `Use code ${params.code} to get ${params.discount} on SkillBridge AI.\nAnalyze your skills, build a personalized roadmap, and create portfolio evidence:\n${params.referralLink}`,
    ar: `استخدم كود ${params.code} للحصول على ${params.discount} على SkillBridge AI.\nحلل مهاراتك، ابنِ Roadmap مخصصة، وأنشئ Portfolio Evidence:\n${params.referralLink}`,
  };
}

export function csv(rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(","));
  }
  return lines.join("\n");
}

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return "";
  const stringValue = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
}

export function money(cents: number, currency = "EGP") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}
