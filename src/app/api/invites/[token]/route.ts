import { prisma } from "@/lib/db/prisma";
import { hashInviteToken, maskEmail } from "@/lib/admin/invites";
import { inviteTokenSchema } from "@/lib/validation/admin";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const parsed = inviteTokenSchema.safeParse(token);
  if (!parsed.success) return Response.json({ error: "Invite not found." }, { status: 404 });
  const invite = await prisma.teamInvite.findUnique({
    where: { tokenHash: hashInviteToken(parsed.data) },
    select: { email: true, role: true, status: true, expiresAt: true },
  });
  if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
    return Response.json({ error: "Invite not found or expired." }, { status: 404 });
  }
  return Response.json({
    invite: {
      emailHint: maskEmail(invite.email),
      role: invite.role,
      expiresAt: invite.expiresAt,
    },
  });
}
