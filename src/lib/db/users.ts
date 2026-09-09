import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Returns the app-level User row for the currently authenticated Clerk user,
 * creating it on first access ("lazy provisioning"). Throws if unauthenticated —
 * callers in protected routes/pages should let this throw and rely on
 * middleware to have already redirected unauthenticated visitors.
 */
export async function getOrCreateCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const existing = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? `${userId}@unknown.skillbridge.ai`;
  const name = clerkUser?.fullName ?? clerkUser?.firstName ?? null;

  return prisma.user.create({
    data: { clerkUserId: userId, email, name },
  });
}
