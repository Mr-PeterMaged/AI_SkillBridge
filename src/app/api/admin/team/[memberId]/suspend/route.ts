import { apiAuthError } from "@/lib/auth/admin";
import { updateMemberStatus } from "@/lib/admin/member-actions";
import { memberReasonSchema } from "@/lib/validation/admin";

export async function POST(req: Request, ctx: { params: Promise<{ memberId: string }> }) {
  try {
    const { memberId } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const parsed = memberReasonSchema.safeParse(body ?? {});
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    return updateMemberStatus({
      memberId,
      status: "SUSPENDED",
      permission: "team.suspend",
      action: "TEAM_MEMBER_SUSPENDED",
      reason: parsed.data.reason,
    });
  } catch (error) {
    return apiAuthError(error);
  }
}
