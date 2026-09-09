import { Check, X } from "lucide-react";

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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Most tools tell you which keywords are missing.
          </h2>
          <p className="mt-3 text-muted-foreground">
            SkillBridge tells you what to learn, what to build, and how to prove it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Before SkillBridge</h3>
            <ul className="mt-4 space-y-3">
              {before.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-6">
            <h3 className="text-sm font-semibold text-primary">With SkillBridge</h3>
            <ul className="mt-4 space-y-3">
              {after.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
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
