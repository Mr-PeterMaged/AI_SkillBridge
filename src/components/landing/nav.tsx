import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            S
          </span>
          <span>SkillBridge AI</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#how-it-works" className="hover:text-foreground">How it works</Link>
          <Link href="/#roles" className="hover:text-foreground">Roles</Link>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Show when="signed-out">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up?redirect_url=/dashboard/analysis/new">Analyze My Skills</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
