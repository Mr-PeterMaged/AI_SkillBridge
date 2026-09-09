import "server-only";
import type { MemberStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  assertCanManageMember,
  assertNotLastActiveOwner,
  requirePermission,
  safeMemberSnapshot,
} from "@/lib/auth/admin";
import type { Permission } from "@/lib/auth/permissions";
import { writeAdminAudit } from "@/lib/admin/audit";

export async function updateMemberStatus(params: {
  memberId: string;
  status: MemberStatus;
  permission: Permission;
  action: string;
  reason?: string | null;
}) {
  const actor = await requirePermission(params.permission);
  const target = await prisma.platformMember.findUnique({ where: { id: params.memberId } });
  if (!target) return Response.json({ error: "Not found" }, { status: 404 });
  assertCanManageMember(actor, target);
  await assertNotLastActiveOwner(target);

  const now = new Date();
  const updated = await prisma.platformMember.update({
    where: { id: params.memberId },
    data: {
      status: params.status,
      suspendedAt: params.status === "SUSPENDED" ? now : params.status === "ACTIVE" ? null : undefined,
      removedAt: params.status === "REMOVED" ? now : params.status === "ACTIVE" ? null : undefined,
    },
  });
  await writeAdminAudit({
    actorMemberId: actor.id,
    targetMemberId: target.id,
    action: params.action,
    entityType: "PlatformMember",
    entityId: target.id,
    before: safeMemberSnapshot(target),
    after: safeMemberSnapshot(updated),
    metadata: params.reason ? { reason: params.reason } : undefined,
  });
  return Response.json({ member: updated });
}
