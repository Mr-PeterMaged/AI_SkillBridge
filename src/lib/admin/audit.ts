import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function writeAdminAudit(params: {
  actorMemberId?: string | null;
  targetMemberId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
}) {
  const adminLog = prisma.adminAuditLog.create({
    data: {
      actorMemberId: params.actorMemberId ?? null,
      targetMemberId: params.targetMemberId ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      before: jsonOrNull(params.before),
      after: jsonOrNull(params.after),
      metadata: jsonOrNull(params.metadata),
    },
  });

  const promoLog =
    params.entityType.startsWith("Promo") ||
    ["Ambassador", "ReferralAttribution"].includes(params.entityType)
      ? prisma.promoAuditLog.create({
          data: {
            adminUserId: params.actorMemberId ?? null,
            action: params.action,
            entityType: params.entityType,
            entityId: params.entityId ?? null,
            before: jsonOrNull(params.before),
            after: jsonOrNull(params.after),
          },
        })
      : null;

  if (promoLog) {
    await prisma.$transaction([adminLog, promoLog]);
    return;
  }

  await adminLog;
}

function jsonOrNull(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}
