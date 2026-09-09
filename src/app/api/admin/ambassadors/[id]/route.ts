import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { ambassadorPatchSchema } from "@/lib/validation/admin";
import { writeAdminAudit } from "@/lib/admin/audit";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("ambassador.read");
    const { id } = await ctx.params;
    const ambassador = await prisma.ambassador.findUnique({
      where: { id },
      include: { campaign: true, promoCodes: true, redemptions: true, attributions: true },
    });
    if (!ambassador) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ambassador });
  } catch (error) {
    return apiAuthError(error);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const member = await requirePermission("ambassador.update");
    const { id } = await ctx.params;
    const before = await prisma.ambassador.findUnique({ where: { id } });
    if (!before) return Response.json({ error: "Not found" }, { status: 404 });
    const body = await req.json().catch(() => null);
    const parsed = ambassadorPatchSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    if (parsed.data.status === "ARCHIVED") await requirePermission("ambassador.archive");
    const ambassador = await prisma.ambassador.update({ where: { id }, data: parsed.data });
    await writeAdminAudit({
      actorMemberId: member.id,
      action: parsed.data.status === "ARCHIVED" ? "AMBASSADOR_ARCHIVED" : "AMBASSADOR_UPDATED",
      entityType: "Ambassador",
      entityId: id,
      before,
      after: ambassador,
    });
    return Response.json({ ambassador });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "That ambassador handle or referral key already exists." }, { status: 409 });
    }
    return apiAuthError(error);
  }
}
