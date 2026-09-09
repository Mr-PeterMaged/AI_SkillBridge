import { apiAuthError } from "@/lib/auth/admin";
import { updateMemberStatus } from "@/lib/admin/member-actions";

export async function POST(_req: Request, ctx: { params: Promise<{ memberId: string }> }) {
  try {
    const { memberId } = await ctx.params;
    return updateMemberStatus({
      memberId,
      status: "ACTIVE",
      permission: "team.suspend",
      action: "TEAM_MEMBER_REACTIVATED",
    });
  } catch (error) {
    return apiAuthError(error);
  }
}
