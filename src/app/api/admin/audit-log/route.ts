import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    await requirePermission("audit.read");
    const url = new URL(req.url);
    const entityType = url.searchParams.get("entityType");
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    const where: Prisma.AdminAuditLogWhereInput = {};
    if (entityType) where.entityType = entityType;
    if (start || end) where.createdAt = { gte: start ? new Date(start) : undefined, lte: end ? new Date(end) : undefined };
    const take = Math.min(Number(url.searchParams.get("take") ?? 50), 100);
    const skip = Math.max(Number(url.searchParams.get("skip") ?? 0), 0);
    const [auditLogs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          actor: { select: { id: true, displayName: true, email: true, role: true } },
          targetMember: { select: { id: true, displayName: true, email: true, role: true } },
        },
      }),
      prisma.adminAuditLog.count({ where }),
    ]);
    return Response.json({ auditLogs, total });
  } catch (error) {
    return apiAuthError(error);
  }
}
