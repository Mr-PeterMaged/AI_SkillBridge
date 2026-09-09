import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request, ctx: { params: Promise<{ memberId: string }> }) {
  try {
    await requirePermission("audit.read");
    const { memberId } = await ctx.params;
    const url = new URL(req.url);
    const take = Math.min(Number(url.searchParams.get("take") ?? 50), 100);
    const auditLogs = await prisma.adminAuditLog.findMany({
      where: { OR: [{ actorMemberId: memberId }, { targetMemberId: memberId }] },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        actor: { select: { id: true, displayName: true, email: true, role: true } },
        targetMember: { select: { id: true, displayName: true, email: true, role: true } },
      },
    });
    return Response.json({ auditLogs });
  } catch (error) {
    return apiAuthError(error);
  }
}
