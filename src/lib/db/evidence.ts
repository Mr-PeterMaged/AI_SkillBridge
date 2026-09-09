import "server-only";
import { prisma } from "./prisma";
import { getOwnedAnalysis } from "./analysis";

/**
 * Loads an EvidenceItem scoped to BOTH the given analysis id AND the
 * currently authenticated user (via getOwnedAnalysis). Returns null if the
 * analysis isn't owned by the caller, or the evidence item doesn't belong
 * to that analysis — callers must treat both as 404, never leaking existence.
 */
export async function getOwnedEvidenceItem(analysisId: string, evidenceId: string) {
  const { analysis } = await getOwnedAnalysis(analysisId);
  if (!analysis) return { analysis: null, evidence: null };

  const evidence = await prisma.evidenceItem.findFirst({
    where: { id: evidenceId, analysisId },
  });
  return { analysis, evidence };
}
