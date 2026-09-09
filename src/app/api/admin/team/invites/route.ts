import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { canInviteRole } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { createInviteSchema } from "@/lib/validation/admin";
import { createInviteToken, hashInviteToken, inviteUrl } from "@/lib/admin/invites";
import { writeAdminAudit } from "@/lib/admin/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const member = await requirePermission("team.invite");
    const rl = checkRateLimit(`team-invite:${member.id}`, 20, 60 * 60 * 1000);
    if (!rl.ok) return Response.json({ error: "Too many invitations. Please try again later." }, { status: 429 });

    const body = await req.json().catch(() => null);
    const parsed = createInviteSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    if (!canInviteRole(member.role, parsed.data.role)) {
      return Response.json({ error: "You cannot invite this role." }, { status: 403 });
    }

    const token = createInviteToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const invite = await prisma.teamInvite.create({
      data: {
        email: parsed.data.email,
        role: parsed.data.role,
        tokenHash: hashInviteToken(token),
        expiresAt,
        invitedByMemberId: member.id,
        note: parsed.data.note ?? null,
      },
    });

    await writeAdminAudit({
      actorMemberId: member.id,
      action: "TEAM_INVITE_CREATED",
      entityType: "TeamInvite",
      entityId: invite.id,
      after: { id: invite.id, email: invite.email, role: invite.role, status: invite.status, expiresAt: invite.expiresAt },
    });

    return Response.json(
      {
        invite: { id: invite.id, email: invite.email, role: invite.role, status: invite.status, expiresAt: invite.expiresAt },
        inviteLink: inviteUrl(token, req.headers.get("origin")),
        sensitive: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return apiAuthError(error);
  }
}
