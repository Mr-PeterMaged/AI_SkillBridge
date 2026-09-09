import { Skeleton } from "@/components/ui/skeleton";

export function AnalysisSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-2xl border border-border bg-card p-8">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-9 w-3/4" />
        <Skeleton className="mt-4 h-3 w-full max-w-md" />
        <Skeleton className="mt-6 h-3 w-full rounded-full" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
