import Link from "next/link";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,_transparent_65%)]"
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <Badge variant="secondary" className="mb-5 gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            Built for students &amp; fresh graduates in Egypt &amp; MENA
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Stop taking random courses. Build the skills your target role actually needs.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
            Upload your CV and a real job description. SkillBridge AI shows exactly which skills you
            already prove, which gaps matter most, and gives you a 4-week roadmap with portfolio
            evidence to close them — not just a list of missing keywords.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/sign-up">
                Analyze My Skills <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#how-it-works">See how it works</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free to try · No credit card required · Your CV stays private
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <ScoreCardPreview />
        </div>
      </div>
    </section>
  );
}

function ScoreCardPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Junior Frontend Developer</p>
          <p className="text-sm font-semibold">Readiness Snapshot</p>
        </div>
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Preview</Badge>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <span className="text-5xl font-bold tabular-nums">62%</span>
        <span className="mb-1.5 text-sm text-muted-foreground">ready for this role</span>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: "62%" }} />
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2">
          <span className="font-medium text-success-foreground/80">React, JavaScript, Git</span>
          <span className="text-xs font-medium text-success-foreground/70">Matched</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-destructive/10 px-3 py-2">
          <span className="font-medium">TypeScript, Testing</span>
          <span className="text-xs font-medium text-destructive">Critical gap</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-warning/15 px-3 py-2">
          <span className="font-medium">Deployment</span>
          <span className="text-xs font-medium text-warning-foreground/80">Important gap</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
        <Code2 className="h-4 w-4 shrink-0" />
        Next step: build a typed React project with tests and a live deploy link.
      </div>
    </div>
  );
}
