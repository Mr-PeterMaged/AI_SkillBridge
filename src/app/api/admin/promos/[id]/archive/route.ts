import { apiAuthError } from "@/lib/auth/admin";
import { updatePromoStatus } from "@/lib/admin/promo-actions";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    return updatePromoStatus(id, "ARCHIVED", "promo.archive", "PROMO_CODE_ARCHIVED");
  } catch (error) {
    return apiAuthError(error);
  }
}
