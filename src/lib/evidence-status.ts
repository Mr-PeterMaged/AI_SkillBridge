import { RoadmapTaskDTO, EvidenceItemDTO } from "@/lib/types/analysis";

export type EvidenceStatus = "NOT_STARTED" | "LEARNING" | "COMPLETED" | "EVIDENCE_ADDED" | "READY_FOR_REASSESSMENT";

/**
 * Computed, never stored — derived fresh from the task's own status and any
 * linked EvidenceItem rows, so it can never drift out of sync with them.
 */
export function evidenceStatusForTask(task: RoadmapTaskDTO, evidenceItems: EvidenceItemDTO[]): EvidenceStatus {
  const linked = evidenceItems.filter((e) => e.roadmapTaskId === task.id);
  const hasProvenSkills = linked.some((e) => e.provesSkills.length > 0);
  if (hasProvenSkills) return "READY_FOR_REASSESSMENT";
  if (linked.length > 0) return "EVIDENCE_ADDED";
  if (task.status === "COMPLETE") return "COMPLETED";
  if (task.status === "IN_PROGRESS") return "LEARNING";
  return "NOT_STARTED";
}

export const EVIDENCE_STATUS_LABEL: Record<EvidenceStatus, string> = {
  NOT_STARTED: "Not started",
  LEARNING: "Learning",
  COMPLETED: "Completed",
  EVIDENCE_ADDED: "Evidence added",
  READY_FOR_REASSESSMENT: "Ready for reassessment",
};

export const EVIDENCE_STATUS_CLASS: Record<EvidenceStatus, string> = {
  NOT_STARTED: "bg-muted text-muted-foreground",
  LEARNING: "bg-partial/20 text-partial-foreground",
  COMPLETED: "bg-matched/15 text-matched",
  EVIDENCE_ADDED: "bg-ai/15 text-ai",
  READY_FOR_REASSESSMENT: "bg-primary/15 text-primary",
};
