import "server-only";
import { randomBytes } from "crypto";
import type { ManualPaymentRequest, Plan } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { writeAdminAudit } from "@/lib/admin/audit";
import { getPlan, type PlanCode, formatEgp } from "@/lib/config/pricing";
import { buildCheckoutQuote } from "@/lib/billing/promos";

export const PAYMENT_REQUEST_PENDING_WINDOW_MS = 24 * 60 * 60 * 1000;

export function getConfiguredInstaPayNumber() {
  return process.env.INSTAPAY_PAYMENT_NUMBER?.trim() || null;
}

export function makePaymentReference(now = new Date()) {
  const date = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("");
  return `SB-PAY-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function createManualPaymentRequest(params: {
  user: { id: string; email: string };
  plan: PlanCode;
  promoCode?: string | null;
}) {
  const paymentNumber = getConfiguredInstaPayNumber();
  if (!paymentNumber) {
    throw new Error("Manual payments are not configured yet.");
  }

  const planConfig = getPlan(params.plan);
  if (!planConfig.paid) throw new Error("This plan does not require payment.");

  const cutoff = new Date(Date.now() - PAYMENT_REQUEST_PENDING_WINDOW_MS);
  const duplicate = await prisma.manualPaymentRequest.findFirst({
    where: {
      userId: params.user.id,
      selectedPlan: params.plan,
      status: { in: ["PENDING_PAYMENT", "UNDER_REVIEW"] },
      createdAt: { gte: cutoff },
    },
    orderBy: { createdAt: "desc" },
  });
  if (duplicate) {
    return { request: duplicate, reused: true, paymentNumber };
  }

  const quote = await buildCheckoutQuote({
    userId: params.user.id,
    plan: params.plan,
    promoCode: params.promoCode,
  });

  const expiresAt = new Date(Date.now() + PAYMENT_REQUEST_PENDING_WINDOW_MS);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const request = await prisma.manualPaymentRequest.create({
        data: {
          reference: makePaymentReference(),
          userId: params.user.id,
          selectedPlan: params.plan,
          billingInterval: planConfig.billingInterval,
          originalAmount: quote.originalAmount,
          discountAmount: quote.discountAmount,
          finalAmount: quote.finalAmount,
          currency: quote.currency,
          promoCodeId: quote.promoCodeId,
          promoCodeSnapshot: quote.promoCodeSnapshot ?? Prisma.JsonNull,
          userEmailSnapshot: params.user.email,
          expiresAt,
        },
      });
      return { request, reused: false, paymentNumber };
    } catch (error) {
      if (!isUniqueConstraintError(error) || attempt === 4) throw error;
    }
  }

  throw new Error("Could not create a payment request.");
}

export async function approvePaymentRequest(params: {
  requestId: string;
  actorMemberId: string;
  activationDate?: Date;
}) {
  const activationDate = params.activationDate ?? new Date();

  return prisma.$transaction(async (tx) => {
    const request = await tx.manualPaymentRequest.findUnique({
      where: { id: params.requestId },
      include: { promoCode: true, subscription: true },
    });
    if (!request) throw new Error("Payment request not found.");
    if (request.status === "APPROVED") throw new Error("This payment request is already approved.");
    if (["REJECTED", "CANCELLED", "EXPIRED"].includes(request.status)) {
      throw new Error("This payment request must be reopened before it can be approved.");
    }
    if (request.subscription) throw new Error("This payment request already has an active subscription.");

    const periodEnd = subscriptionEndFor(request.selectedPlan, activationDate);
    const before = safePaymentSnapshot(request);

    await tx.subscription.updateMany({
      where: { userId: request.userId, status: "ACTIVE", plan: { not: "FREE" } },
      data: { status: "CANCELLED", currentPeriodEnd: activationDate },
    });

    const updatedRequest = await tx.manualPaymentRequest.update({
      where: { id: request.id },
      data: {
        status: "APPROVED",
        reviewedAt: activationDate,
        reviewedByMemberId: params.actorMemberId,
        submittedAt: request.submittedAt ?? activationDate,
      },
    });

    const subscription = await tx.subscription.create({
      data: {
        userId: request.userId,
        plan: request.selectedPlan,
        status: "ACTIVE",
        billingInterval: request.billingInterval,
        startedAt: activationDate,
        activatedAt: activationDate,
        activatedById: params.actorMemberId,
        currentPeriodEnd: periodEnd,
        manualPaymentId: request.id,
      },
    });

    await tx.user.update({ where: { id: request.userId }, data: { plan: request.selectedPlan } });

    if (request.promoCodeId) {
      await tx.promoCode.update({
        where: { id: request.promoCodeId },
        data: { redemptionCount: { increment: 1 } },
      });
      const redemption = await tx.promoRedemption.create({
        data: {
          promoCodeId: request.promoCodeId,
          campaignId: request.promoCode?.campaignId ?? null,
          ambassadorId: request.promoCode?.ambassadorId ?? null,
          userId: request.userId,
          plan: request.selectedPlan,
          discountTypeSnapshot: request.promoCode?.discountType ?? "FIXED_AMOUNT",
          discountAmountSnapshot: request.promoCode?.discountAmount ?? request.discountAmount,
          currencySnapshot: "EGP",
          grossAmountCents: request.originalAmount,
          discountAmountCents: request.discountAmount,
          netAmountCents: request.finalAmount,
          status: "REDEEMED",
          checkoutId: request.id,
          providerReference: request.reference,
        },
      });
      await tx.promoAuditLog.create({
        data: {
          adminUserId: params.actorMemberId,
          action: "PROMO_REDEMPTION_APPROVED",
          entityType: "PromoRedemption",
          entityId: redemption.id,
          after: {
            promoCodeId: request.promoCodeId,
            paymentRequestId: request.id,
            discountAmountCents: request.discountAmount,
            netAmountCents: request.finalAmount,
          },
        },
      });
    }

    await tx.adminAuditLog.create({
      data: {
        actorMemberId: params.actorMemberId,
        action: "PAYMENT_REQUEST_APPROVED",
        entityType: "ManualPaymentRequest",
        entityId: request.id,
        before: before as Prisma.InputJsonValue,
        after: {
          ...safePaymentSnapshot(updatedRequest),
          subscriptionId: subscription.id,
        },
        metadata: {
          subscriptionId: subscription.id,
          activatedPlan: request.selectedPlan,
          currentPeriodEnd: periodEnd?.toISOString() ?? null,
        },
      },
    });

    return { request: updatedRequest, subscription };
  });
}

export async function reviewPaymentRequest(params: {
  requestId: string;
  actorMemberId: string;
  status: "UNDER_REVIEW" | "REJECTED" | "CANCELLED";
  rejectionReason?: string | null;
  adminNotes?: string | null;
}) {
  const before = await prisma.manualPaymentRequest.findUnique({ where: { id: params.requestId } });
  if (!before) throw new Error("Payment request not found.");
  if (before.status === "APPROVED") throw new Error("Approved requests cannot be changed.");

  const updated = await prisma.manualPaymentRequest.update({
    where: { id: params.requestId },
    data: {
      status: params.status,
      reviewedAt: new Date(),
      reviewedByMemberId: params.actorMemberId,
      rejectionReason: params.rejectionReason ?? null,
      adminNotes: params.adminNotes ?? before.adminNotes,
    },
  });

  await writeAdminAudit({
    actorMemberId: params.actorMemberId,
    action: `PAYMENT_REQUEST_${params.status}`,
    entityType: "ManualPaymentRequest",
    entityId: updated.id,
    before: safePaymentSnapshot(before),
    after: safePaymentSnapshot(updated),
  });

  return updated;
}

export function subscriptionEndFor(plan: Plan, activationDate: Date) {
  if (plan === "JOB_SPRINT") {
    return new Date(activationDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
  const end = new Date(activationDate);
  end.setMonth(end.getMonth() + 1);
  return end;
}

export function paymentMessage(params: {
  request: Pick<
    ManualPaymentRequest,
    "reference" | "userEmailSnapshot" | "selectedPlan" | "finalAmount" | "promoCodeSnapshot"
  >;
}) {
  const plan = getPlan(params.request.selectedPlan as PlanCode);
  const promoCode = promoCodeFromSnapshot(params.request.promoCodeSnapshot);
  const finalAmount = formatEgp(params.request.finalAmount);

  return {
    en: `Hello SkillBridge AI,
I completed an InstaPay transfer for my subscription.

Payment Request ID: ${params.request.reference}
SkillBridge account email: ${params.request.userEmailSnapshot}
Selected plan: ${plan.name}
Final amount transferred: ${finalAmount}
Promo code used: ${promoCode}

I will send the transfer screenshot below.`,
    ar: `مرحبا SkillBridge AI،
تم تحويل قيمة الاشتراك عبر InstaPay.

رقم طلب الدفع: ${params.request.reference}
البريد الإلكتروني المسجل في SkillBridge: ${params.request.userEmailSnapshot}
الباقة المختارة: ${plan.name}
المبلغ المحول: ${finalAmount.replace(" EGP", " جنيه")}
كود الخصم المستخدم: ${promoCode}

سأرسل صورة التحويل بالأسفل.`,
  };
}

export function whatsappUrl(paymentNumber: string, message: string) {
  const phone = paymentNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function promoCodeFromSnapshot(snapshot: unknown) {
  if (snapshot && typeof snapshot === "object" && "code" in snapshot && typeof snapshot.code === "string") {
    return snapshot.code;
  }
  return "None";
}

function safePaymentSnapshot(request: ManualPaymentRequest) {
  return {
    id: request.id,
    reference: request.reference,
    userId: request.userId,
    selectedPlan: request.selectedPlan,
    billingInterval: request.billingInterval,
    status: request.status,
    originalAmount: request.originalAmount,
    discountAmount: request.discountAmount,
    finalAmount: request.finalAmount,
    currency: request.currency,
    promoCodeId: request.promoCodeId,
    userEmailSnapshot: request.userEmailSnapshot,
    reviewedByMemberId: request.reviewedByMemberId,
    reviewedAt: request.reviewedAt,
    rejectionReason: request.rejectionReason,
  };
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
