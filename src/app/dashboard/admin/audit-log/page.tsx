import { requireAdminPage } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/badge";

export default async function AdminAuditLogPage() {
  await requireAdminPage("audit.read");
  const logs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: { select: { displayName: true, email: true, role: true } },
      targetMember: { select: { displayName: true, email: true, role: true } },
    },
  });

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Audit Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Security-sensitive actions across team access, promotions, campaigns, ambassadors, exports, and ownership.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-5">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2">Actor</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Target member</th>
              <th>Before</th>
              <th>After</th>
              <th>Date/time</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && <tr><td colSpan={7} className="py-6 text-muted-foreground">No audit events yet.</td></tr>}
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/60 align-top">
                <td className="py-2">{log.actor?.displayName ?? log.actor?.email ?? "System"}</td>
                <td><Badge variant="secondary">{log.action}</Badge></td>
                <td>{log.entityType}{log.entityId ? ` / ${log.entityId.slice(-6)}` : ""}</td>
                <td>{log.targetMember?.displayName ?? log.targetMember?.email ?? "-"}</td>
                <td><JsonPreview value={log.before} /></td>
                <td><JsonPreview value={log.after} /></td>
                <td>{log.createdAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JsonPreview({ value }: { value: unknown }) {
  if (!value) return <span className="text-muted-foreground">-</span>;
  return (
    <details>
      <summary className="cursor-pointer text-xs text-primary">View</summary>
      <pre className="mt-2 max-h-40 max-w-80 overflow-auto rounded bg-muted p-2 text-[11px] text-muted-foreground">
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
}
