import { requireAdminPage } from "@/lib/auth/admin";
import { TeamManager } from "@/components/admin/team-manager";

export default async function AdminTeamPage() {
  await requireAdminPage("team.read");
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Team & Access Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite trusted collaborators and control what they can access.
        </p>
      </div>
      <TeamManager />
    </div>
  );
}
