import { requirePermission, apiAuthError, canChangeRole, safeMemberSnapshot } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { updateRoleSchema } from "@/lib/validation/admin";
import { writeAdminAudit } from "@/lib/admin/audit";

export async function PATCH(req: Request, ctx: { params: Promise<{ memberId: string }> }) {
  try {
    const actor = await requirePermission("team.update_role");
    const { memberId } = await ctx.params;
    const target = await prisma.platformMember.findUnique({ where: { id: memberId } });
    if (!target) return Response.json({ error: "Not found" }, { status: 404 });
    if (target.id === actor.id) return Response.json({ error: "You cannot change your own role." }, { status: 403 });
    const body = await req.json().catch(() => null);
    const parsed = updateRoleSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    if (!canChangeRole(actor.role, target.role, parsed.data.role)) {
      return Response.json({ error: "This role change is not permitted." }, { status: 403 });
    }
    const updated = await prisma.platformMember.update({
      where: { id: memberId },
      data: { role: parsed.data.role, lastRoleChangedAt: new Date() },
    });
    await writeAdminAudit({
      actorMemberId: actor.id,
      targetMemberId: target.id,
      action: "TEAM_MEMBER_ROLE_CHANGED",
      entityType: "PlatformMember",
      entityId: target.id,
      before: safeMemberSnapshot(target),
      after: safeMemberSnapshot(updated),
    });
    return Response.json({ member: updated });
  } catch (error) {
    return apiAuthError(error);
  }
}
