import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateCurrentUser } from "@/lib/db/users";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkoutQuoteSchema } from "@/lib/validation/billing";
import { buildCheckoutQuote } from "@/lib/billing/promos";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`billing-quote:${userId}`, 30, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many promo checks. Please try again later." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = checkoutQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const user = await getOrCreateCurrentUser();
    const quote = await buildCheckoutQuote({
      userId: user.id,
      plan: parsed.data.plan,
      promoCode: parsed.data.promoCode,
    });

    return NextResponse.json({
      quote: {
        plan: quote.plan,
        originalAmount: quote.originalAmount,
        discountAmount: quote.discountAmount,
        finalAmount: quote.finalAmount,
        currency: quote.currency,
        promoCode: quote.promoCode,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "This promo code cannot be applied." },
      { status: 400 }
    );
  }
}
