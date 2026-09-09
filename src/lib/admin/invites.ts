import "server-only";
import { createHash, randomBytes } from "crypto";

export function createInviteToken() {
  return randomBytes(32).toString("base64url");
}

export function hashInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function inviteUrl(token: string, origin?: string | null) {
  const base = origin || "https://skillbridge.ai";
  return `${base.replace(/\/$/, "")}/invite/${encodeURIComponent(token)}`;
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return "invited email";
  return `${name.slice(0, 2)}***@${domain}`;
}
