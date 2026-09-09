import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { apiAuthError, requirePermission } from "@/lib/auth/admin";
import { adminPaymentQuerySchema } from "@/lib/validation/billing";

export async function GET(req: NextRequest) {
  try {
    await requirePermission("payment_request.read");
    const url = new URL(req.url);
    const parsed = adminPaymentQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) {
      return Response.json({ error: "Invalid filters", issues: parsed.error.flatten() }, { status: 400 });
    }

    const where = buildWhere(parsed.data);
    const [items, total] = await Promise.all([
      prisma.manualPaymentRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: parsed.data.take,
        skip: parsed.data.skip,
        include: {
          user: { select: { id: true, email: true, name: true } },
          reviewedBy: { select: { id: true, email: true, displayName: true, role: true } },
          promoCode: { select: { id: true, code: true } },
          subscription: { select: { id: true, status: true, currentPeriodEnd: true } },
        },
      }),
      prisma.manualPaymentRequest.count({ where }),
    ]);

    return Response.json({ items, total });
  } catch (error) {
    return apiAuthError(error);
  }
}

function buildWhere(input: z.infer<typeof adminPaymentQuerySchema>): Prisma.ManualPaymentRequestWhereInput {
  const where: Prisma.ManualPaymentRequestWhereInput = {};

  if (input.status && input.status !== "all") where.status = input.status as Prisma.EnumManualPaymentStatusFilter["equals"];
  if (input.plan && input.plan !== "all") where.selectedPlan = input.plan as Prisma.EnumPlanFilter["equals"];
  if (input.promoCode) {
    where.promoCode = { code: { contains: input.promoCode.trim().toUpperCase(), mode: "insensitive" } };
  }
  if (input.pending === "true") where.status = { in: ["PENDING_PAYMENT", "UNDER_REVIEW"] };
  if (input.expiringSoon === "true") {
    where.expiresAt = { gte: new Date(), lte: new Date(Date.now() + 24 * 60 * 60 * 1000) };
  }
  if (input.dateFrom || input.dateTo) {
    where.createdAt = {
      gte: input.dateFrom ? new Date(input.dateFrom) : undefined,
      lte: input.dateTo ? new Date(input.dateTo) : undefined,
    };
  }

  return where;
}
