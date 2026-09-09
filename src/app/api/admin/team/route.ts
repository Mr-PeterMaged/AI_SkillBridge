import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    await requirePermission("team.read");
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();
    const role = url.searchParams.get("role");
    const status = url.searchParams.get("status");
    const where: Prisma.PlatformMemberWhereInput = {};
    if (q) where.OR = [{ email: { contains: q, mode: "insensitive" } }, { displayName: { contains: q, mode: "insensitive" } }];
    if (role) where.role = role as Prisma.EnumPlatformRoleFilter["equals"];
    if (status) where.status = status as Prisma.EnumMemberStatusFilter["equals"];
    const [members, invites] = await Promise.all([
      prisma.platformMember.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { invitedBy: { select: { id: true, displayName: true, email: true } } },
      }),
      prisma.teamInvite.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        include: { invitedBy: { select: { id: true, displayName: true, email: true } } },
      }),
    ]);
    return Response.json({ members, invites });
  } catch (error) {
    return apiAuthError(error);
  }
}
