import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { campaignInputSchema } from "@/lib/validation/admin";
import { writeAdminAudit } from "@/lib/admin/audit";

export async function GET(req: Request) {
  try {
    await requirePermission("campaign.read");
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();
    const status = url.searchParams.get("status");
    const where: Prisma.PromoCampaignWhereInput = {};
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }];
    if (status && ["ACTIVE", "PAUSED", "ARCHIVED"].includes(status)) where.status = status as "ACTIVE" | "PAUSED" | "ARCHIVED";
    const campaigns = await prisma.promoCampaign.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { promoCodes: true, ambassadors: true, redemptions: true, attributions: true },
    });
    return Response.json({ campaigns });
  } catch (error) {
    return apiAuthError(error);
  }
}

export async function POST(req: Request) {
  try {
    const member = await requirePermission("campaign.create");
    const body = await req.json().catch(() => null);
    const parsed = campaignInputSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    const campaign = await prisma.promoCampaign.create({ data: parsed.data });
    await writeAdminAudit({
      actorMemberId: member.id,
      action: "CAMPAIGN_CREATED",
      entityType: "PromoCampaign",
      entityId: campaign.id,
      after: campaign,
    });
    return Response.json({ campaign }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "That campaign slug already exists." }, { status: 409 });
    }
    return apiAuthError(error);
  }
}
