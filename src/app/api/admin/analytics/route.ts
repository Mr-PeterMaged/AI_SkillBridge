import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { getPromotionMetrics } from "@/lib/admin/metrics";
import { writeAdminAudit } from "@/lib/admin/audit";

export async function GET(req: Request) {
  try {
    const member = await requirePermission("analytics.read");
    const url = new URL(req.url);
    const range = parseDateRange(url.searchParams);
    const metrics = await getPromotionMetrics(range);
    await writeAdminAudit({
      actorMemberId: member.id,
      action: "ANALYTICS_VIEWED",
      entityType: "AdminAnalytics",
      metadata: range,
    });
    return Response.json(metrics);
  } catch (error) {
    return apiAuthError(error);
  }
}

function parseDateRange(searchParams: URLSearchParams) {
  const preset = searchParams.get("range") ?? "30d";
  const now = new Date();
  if (preset === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { start, end: now };
  }
  if (preset === "7d") return { start: daysAgo(7), end: now };
  if (preset === "90d") return { start: daysAgo(90), end: now };
  if (preset === "custom") {
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    return {
      start: start ? new Date(start) : undefined,
      end: end ? new Date(end) : undefined,
    };
  }
  return { start: daysAgo(30), end: now };
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
