import { NextRequest } from "next/server";
import { AdminAuthError, apiAuthError, requirePermission } from "@/lib/auth/admin";
import { reviewPaymentRequest } from "@/lib/billing/manual-payments";
import { reviewPaymentSchema } from "@/lib/validation/billing";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const member = await requirePermission("payment_request.reject");
    const body = await req.json().catch(() => null);
    const parsed = reviewPaymentSchema.safeParse(body);
    if (!parsed.success || !parsed.data.rejectionReason) {
      return Response.json({ error: "Choose a rejection reason." }, { status: 400 });
    }
    const { id } = await ctx.params;
    const request = await reviewPaymentRequest({
      requestId: id,
      actorMemberId: member.id,
      status: "REJECTED",
      rejectionReason: parsed.data.rejectionReason,
      adminNotes: parsed.data.adminNotes,
    });
    return Response.json({ request });
  } catch (error) {
    if (error instanceof AdminAuthError) return apiAuthError(error);
    if (error instanceof Error) return Response.json({ error: error.message }, { status: 400 });
    return apiAuthError(error);
  }
}
