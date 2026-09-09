import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { createInviteToken, hashInviteToken, inviteUrl } from "@/lib/admin/invites";
import { writeAdminAudit } from "@/lib/admin/audit";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const member = await requirePermission("team.invite");
    const { id } = await ctx.params;
    const before = await prisma.teamInvite.findUnique({ where: { id } });
    if (!before) return Response.json({ error: "Not found" }, { status: 404 });
    if (before.status !== "PENDING") return Response.json({ error: "Invite is no longer pending." }, { status: 400 });
    const token = createInviteToken();
    const invite = await prisma.teamInvite.update({
      where: { id },
      data: {
        tokenHash: hashInviteToken(token),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    await writeAdminAudit({
      actorMemberId: member.id,
      action: "TEAM_INVITE_RESENT",
      entityType: "TeamInvite",
      entityId: id,
      before: { id: before.id, email: before.email, role: before.role, status: before.status, expiresAt: before.expiresAt },
      after: { id: invite.id, email: invite.email, role: invite.role, status: invite.status, expiresAt: invite.expiresAt },
    });
    return Response.json({
      invite: { id: invite.id, email: invite.email, role: invite.role, status: invite.status, expiresAt: invite.expiresAt },
      inviteLink: inviteUrl(token, req.headers.get("origin")),
      sensitive: true,
    });
  } catch (error) {
    return apiAuthError(error);
  }
}
