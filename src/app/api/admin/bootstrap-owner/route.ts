import { getCurrentPlatformMember, apiAuthError } from "@/lib/auth/admin";

export async function POST() {
  try {
    const member = await getCurrentPlatformMember();
    if (member.role !== "OWNER" || member.status !== "ACTIVE") {
      return Response.json({ ok: false, role: member.role, status: member.status }, { status: 403 });
    }
    return Response.json({ ok: true, role: member.role, status: member.status });
  } catch (error) {
    return apiAuthError(error);
  }
}
