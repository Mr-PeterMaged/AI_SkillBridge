import { AdminAuthError, apiAuthError, requirePermission } from "@/lib/auth/admin";
import { approvePaymentRequest } from "@/lib/billing/manual-payments";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const member = await requirePermission("payment_request.approve");
    const { id } = await ctx.params;
    const result = await approvePaymentRequest({ requestId: id, actorMemberId: member.id });
    return Response.json(result);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return apiAuthError(error);
    }
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return apiAuthError(error);
  }
}
