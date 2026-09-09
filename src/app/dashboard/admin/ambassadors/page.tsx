import { requireAdminPage } from "@/lib/auth/admin";
import { AmbassadorManager } from "@/components/admin/ambassador-manager";

export default async function AdminAmbassadorsPage() {
  await requireAdminPage("ambassador.read");
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Ambassadors</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create ambassadors, generate referral URLs, copy share text, and monitor performance.
        </p>
      </div>
      <AmbassadorManager />
    </div>
  );
}
