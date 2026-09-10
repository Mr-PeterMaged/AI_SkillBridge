"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { TargetRole } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getRoleTemplate } from "@/lib/roles";

type AnalysisRow = {
  id: string;
  targetRole: TargetRole;
  status: string;
  readinessScore: number | null;
  createdAt: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [confirmAccountDelete, setConfirmAccountDelete] = useState(false);

  useEffect(() => {
    fetch("/api/analysis")
      .then((r) => r.json())
      .then((data) => setAnalyses(data.analyses ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function deleteAnalysis(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/analysis/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Couldn't delete this analysis.");
        return;
      }
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Analysis deleted.");
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteAccount() {
    setDeletingAccount(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        toast.error("Couldn't delete your account. Please try again.");
        setDeletingAccount(false);
        return;
      }
      router.push("/");
    } catch {
      toast.error("Something went wrong.");
      setDeletingAccount(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Privacy &amp; data</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your uploaded CV is used only to generate your personal analysis. It is not used to train a public
          model. You can delete any analysis or your entire account below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your analyses</CardTitle>
          <CardDescription>Delete an analysis and everything tied to it — skills, gaps, roadmap, evidence.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!loading && analyses.length === 0 && (
            <p className="text-sm text-muted-foreground">No analyses yet.</p>
          )}
          {analyses.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
              <span>
                {getRoleTemplate(a.targetRole).shortLabel} —{" "}
                <span className="text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteAnalysis(a.id)}
                disabled={deletingId === a.id}
                aria-label="Delete analysis"
              >
                {deletingId === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Delete account</CardTitle>
          <CardDescription>
            Permanently deletes your account and every analysis, skill, gap, roadmap, and evidence link tied to
            it. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!confirmAccountDelete ? (
            <Button variant="destructive" onClick={() => setConfirmAccountDelete(true)}>
              Delete my account data
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="destructive" onClick={deleteAccount} disabled={deletingAccount} className="gap-1.5">
                {deletingAccount && <Loader2 className="h-4 w-4 animate-spin" />}
                Yes, permanently delete everything
              </Button>
              <Button variant="ghost" onClick={() => setConfirmAccountDelete(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
