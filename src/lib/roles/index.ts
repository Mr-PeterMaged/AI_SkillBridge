import { RoleTemplate } from "./types";
import { juniorFrontendDeveloper } from "./frontend";
import { juniorBackendDeveloper } from "./backend";
import { juniorDataAnalyst } from "./data-analyst";

export * from "./types";

export const ROLE_TEMPLATES: Record<RoleTemplate["id"], RoleTemplate> = {
  JUNIOR_FRONTEND_DEVELOPER: juniorFrontendDeveloper,
  JUNIOR_BACKEND_DEVELOPER: juniorBackendDeveloper,
  JUNIOR_DATA_ANALYST: juniorDataAnalyst,
};

export const ROLE_LIST = Object.values(ROLE_TEMPLATES);

export function getRoleTemplate(id: RoleTemplate["id"]): RoleTemplate {
  const template = ROLE_TEMPLATES[id];
  if (!template) {
    throw new Error(`Unknown role template: ${id}`);
  }
  return template;
}

/** Builds a canonical-name lookup (alias -> canonical) for a given role, case-insensitive. */
export function buildAliasIndex(role: RoleTemplate): Map<string, string> {
  const index = new Map<string, string>();
  for (const skill of role.skills) {
    index.set(skill.canonicalName.toLowerCase(), skill.canonicalName);
    for (const alias of skill.aliases) {
      index.set(alias.toLowerCase(), skill.canonicalName);
    }
  }
  return index;
}
