import Link from "next/link";
import { BarChart3, Megaphone, Tags, UsersRound, ReceiptText, ShieldCheck, ClipboardList, WalletCards } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/admin";
import { hasPermission, roleLabel } from "@/lib/auth/permissions";

const links = [
  { href: "/dashboard/admin", label: "Promotion Center", permission: "admin.dashboard.view", icon: Megaphone },
  { href: "/dashboard/admin/promos", label: "Promo Codes", permission: "promo.read", icon: Tags },
  { href: "/dashboard/admin/campaigns", label: "Campaigns", permission: "campaign.read", icon: BarChart3 },
  { href: "/dashboard/admin/ambassadors", label: "Ambassadors", permission: "ambassador.read", icon: UsersRound },
  { href: "/dashboard/admin/redemptions", label: "Redemptions", permission: "redemption.read_limited", icon: ReceiptText },
  { href: "/dashboard/admin/payments", label: "Payment Requests", permission: "payment_request.read", icon: WalletCards },
  { href: "/dashboard/admin/analytics", label: "Analytics", permission: "analytics.read", icon: BarChart3 },
  { href: "/dashboard/admin/team", label: "Team & Access", permission: "team.read", icon: ShieldCheck },
  { href: "/dashboard/admin/audit-log", label: "Audit Log", permission: "audit.read", icon: ClipboardList },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const member = await requireAdminPage();
  const visibleLinks = links.filter((link) => hasPermission(member.role, link.permission));

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-24 lg:self-start">
        <div className="px-3 py-2">
          <p className="text-xs font-medium uppercase text-muted-foreground">Admin</p>
          <p className="mt-1 text-sm font-semibold">{roleLabel(member.role)}</p>
        </div>
        <nav className="mt-2 space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
