import "server-only";
import type { PromoStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requirePermission } from "@/lib/auth/admin";
import { writeAdminAudit } from "@/lib/admin/audit";
import type { Permission } from "@/lib/auth/permissions";

export async function updatePromoStatus(id: string, status: PromoStatus, permission: Permission, action: string) {
  const member = await requirePermission(permission);
  const before = await prisma.promoCode.findUnique({ where: { id } });
  if (!before) return Response.json({ error: "Not found" }, { status: 404 });
  const updated = await prisma.promoCode.update({ where: { id }, data: { status } });
  await writeAdminAudit({
    actorMemberId: member.id,
    action,
    entityType: "PromoCode",
    entityId: id,
    before,
    after: updated,
  });
  return Response.json({ promo: updated });
}
