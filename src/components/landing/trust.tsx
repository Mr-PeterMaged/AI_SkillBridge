import { ShieldCheck, Trash2, ScrollText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    title: "Your CV is private",
    body: "It's used only to generate your personal analysis — never to train a public model.",
  },
  {
    icon: Trash2,
    title: "You control your data",
    body: "Delete any analysis, or your account's data entirely, at any time from your dashboard.",
  },
  {
    icon: ScrollText,
    title: "Guidance, not a verdict",
    body: "SkillBridge AI provides career guidance and preparation indicators — never a hiring decision.",
  },
];

export function TrustAndCta() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="flex gap-3">
              <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-primary/[0.06] to-transparent p-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Know exactly what to learn for the role you want.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            بطل تاخد كورسات عشوائية — اعرف بالضبط إيه الناقص عليك للوظيفة اللي عايزها.
          </p>
          <Button size="lg" className="mt-6 gap-2" asChild>
            <Link href="/sign-up">
              Get My Free Skill Gap Snapshot <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
