import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const before = [
  "Random courses with no clear order or goal",
  "Generic \"add more keywords\" CV feedback",
  "No idea which gaps actually matter for the role",
  "Certificates with no project to back them up",
];

const after = [
  "A readiness score tied to a real job description",
  "Skill gaps ranked critical → important → nice-to-have",
  "A 4-week roadmap with concrete weekly deliverables",
  "Portfolio evidence — GitHub repos and demo links — for every skill",
];

export function BeforeAfter() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
            The difference
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Most tools tell you which keywords are missing.
          </h2>
          <p className="mt-3 text-muted-foreground">
            SkillBridge tells you what to learn, what to build, and how to prove it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <h3 className="text-sm font-semibold text-muted-foreground">Before SkillBridge</h3>
            <ul className="mt-4 space-y-3.5">
              {before.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-critical/10">
                    <X className="h-3 w-3 text-critical" />
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-6 shadow-sm shadow-primary/5 sm:p-7">
            <h3 className="text-sm font-semibold text-primary">With SkillBridge</h3>
            <ul className="mt-4 space-y-3.5">
              {after.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-matched/15">
                    <Check className="h-3 w-3 text-matched" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
