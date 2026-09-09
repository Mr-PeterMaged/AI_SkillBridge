import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";
import { SkillGapDTO } from "@/lib/types/analysis";

const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: "border-destructive/30 bg-destructive/[0.04]",
  IMPORTANT: "border-warning/40 bg-warning/[0.06]",
  NICE_TO_HAVE: "border-border bg-muted/30",
};

const PRIORITY_LABEL: Record<string, string> = {
  CRITICAL: "Critical",
  IMPORTANT: "Important",
  NICE_TO_HAVE: "Nice to have",
};

const PRIORITY_BADGE: Record<string, string> = {
  CRITICAL: "bg-destructive text-destructive-foreground",
  IMPORTANT: "bg-warning text-warning-foreground",
  NICE_TO_HAVE: "bg-secondary text-secondary-foreground",
};

export function GapCard({ gap }: { gap: SkillGapDTO }) {
  return (
    <div className={`rounded-xl border p-4 ${PRIORITY_STYLES[gap.priority]}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{gap.skillName}</span>
        <Badge className={PRIORITY_BADGE[gap.priority]}>{PRIORITY_LABEL[gap.priority]}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{gap.reason}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> ~{gap.estimatedHours}h to build proof
        </span>
        <span className="flex items-center gap-1">
          <Target className="h-3.5 w-3.5" /> {gap.suggestedProof}
        </span>
      </div>
    </div>
  );
}
