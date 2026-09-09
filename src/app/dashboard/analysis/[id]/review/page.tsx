"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSequence } from "@/components/analysis/loading-sequence";
import { AnalysisDTO, CandidateSkillDTO } from "@/lib/types/analysis";

type ReviewSkill = {
  key: string;
  name: string;
  canonicalName: string;
  category: "technical" | "tool" | "soft";
  evidence: string[];
  confidence: number;
  mastery: "FAMILIAR" | "PRACTICED" | "PROVEN" | null;
  include: boolean;
  source: "ai" | "user";
};

function toReviewSkill(s: CandidateSkillDTO): ReviewSkill {
  return {
    key: s.id,
    name: s.name,
    canonicalName: s.canonicalName,
    category: s.category.toLowerCase() as ReviewSkill["category"],
    evidence: s.evidence,
    confidence: s.confidence,
    mastery: s.mastery,
    include: true,
    source: s.status === "USER_ADDED" ? "user" : "ai",
  };
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [analysis, setAnalysis] = useState<AnalysisDTO | null>(null);
  const [skills, setSkills] = useState<ReviewSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/analysis/${id}`);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't load this analysis.");
        setLoading(false);
        return;
      }
      setAnalysis(data.analysis);
      setSkills(data.analysis.candidateSkills.map(toReviewSkill));
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function retryExtraction() {
    setRetrying(true);
    try {
      const res = await fetch(`/api/analysis/${id}/extract`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Extraction failed again. Please try later.");
        setRetrying(false);
        return;
      }
      const res2 = await fetch(`/api/analysis/${id}`);
      const data2 = await res2.json();
      setAnalysis(data2.analysis);
      setSkills(data2.analysis.candidateSkills.map(toReviewSkill));
    } finally {
      setRetrying(false);
    }
  }

  function toggleInclude(key: string) {
    setSkills((prev) => prev.map((s) => (s.key === key ? { ...s, include: !s.include } : s)));
  }

  function setMastery(key: string, mastery: ReviewSkill["mastery"]) {
    setSkills((prev) => prev.map((s) => (s.key === key ? { ...s, mastery } : s)));
  }

  function addSkill() {
    const name = newSkillName.trim();
    if (!name) return;
    setSkills((prev) => [
      ...prev,
      {
        key: `user-${Date.now()}`,
        name,
        canonicalName: name,
        category: "technical",
        evidence: [],
        confidence: 1,
        mastery: "FAMILIAR",
        include: true,
        source: "user",
      },
    ]);
    setNewSkillName("");
  }

  async function handleConfirm() {
    setConfirming(true);
    try {
      const res = await fetch(`/api/analysis/${id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: skills.map((s) => ({
            name: s.name,
            canonicalName: s.canonicalName,
            category: s.category,
            evidence: s.evidence,
            confidence: s.confidence,
            mastery: s.mastery,
            include: s.include,
            source: s.source,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't score your profile.");
        setConfirming(false);
        return;
      }
      router.push(`/dashboard/analysis/${id}/results`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setConfirming(false);
    }
  }

  if (loading) return <LoadingSequence />;
  if (!analysis) return <p className="text-muted-foreground">Analysis not found.</p>;

  if (analysis.status === "DRAFT" || analysis.status === "FAILED") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="font-medium">We haven&apos;t analyzed this profile yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {analysis.status === "FAILED"
            ? "The last attempt failed. This can happen if the AI service is temporarily unavailable."
            : "Let's extract your skills."}
        </p>
        <Button className="mt-6 gap-1.5" onClick={retryExtraction} disabled={retrying}>
          {retrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {retrying ? "Analyzing…" : "Analyze My Skills"}
        </Button>
      </div>
    );
  }

  if (analysis.status === "EXTRACTING") return <LoadingSequence />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Review your skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We extracted these from your CV. Uncheck anything wrong, add anything missing, and tell us how well
          you know each one — this is what your score is based on.
        </p>
      </div>

      {analysis.candidateSummary && (
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          {analysis.candidateSummary}
        </div>
      )}

      <div className="space-y-2">
        {skills.map((s) => (
          <div
            key={s.key}
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
              s.include ? "border-border" : "border-border/50 opacity-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={s.include}
                onChange={() => toggleInclude(s.key)}
                className="mt-1.5 h-4 w-4 accent-primary"
                aria-label={`Include ${s.name}`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{s.canonicalName}</span>
                  <Badge variant="outline" className="text-[10px] font-normal capitalize">
                    {s.category}
                  </Badge>
                  {s.source === "user" && (
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      Added by you
                    </Badge>
                  )}
                </div>
                {s.evidence.length > 0 && (
                  <p className="mt-1 max-w-md text-xs text-muted-foreground">&ldquo;{s.evidence[0]}&rdquo;</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pl-7 sm:pl-0">
              <Select value={s.mastery ?? "FAMILIAR"} onValueChange={(v) => setMastery(s.key, v as ReviewSkill["mastery"])}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FAMILIAR">Familiar</SelectItem>
                  <SelectItem value="PRACTICED">Practiced</SelectItem>
                  <SelectItem value="PROVEN">Proven with a project</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSkills((prev) => prev.filter((x) => x.key !== s.key))}
                aria-label={`Remove ${s.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add a skill we missed (e.g. Docker)"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
        />
        <Button type="button" variant="outline" onClick={addSkill} className="shrink-0 gap-1.5">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="flex justify-end border-t border-border pt-6">
        <Button size="lg" onClick={handleConfirm} disabled={confirming} className="gap-1.5">
          {confirming && <Loader2 className="h-4 w-4 animate-spin" />}
          Confirm &amp; See My Score
        </Button>
      </div>
    </div>
  );
}
