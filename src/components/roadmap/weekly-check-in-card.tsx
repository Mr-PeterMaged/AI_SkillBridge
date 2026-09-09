"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RoadmapTaskDTO, WeeklyCheckInDTO } from "@/lib/types/analysis";

const RESPONSES = [
  { value: "COMPLETED", label: "I completed it" },
  { value: "MADE_PROGRESS", label: "I made progress" },
  { value: "GOT_STUCK", label: "I got stuck" },
  { value: "DID_NOT_START", label: "I did not start" },
] as const;

export function WeeklyCheckInCard({
  analysisId,
  task,
  latestCheckIn,
  onCreated,
}: {
  analysisId: string;
  task: RoadmapTaskDTO | null;
  latestCheckIn?: WeeklyCheckInDTO | null;
  onCreated?: (checkIn: WeeklyCheckInDTO) => void;
}) {
  const [response, setResponse] = useState<(typeof RESPONSES)[number]["value"]>("MADE_PROGRESS");
  const [blocker, setBlocker] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(latestCheckIn?.aiSuggestion ?? "");

  async function submit() {
    if (!task) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis/${analysisId}/check-ins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapTaskId: task.id,
          response,
          blocker: blocker.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't save your check-in.");
        return;
      }
      setSuggestion(data.checkIn.aiSuggestion);
      onCreated?.(data.checkIn);
      toast.success("Check-in saved.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ai/25 bg-gradient-to-br from-ai/[0.06] to-transparent p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ai/15 text-ai">
          <MessageSquareText className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold">Weekly AI check-in</h2>
          <p className="text-xs text-muted-foreground">Roadmap-linked guidance, not a general chatbot.</p>
        </div>
      </div>

      {task ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm">
            You planned to complete <span className="font-medium">{task.title}</span>. How did it go?
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {RESPONSES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setResponse(option.value)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  response === option.value ? "border-ai bg-ai/10 text-ai" : "border-border hover:bg-muted/40"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {response === "GOT_STUCK" && (
            <div>
              <Label htmlFor="blocker" className="mb-1.5 block text-sm">What blocked you?</Label>
              <Textarea
                id="blocker"
                rows={3}
                value={blocker}
                onChange={(event) => setBlocker(event.target.value)}
                placeholder="Example: I understand fetch, but I got stuck typing the API response."
              />
            </div>
          )}
          <Button type="button" onClick={submit} disabled={loading} className="gap-1.5 bg-ai text-ai-foreground hover:bg-ai/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Get next smallest action
          </Button>
          {suggestion && (
            <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">{suggestion}</div>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Your next check-in appears once a roadmap has an active task.
        </p>
      )}
    </div>
  );
}
