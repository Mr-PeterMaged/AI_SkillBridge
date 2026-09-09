import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  DRAFT: "Draft",
  EXTRACTING: "Analyzing…",
  AWAITING_REVIEW: "Needs review",
  SCORED: "Scored",
  ROADMAP_READY: "Roadmap ready",
  FAILED: "Failed",
};

export function StatusBadge({ status }: { status: string }) {
  const variant = status === "FAILED" ? "destructive" : status === "ROADMAP_READY" ? "default" : "secondary";
  return <Badge variant={variant}>{LABELS[status] ?? status}</Badge>;
}
