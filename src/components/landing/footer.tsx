import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SkillBridge AI</p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/sign-up" className="hover:text-foreground">Get started</Link>
        </div>
      </div>
      <p className="mt-6 max-w-3xl text-xs text-muted-foreground">
        SkillBridge AI provides educational career guidance. It does not guarantee employment, interviews, or
        hiring outcomes, and the readiness score is a preparation indicator — not a hiring decision or a measure
        of a person&apos;s worth.
      </p>
    </footer>
  );
}
