import "server-only";
import { prisma } from "./prisma";
import { getOrCreateCurrentUser } from "./users";

/**
 * Loads an Analysis by id, scoped to the currently authenticated user.
 * Returns null if it doesn't exist OR belongs to someone else — callers
 * must treat both cases identically (404), never leaking existence.
 */
export async function getOwnedAnalysis(analysisId: string) {
  const user = await getOrCreateCurrentUser();
  const analysis = await prisma.analysis.findFirst({
    where: { id: analysisId, userId: user.id },
  });
  return { user, analysis };
}
