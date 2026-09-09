import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  DRAFT: "Draft",
  EXTRACTING: "Analyzing…",
  AWAITING_REVIEW: "Needs review",
  SCORED: "Scored",
  ROADMAP_READY: "Roadmap ready",
  FAILED: "Failed",
};

const CLASSES: Record<string, string> = {
  DRAFT: "bg-secondary text-secondary-foreground",
  EXTRACTING: "bg-ai/15 text-ai",
  AWAITING_REVIEW: "bg-partial/20 text-partial-foreground",
  SCORED: "bg-matched/15 text-matched",
  ROADMAP_READY: "bg-ai text-ai-foreground",
  FAILED: "bg-critical/15 text-critical",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={CLASSES[status] ?? "bg-secondary text-secondary-foreground"}>
      {LABELS[status] ?? status}
    </Badge>
  );
}
