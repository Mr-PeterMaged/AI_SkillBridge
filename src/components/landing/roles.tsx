import { ROLE_LIST } from "@/lib/roles";
import { Badge } from "@/components/ui/badge";

export function SupportedRoles() {
  return (
    <section id="roles" className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Supported roles</h2>
          <p className="mt-3 text-muted-foreground">
            We start narrow and go deep — each role has a hand-curated skill rubric, not a generic keyword list.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {ROLE_LIST.map((role) => (
            <div key={role.id} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">{role.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {role.skills
                  .filter((s) => s.priority === "critical")
                  .slice(0, 5)
                  .map((s) => (
                    <Badge key={s.canonicalName} variant="secondary" className="font-normal">
                      {s.canonicalName}
                    </Badge>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
