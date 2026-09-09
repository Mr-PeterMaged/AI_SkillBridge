import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { hashInviteToken } from "@/lib/admin/invites";
import { inviteTokenSchema } from "@/lib/validation/admin";
import { getVerifiedPrimaryEmail, safeMemberSnapshot } from "@/lib/auth/admin";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Sign in to accept this invite." }, { status: 401 });
  const rl = checkRateLimit(`invite-accept:${userId}`, 10, 60 * 60 * 1000);
  if (!rl.ok) return Response.json({ error: "Too many attempts. Please try again later." }, { status: 429 });

  const { token } = await ctx.params;
  const parsed = inviteTokenSchema.safeParse(token);
  if (!parsed.success) return Response.json({ error: "Invite not found or expired." }, { status: 404 });

  const clerkUser = await currentUser();
  const verifiedEmail = getVerifiedPrimaryEmail(clerkUser);
  if (!verifiedEmail) return Response.json({ error: "A verified email is required to accept this invite." }, { status: 403 });

  const tokenHash = hashInviteToken(parsed.data);
  const invite = await prisma.teamInvite.findUnique({ where: { tokenHash } });
  if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
    return Response.json({ error: "Invite not found or expired." }, { status: 404 });
  }
  if (invite.email.toLowerCase() !== verifiedEmail.toLowerCase()) {
    return Response.json({ error: "This invite belongs to a different verified email." }, { status: 403 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const claimed = await tx.teamInvite.updateMany({
      where: { id: invite.id, status: "PENDING" },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });
    if (claimed.count !== 1) throw new Error("Invite already used.");

    const member = await tx.platformMember.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        email: verifiedEmail,
        displayName: clerkUser?.fullName ?? clerkUser?.firstName ?? null,
        role: invite.role,
        status: "ACTIVE",
        invitedByMemberId: invite.invitedByMemberId,
        invitedAt: invite.createdAt,
        joinedAt: new Date(),
        lastRoleChangedAt: new Date(),
      },
      update: {
        email: verifiedEmail,
        displayName: clerkUser?.fullName ?? clerkUser?.firstName ?? null,
        role: invite.role,
        status: "ACTIVE",
        removedAt: null,
        suspendedAt: null,
        joinedAt: new Date(),
        lastRoleChangedAt: new Date(),
      },
    });

    await tx.adminAuditLog.create({
      data: {
        actorMemberId: member.id,
        targetMemberId: member.id,
        action: "TEAM_INVITE_ACCEPTED",
        entityType: "TeamInvite",
        entityId: invite.id,
        after: { member: safeMemberSnapshot(member), inviteId: invite.id, role: invite.role },
      },
    });

    return member;
  });

  return Response.json({ ok: true, role: result.role, status: result.status });
}
