"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Role = "OWNER" | "ADMIN" | "MARKETING_MANAGER" | "SUPPORT_MANAGER" | "ANALYST" | "VIEWER" | "USER";
type MemberStatus = "ACTIVE" | "INVITED" | "SUSPENDED" | "REMOVED";
type Member = {
  id: string;
  email: string | null;
  displayName: string | null;
  role: Role;
  status: MemberStatus;
  joinedAt: string | null;
  lastRoleChangedAt: string | null;
  invitedBy: { displayName: string | null; email: string | null } | null;
};
type Invite = { id: string; email: string; role: Role; status: string; expiresAt: string };

const inviteRoles: Role[] = ["ADMIN", "MARKETING_MANAGER", "SUPPORT_MANAGER", "ANALYST", "VIEWER"];
const memberRoles: Role[] = ["ADMIN", "MARKETING_MANAGER", "SUPPORT_MANAGER", "ANALYST", "VIEWER"];

export function TeamManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "MARKETING_MANAGER" as Role, note: "" });
  const [transfer, setTransfer] = useState({ targetMemberId: "", confirmation: "", previousOwnerRole: "ADMIN" as Role });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't load team.");
    else {
      setMembers(data.members ?? []);
      setInvites(data.invites ?? []);
    }
    setLoading(false);
  }

  // Data-fetching effect (React's own documented use case for useEffect);
  // `load` sets loading state as its very first statement so refetches show
  // a spinner, which this lint rule doesn't distinguish from an unwanted
  // render-cascade.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/team/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inviteForm),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't create invite.");
    else {
      setInviteLink(data.inviteLink);
      toast.success("Invite created. Copy the sensitive one-time link.");
      await load();
    }
    setSaving(false);
  }

  async function roleChange(memberId: string, role: Role) {
    const res = await fetch(`/api/admin/team/${memberId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Role change blocked.");
    else {
      toast.success("Role updated.");
      setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, role: data.member.role } : member)));
    }
  }

  async function statusAction(memberId: string, action: "suspend" | "reactivate" | "remove") {
    if (!window.confirm(`${action} this member?`)) return;
    const res = await fetch(`/api/admin/team/${memberId}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: null }),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Action blocked.");
    else {
      toast.success("Member updated.");
      setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, status: data.member.status } : member)));
    }
  }

  async function revoke(inviteId: string) {
    const res = await fetch(`/api/admin/team/invites/${inviteId}/revoke`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Couldn't revoke invite.");
    else {
      toast.success("Invite revoked.");
      setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
    }
  }

  async function transferOwnership(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("/api/admin/team/transfer-ownership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transfer),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error ?? "Ownership transfer blocked.");
    else {
      toast.success("Ownership transferred.");
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form onSubmit={invite} className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Invite team member</h2>
          <Field label="Email"><Input type="email" value={inviteForm.email} onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))} required /></Field>
          <Field label="Role">
            <Select value={inviteForm.role} onValueChange={(role) => setInviteForm((p) => ({ ...p, role: role as Role }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{inviteRoles.map((role) => <SelectItem key={role} value={role}>{label(role)}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <div className="grid gap-2 text-xs text-muted-foreground">
            <RoleHint role="Admin" text="Full operational control, except ownership and protected platform settings." />
            <RoleHint role="Marketing Manager" text="Promo codes, campaigns, ambassadors, marketing performance." />
            <RoleHint role="Support Manager" text="Limited support data and account assistance." />
            <RoleHint role="Analyst" text="Read-only aggregated reporting." />
            <RoleHint role="Viewer" text="Limited read-only overview." />
          </div>
          <Field label="Optional note"><Textarea rows={2} value={inviteForm.note} onChange={(e) => setInviteForm((p) => ({ ...p, note: e.target.value }))} /></Field>
          <Button disabled={saving} className="gap-1.5">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create invite</Button>
          {inviteLink && (
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm">
              <p className="font-medium">Sensitive one-time invite link</p>
              <p className="mt-1 break-all text-xs text-muted-foreground">{inviteLink}</p>
              <Button type="button" size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(inviteLink).then(() => toast.success("Copied."))} className="mt-2 gap-1.5"><Copy className="h-3.5 w-3.5" /> Copy</Button>
            </div>
          )}
        </form>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Members</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs text-muted-foreground"><tr className="border-b border-border"><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Invited by</th><th>Joined</th><th>Last role update</th><th>Actions</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={8} className="py-6 text-muted-foreground">Loading team...</td></tr>}
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-border/60">
                    <td className="py-2">{member.displayName ?? "-"}</td>
                    <td>{member.email ?? "-"}</td>
                    <td><Badge variant="secondary">{label(member.role)}</Badge></td>
                    <td><Badge variant="outline">{member.status}</Badge></td>
                    <td>{member.invitedBy?.displayName ?? member.invitedBy?.email ?? "-"}</td>
                    <td>{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "-"}</td>
                    <td>{member.lastRoleChangedAt ? new Date(member.lastRoleChangedAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {member.role !== "OWNER" && <RoleSelect value={member.role} onChange={(role) => roleChange(member.id, role)} />}
                        {member.status === "ACTIVE" ? <Button size="sm" variant="outline" onClick={() => statusAction(member.id, "suspend")}>Suspend</Button> : <Button size="sm" variant="outline" onClick={() => statusAction(member.id, "reactivate")}>Reactivate</Button>}
                        {member.role !== "OWNER" && <Button size="sm" variant="outline" onClick={() => statusAction(member.id, "remove")}>Remove</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Pending invites</h2>
        <div className="mt-3 space-y-2">
          {invites.length === 0 && <p className="text-sm text-muted-foreground">No pending invites.</p>}
          {invites.map((invite) => (
            <div key={invite.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 p-3 text-sm">
              <span>{invite.email} - {label(invite.role)} - expires {new Date(invite.expiresAt).toLocaleDateString()}</span>
              <Button size="sm" variant="outline" onClick={() => revoke(invite.id)}>Revoke</Button>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={transferOwnership} className="rounded-2xl border border-critical/30 bg-critical/[0.03] p-5">
        <h2 className="flex items-center gap-2 font-semibold"><ShieldAlert className="h-4 w-4 text-critical" /> Ownership transfer</h2>
        <p className="mt-1 text-sm text-muted-foreground">Owner-only. Select an active Admin and type TRANSFER OWNERSHIP.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Field label="Target active admin">
            <Select value={transfer.targetMemberId} onValueChange={(targetMemberId) => setTransfer((p) => ({ ...p, targetMemberId }))}>
              <SelectTrigger><SelectValue placeholder="Select admin" /></SelectTrigger>
              <SelectContent>{members.filter((m) => m.role === "ADMIN" && m.status === "ACTIVE").map((m) => <SelectItem key={m.id} value={m.id}>{m.displayName ?? m.email}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Confirmation"><Input value={transfer.confirmation} onChange={(e) => setTransfer((p) => ({ ...p, confirmation: e.target.value }))} placeholder="TRANSFER OWNERSHIP" /></Field>
          <Field label="Previous owner role">
            <Select value={transfer.previousOwnerRole} onValueChange={(previousOwnerRole) => setTransfer((p) => ({ ...p, previousOwnerRole: previousOwnerRole as Role }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{memberRoles.map((role) => <SelectItem key={role} value={role}>{label(role)}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <Button className="mt-4" variant="destructive">Transfer ownership</Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}

function RoleHint({ role, text }: { role: string; text: string }) {
  return <div className="rounded-lg bg-muted/40 p-2"><span className="font-medium text-foreground">{role}:</span> {text}</div>;
}

function RoleSelect({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  return (
    <Select value={value} onValueChange={(role) => onChange(role as Role)}>
      <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
      <SelectContent>{memberRoles.map((role) => <SelectItem key={role} value={role}>{label(role)}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function label(role: Role) {
  return role.toLowerCase().split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}
