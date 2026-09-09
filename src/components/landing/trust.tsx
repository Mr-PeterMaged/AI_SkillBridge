import { ShieldCheck, Trash2, ScrollText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { POSITIONING_COPY, textDirection } from "@/lib/i18n/config";

const points = [
  {
    icon: ShieldCheck,
    title: "Your CV is private",
    body: "It's used only to generate your personal analysis - never to train a public model.",
  },
  {
    icon: Trash2,
    title: "You control your data",
    body: "Delete any analysis, or your account's data entirely, at any time from your dashboard.",
  },
  {
    icon: ScrollText,
    title: "Guidance, not a verdict",
    body: "SkillBridge AI provides career guidance and preparation indicators - never a hiring decision.",
  },
];

export function TrustAndCta() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <StaggerGroup className="grid gap-6 sm:grid-cols-3">
          {points.map((p) => (
            <StaggerItem key={p.title}>
              <div className="flex h-full gap-3.5 rounded-2xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal
          delay={0.15}
          className="mt-16 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.08] via-ai/[0.05] to-transparent p-10 text-center sm:p-14"
        >
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Know exactly what to learn for the role you want.
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-muted-foreground"
            dir={textDirection("ar")}
            lang="ar"
          >
            {POSITIONING_COPY.ar}
          </p>
          <Button size="lg" className="mt-7 gap-2 shadow-lg shadow-primary/20" asChild>
            <Link href="/sign-up">
              Get My Free Skill Gap Snapshot <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
