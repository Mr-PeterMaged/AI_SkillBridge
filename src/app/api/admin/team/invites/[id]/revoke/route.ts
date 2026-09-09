import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { writeAdminAudit } from "@/lib/admin/audit";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const member = await requirePermission("team.invite");
    const { id } = await ctx.params;
    const before = await prisma.teamInvite.findUnique({ where: { id } });
    if (!before) return Response.json({ error: "Not found" }, { status: 404 });
    if (before.status !== "PENDING") return Response.json({ error: "Invite is no longer pending." }, { status: 400 });
    const invite = await prisma.teamInvite.update({
      where: { id },
      data: { status: "REVOKED", revokedAt: new Date() },
    });
    await writeAdminAudit({
      actorMemberId: member.id,
      action: "TEAM_INVITE_REVOKED",
      entityType: "TeamInvite",
      entityId: id,
      before: { id: before.id, email: before.email, role: before.role, status: before.status },
      after: { id: invite.id, email: invite.email, role: invite.role, status: invite.status },
    });
    return Response.json({ invite });
  } catch (error) {
    return apiAuthError(error);
  }
}
