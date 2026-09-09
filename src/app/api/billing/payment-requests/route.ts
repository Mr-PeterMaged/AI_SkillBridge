import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { checkRateLimit } from "@/lib/rate-limit";
import { createPaymentRequestSchema } from "@/lib/validation/billing";
import { createManualPaymentRequest, paymentMessage, whatsappUrl } from "@/lib/billing/manual-payments";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateCurrentUser();
  const requests = await prisma.manualPaymentRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      reference: true,
      selectedPlan: true,
      billingInterval: true,
      status: true,
      originalAmount: true,
      discountAmount: true,
      finalAmount: true,
      currency: true,
      promoCodeSnapshot: true,
      createdAt: true,
      submittedAt: true,
      reviewedAt: true,
      rejectionReason: true,
      expiresAt: true,
    },
  });

  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`payment-request:${userId}`, 5, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many payment requests. Please try again later." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = createPaymentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const user = await getOrCreateCurrentUser();
    const result = await createManualPaymentRequest({
      user: { id: user.id, email: user.email },
      plan: parsed.data.plan,
      promoCode: parsed.data.promoCode,
    });
    const message = paymentMessage({ request: result.request });

    return NextResponse.json(
      {
        request: result.request,
        reused: result.reused,
        paymentNumber: result.paymentNumber,
        message,
        whatsappUrl: whatsappUrl(result.paymentNumber, message.en),
      },
      { status: result.reused ? 200 : 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create payment request." },
      { status: 400 }
    );
  }
}
