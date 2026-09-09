import { requireOwner, apiAuthError, safeMemberSnapshot } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { transferOwnershipSchema } from "@/lib/validation/admin";

export async function POST(req: Request) {
  try {
    const owner = await requireOwner();
    const body = await req.json().catch(() => null);
    const parsed = transferOwnershipSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    if (parsed.data.targetMemberId === owner.id) {
      return Response.json({ error: "You already own the platform." }, { status: 400 });
    }

    const target = await prisma.platformMember.findUnique({ where: { id: parsed.data.targetMemberId } });
    if (!target || target.status !== "ACTIVE" || target.role !== "ADMIN" || !target.email) {
      return Response.json({ error: "Ownership can only transfer to an active admin with a verified email." }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const newOwner = await tx.platformMember.update({
        where: { id: target.id },
        data: { role: "OWNER", lastRoleChangedAt: new Date() },
      });
      const previousOwner = await tx.platformMember.update({
        where: { id: owner.id },
        data: { role: parsed.data.previousOwnerRole, lastRoleChangedAt: new Date() },
      });
      await tx.adminAuditLog.create({
        data: {
          actorMemberId: owner.id,
          targetMemberId: target.id,
          action: "OWNERSHIP_TRANSFERRED",
          entityType: "PlatformMember",
          entityId: target.id,
          before: {
            previousOwner: safeMemberSnapshot(owner),
            newOwner: safeMemberSnapshot(target),
          },
          after: {
            previousOwner: safeMemberSnapshot(previousOwner),
            newOwner: safeMemberSnapshot(newOwner),
          },
        },
      });
      return { previousOwner, newOwner };
    });

    return Response.json({ result });
  } catch (error) {
    return apiAuthError(error);
  }
}
