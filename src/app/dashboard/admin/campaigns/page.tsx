import { requireAdminPage } from "@/lib/auth/admin";
import { CampaignManager } from "@/components/admin/campaign-manager";

export default async function AdminCampaignsPage() {
  await requireAdminPage("campaign.read");
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, pause, activate, archive, and inspect campaign performance.
        </p>
      </div>
      <CampaignManager />
    </div>
  );
}
