import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";

export async function GET(_req: Request, ctx: { params: Promise<{ memberId: string }> }) {
  try {
    await requirePermission("team.read");
    const { memberId } = await ctx.params;
    const member = await prisma.platformMember.findUnique({
      where: { id: memberId },
      include: { invitedBy: { select: { id: true, displayName: true, email: true } } },
    });
    if (!member) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ member });
  } catch (error) {
    return apiAuthError(error);
  }
}
