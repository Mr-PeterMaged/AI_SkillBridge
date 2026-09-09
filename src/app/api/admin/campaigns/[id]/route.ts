import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { campaignPatchSchema } from "@/lib/validation/admin";
import { writeAdminAudit } from "@/lib/admin/audit";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("campaign.read");
    const { id } = await ctx.params;
    const campaign = await prisma.promoCampaign.findUnique({
      where: { id },
      include: { promoCodes: true, ambassadors: true, redemptions: true, attributions: true },
    });
    if (!campaign) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ campaign });
  } catch (error) {
    return apiAuthError(error);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const member = await requirePermission("campaign.update");
    const { id } = await ctx.params;
    const before = await prisma.promoCampaign.findUnique({ where: { id } });
    if (!before) return Response.json({ error: "Not found" }, { status: 404 });
    const body = await req.json().catch(() => null);
    const parsed = campaignPatchSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    if (parsed.data.status === "ARCHIVED") await requirePermission("campaign.archive");
    const campaign = await prisma.promoCampaign.update({ where: { id }, data: parsed.data });
    await writeAdminAudit({
      actorMemberId: member.id,
      action: parsed.data.status === "ARCHIVED" ? "CAMPAIGN_ARCHIVED" : "CAMPAIGN_UPDATED",
      entityType: "PromoCampaign",
      entityId: id,
      before,
      after: campaign,
    });
    return Response.json({ campaign });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "That campaign slug already exists." }, { status: 409 });
    }
    return apiAuthError(error);
  }
}
