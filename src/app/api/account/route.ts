import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

/**
 * Deletes all app data for the current user (cascades to every Analysis and
 * its children via onDelete: Cascade) and their Clerk account. Irreversible.
 */
export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.deleteMany({ where: { clerkUserId: userId } });

  const client = await clerkClient();
  await client.users.deleteUser(userId);

  return NextResponse.json({ ok: true });
}
