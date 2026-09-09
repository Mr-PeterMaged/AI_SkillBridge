import { requireAdminPage } from "@/lib/auth/admin";
import { PromoCodeManager } from "@/components/admin/promo-code-manager";

export default async function AdminPromosPage() {
  await requireAdminPage("promo.read");
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Promo Codes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, filter, pause, activate, archive, duplicate, and export promotional codes.
        </p>
      </div>
      <PromoCodeManager />
    </div>
  );
}
