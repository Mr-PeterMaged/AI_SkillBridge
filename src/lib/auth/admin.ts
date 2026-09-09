import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { PlatformMember, PlatformRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import {
  Permission,
  canManageMember,
  hasPermission,
  ROLE_ORDER,
} from "@/lib/auth/permissions";

export class AdminAuthError extends Error {
  constructor(
    public status: 401 | 403 | 404,
    message = status === 401 ? "Unauthorized" : "Forbidden"
  ) {
    super(message);
  }
}

export async function requireAuthenticatedUser() {
  const session = await auth();
  if (!session.userId) throw new AdminAuthError(401, "Unauthorized");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new AdminAuthError(401, "Unauthorized");

  return { clerkUserId: session.userId, clerkUser };
}

export async function getCurrentPlatformMember() {
  const { clerkUserId, clerkUser } = await requireAuthenticatedUser();
  const verifiedEmail = getVerifiedPrimaryEmail(clerkUser);
  const displayName = clerkUser.fullName ?? clerkUser.firstName ?? null;

  const existing = await prisma.platformMember.findUnique({ where: { clerkUserId } });
  if (existing) {
    if (existing.email !== verifiedEmail || existing.displayName !== displayName) {
      return prisma.platformMember.update({
        where: { id: existing.id },
        data: { email: verifiedEmail, displayName },
      });
    }
    return existing;
  }

  const ownerCount = await prisma.platformMember.count({
    where: { role: "OWNER", status: "ACTIVE" },
  });
  const initialOwnerEmail = process.env.INITIAL_OWNER_EMAIL?.trim().toLowerCase();
  const shouldBootstrapOwner =
    ownerCount === 0 && Boolean(initialOwnerEmail) && verifiedEmail?.toLowerCase() === initialOwnerEmail;

  const member = await prisma.platformMember.create({
    data: {
      clerkUserId,
      email: verifiedEmail,
      displayName,
      role: shouldBootstrapOwner ? "OWNER" : "USER",
      status: "ACTIVE",
      joinedAt: new Date(),
      lastRoleChangedAt: shouldBootstrapOwner ? new Date() : null,
    },
  });

  if (shouldBootstrapOwner) {
    await prisma.adminAuditLog.create({
      data: {
        actorMemberId: member.id,
        targetMemberId: member.id,
        action: "OWNER_BOOTSTRAPPED",
        entityType: "PlatformMember",
        entityId: member.id,
        after: safeMemberSnapshot(member),
      },
    });
  }

  return member;
}

export async function requirePermission(permission: Permission) {
  const member = await getCurrentPlatformMember();
  if (member.status !== "ACTIVE" || !hasPermission(member.role, permission)) {
    throw new AdminAuthError(403, "Forbidden");
  }
  return member;
}

export async function requireAdmin() {
  return requirePermission("admin.dashboard.view");
}

export async function requireRole(...roles: PlatformRole[]) {
  const member = await getCurrentPlatformMember();
  if (member.status !== "ACTIVE" || !roles.includes(member.role)) {
    throw new AdminAuthError(403, "Forbidden");
  }
  return member;
}

export async function requireOwner() {
  return requireRole("OWNER");
}

export async function requireAdminPage(permission: Permission = "admin.dashboard.view") {
  try {
    return await requirePermission(permission);
  } catch {
    notFound();
  }
}

export function assertCanManageMember(actor: PlatformMember, target: PlatformMember) {
  if (actor.id === target.id) throw new AdminAuthError(403, "You cannot change your own access.");
  if (!canManageMember(actor.role, target.role)) {
    throw new AdminAuthError(403, "You cannot manage a member with this role.");
  }
}

export async function assertNotLastActiveOwner(target: PlatformMember) {
  if (target.role !== "OWNER" || target.status !== "ACTIVE") return;
  const ownerCount = await prisma.platformMember.count({ where: { role: "OWNER", status: "ACTIVE" } });
  if (ownerCount <= 1) throw new AdminAuthError(403, "The platform must keep at least one active owner.");
}

export function safeMemberSnapshot(member: PlatformMember) {
  return {
    id: member.id,
    clerkUserId: member.clerkUserId,
    email: member.email,
    displayName: member.displayName,
    role: member.role,
    status: member.status,
    invitedByMemberId: member.invitedByMemberId,
    invitedAt: member.invitedAt,
    joinedAt: member.joinedAt,
    suspendedAt: member.suspendedAt,
    removedAt: member.removedAt,
    lastRoleChangedAt: member.lastRoleChangedAt,
  };
}

export function getVerifiedPrimaryEmail(clerkUser: Awaited<ReturnType<typeof currentUser>>) {
  const primary = clerkUser?.primaryEmailAddress;
  if (!primary?.emailAddress) return null;
  if (primary.verification?.status && primary.verification.status !== "verified") return null;
  return primary.emailAddress.toLowerCase();
}

export function apiAuthError(error: unknown) {
  if (error instanceof AdminAuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  return Response.json({ error: "Something went wrong." }, { status: 500 });
}

export function canChangeRole(actorRole: PlatformRole, targetRole: PlatformRole, nextRole: PlatformRole) {
  if (nextRole === "OWNER" || nextRole === "USER") return false;
  return ROLE_ORDER[nextRole] < ROLE_ORDER[actorRole] && ROLE_ORDER[targetRole] < ROLE_ORDER[actorRole];
}
