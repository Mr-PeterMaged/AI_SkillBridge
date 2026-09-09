import { requireAdminPage } from "@/lib/auth/admin";
import { PaymentRequestManager } from "@/components/admin/payment-request-manager";

export default async function AdminPaymentsPage() {
  await requireAdminPage("payment_request.read");
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Payment Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review manual InstaPay transfers, approve paid access, reject mismatches, and keep an audit trail.
        </p>
      </div>
      <PaymentRequestManager />
    </div>
  );
}
