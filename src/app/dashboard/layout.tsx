import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BriefcaseBusiness, ClipboardCheck, Plus, Settings, WalletCards } from "lucide-react";
import { getCurrentPlatformMember } from "@/lib/auth/admin";
import { hasPermission, roleLabel } from "@/lib/auth/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const member = await getCurrentPlatformMember().catch(() => null);
  const showAdmin = member?.status === "ACTIVE" && hasPermission(member.role, "admin.dashboard.view");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              S
            </span>
            <span>SkillBridge AI</span>
          </Link>

          <div className="flex items-center gap-3">
            {showAdmin && (
              <>
                <Button size="sm" variant="ghost" className="hidden gap-1.5 lg:inline-flex" asChild>
                  <Link href="/dashboard/admin">Admin</Link>
                </Button>
                <span className="hidden rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:inline-flex">
                  {roleLabel(member.role)}
                </span>
              </>
            )}
            <Button size="sm" variant="ghost" className="hidden gap-1.5 sm:inline-flex" asChild>
              <Link href="/dashboard/quizzes">
                <ClipboardCheck className="h-4 w-4" /> Quizzes
              </Link>
            </Button>
            <Button size="sm" variant="ghost" className="hidden gap-1.5 md:inline-flex" asChild>
              <Link href="/dashboard/applications">
                <BriefcaseBusiness className="h-4 w-4" /> Applications
              </Link>
            </Button>
            <Button size="sm" variant="ghost" className="hidden gap-1.5 md:inline-flex" asChild>
              <Link href="/dashboard/billing">
                <WalletCards className="h-4 w-4" /> Billing
              </Link>
            </Button>
            <Button size="sm" className="gap-1.5" asChild>
              <Link href="/dashboard/analysis/new">
                <Plus className="h-4 w-4" /> New Analysis
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild>
              <Link href="/dashboard/settings" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
