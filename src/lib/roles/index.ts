import type { TargetRole } from "@prisma/client";
import { RoleTemplate } from "./types";
import { juniorFrontendDeveloper } from "./frontend";
import { juniorBackendDeveloper } from "./backend";
import { juniorDataAnalyst } from "./data-analyst";
import { fullStackDeveloper } from "./full-stack";
import { mobileAppDeveloper } from "./mobile";
import { qaTestEngineer } from "./qa-test";
import { devopsEngineer } from "./devops";
import { uiUxDesigner } from "./ui-ux-designer";
import { digitalMarketingSpecialist } from "./digital-marketing";
import { cybersecurityAnalyst } from "./cybersecurity";
import { cloudEngineer } from "./cloud-engineer";
import { dataEngineer } from "./data-engineer";
import { productManager } from "./product-manager";
import { technicalWriter } from "./technical-writer";
import { itSupportSpecialist } from "./it-support";

export * from "./types";

export const ROLE_TEMPLATES: Record<TargetRole, RoleTemplate> = {
  JUNIOR_FRONTEND_DEVELOPER: juniorFrontendDeveloper,
  JUNIOR_BACKEND_DEVELOPER: juniorBackendDeveloper,
  JUNIOR_DATA_ANALYST: juniorDataAnalyst,
  FULL_STACK_DEVELOPER: fullStackDeveloper,
  MOBILE_APP_DEVELOPER: mobileAppDeveloper,
  QA_TEST_ENGINEER: qaTestEngineer,
  DEVOPS_ENGINEER: devopsEngineer,
  UI_UX_DESIGNER: uiUxDesigner,
  DIGITAL_MARKETING_SPECIALIST: digitalMarketingSpecialist,
  CYBERSECURITY_ANALYST: cybersecurityAnalyst,
  CLOUD_ENGINEER: cloudEngineer,
  DATA_ENGINEER: dataEngineer,
  PRODUCT_MANAGER: productManager,
  TECHNICAL_WRITER: technicalWriter,
  IT_SUPPORT_SPECIALIST: itSupportSpecialist,
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
