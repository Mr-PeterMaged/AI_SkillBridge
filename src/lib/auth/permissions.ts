import type { PlatformRole } from "@prisma/client";

export const ROLE_ORDER: Record<PlatformRole, number> = {
  USER: 0,
  VIEWER: 1,
  ANALYST: 2,
  SUPPORT_MANAGER: 3,
  MARKETING_MANAGER: 4,
  ADMIN: 5,
  OWNER: 6,
};

export const PERMISSIONS = [
  "admin.dashboard.view",
  "promo.read",
  "promo.create",
  "promo.update",
  "promo.pause",
  "promo.archive",
  "promo.export",
  "campaign.read",
  "campaign.create",
  "campaign.update",
  "campaign.archive",
  "ambassador.read",
  "ambassador.create",
  "ambassador.update",
  "ambassador.archive",
  "redemption.read_limited",
  "redemption.read_sensitive",
  "analytics.read",
  "analytics.export",
  "team.read",
  "team.invite",
  "team.update_role",
  "team.suspend",
  "team.remove",
  "ownership.transfer",
  "platform.settings.read",
  "platform.settings.update",
  "billing.settings.read",
  "billing.settings.update",
  "audit.read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const marketingPermissions = [
  "admin.dashboard.view",
  "promo.read",
  "promo.create",
  "promo.update",
  "promo.pause",
  "promo.archive",
  "promo.export",
  "campaign.read",
  "campaign.create",
  "campaign.update",
  "campaign.archive",
  "ambassador.read",
  "ambassador.create",
  "ambassador.update",
  "ambassador.archive",
  "redemption.read_limited",
  "analytics.read",
  "analytics.export",
] satisfies Permission[];

const supportPermissions = [
  "admin.dashboard.view",
  "promo.read",
  "campaign.read",
  "ambassador.read",
  "redemption.read_limited",
] satisfies Permission[];

const analystPermissions = [
  "admin.dashboard.view",
  "promo.read",
  "campaign.read",
  "ambassador.read",
  "redemption.read_limited",
  "analytics.read",
] satisfies Permission[];

const viewerPermissions = ["admin.dashboard.view", "analytics.read"] satisfies Permission[];

export const ROLE_PERMISSIONS: Record<PlatformRole, readonly Permission[]> = {
  OWNER: PERMISSIONS,
  ADMIN: PERMISSIONS.filter(
    (permission) =>
      permission !== "ownership.transfer" &&
      permission !== "billing.settings.update" &&
      permission !== "platform.settings.update"
  ),
  MARKETING_MANAGER: marketingPermissions,
  SUPPORT_MANAGER: supportPermissions,
  ANALYST: analystPermissions,
  VIEWER: viewerPermissions,
  USER: [],
};

export function hasPermission(role: PlatformRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function isLowerRole(actorRole: PlatformRole, targetRole: PlatformRole) {
  return ROLE_ORDER[targetRole] < ROLE_ORDER[actorRole];
}

export function canInviteRole(actorRole: PlatformRole, targetRole: PlatformRole) {
  if (targetRole === "OWNER" || targetRole === "USER") return false;
  if (actorRole === "OWNER") return true;
  if (actorRole === "ADMIN") {
    return ["MARKETING_MANAGER", "SUPPORT_MANAGER", "ANALYST", "VIEWER"].includes(targetRole);
  }
  return false;
}

export function canManageMember(actorRole: PlatformRole, targetRole: PlatformRole) {
  if (targetRole === "OWNER") return false;
  return isLowerRole(actorRole, targetRole);
}

export function roleLabel(role: PlatformRole) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
