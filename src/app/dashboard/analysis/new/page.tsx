"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  UploadCloud,
  FileText,
  Shield,
  ArrowRight,
  ArrowLeft,
  Target,
  User,
  Briefcase,
  Sparkles,
  Check,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { LoadingSequence } from "@/components/analysis/loading-sequence";
import { ROLE_LIST, getRoleTemplate, type RoleCategory } from "@/lib/roles";
import { createAnalysisSchema, CreateAnalysisInput } from "@/lib/validation/analysis";

const STEPS = [
  { label: "Career Goal", icon: Target },
  { label: "Your Profile", icon: User },
  { label: "Target Job", icon: Briefcase },
] as const;

const EXPERIENCE_OPTIONS = [
  { value: "STUDENT", label: "Student" },
  { value: "FRESH_GRADUATE", label: "Fresh Graduate" },
  { value: "JUNIOR", label: "Junior" },
] as const;

const HOURS_OPTIONS = [
  { value: "H3", label: "3 hours / week" },
  { value: "H5", label: "5 hours / week" },
  { value: "H8", label: "8 hours / week" },
  { value: "H10_PLUS", label: "10+ hours / week" },
] as const;

const DEMO_CV_TEXT = `Ahmed Youssef — Computer Science student, Cairo University (expected graduation 2026)

- Built and deployed a personal portfolio site using HTML, CSS, and vanilla JavaScript.
- Completed a self-paced React course and built a to-do list app using component state, props, and conditional rendering.
- Comfortable with Git and GitHub — used feature branches and opened pull requests during a 3-person class project.
- Built a small weather app that fetches from a public REST API and shows loading and error states.
- Currently learning TypeScript by converting existing JavaScript components one at a time.
- Worked in a 4-person team on a semester-long capstone project and presented the results to faculty.
- Comfortable with basic HTML/CSS responsive layouts using Flexbox.`;

export default function NewAnalysisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [roleSearch, setRoleSearch] = useState("");

  const form = useForm<CreateAnalysisInput>({
    resolver: zodResolver(createAnalysisSchema),
    defaultValues: {
      targetRole: "JUNIOR_FRONTEND_DEVELOPER",
      experienceLevel: "STUDENT",
      weeklyHours: "H5",
      cvText: "",
      jobDescriptionText: "",
    },
    mode: "onChange",
  });

  const { register, control, setValue, trigger, formState, handleSubmit } = form;
  const targetRole = useWatch({ control, name: "targetRole" });
  const experienceLevel = useWatch({ control, name: "experienceLevel" });
  const weeklyHours = useWatch({ control, name: "weeklyHours" });
  const cvText = useWatch({ control, name: "cvText" });
  const jobDescriptionText = useWatch({ control, name: "jobDescriptionText" });

  async function goNext() {
    const fieldsByStep: (keyof CreateAnalysisInput)[][] = [
      ["targetRole", "experienceLevel", "weeklyHours"],
      ["cvText"],
      ["jobDescriptionText"],
    ];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function fillDemoData() {
    const demoRole = getRoleTemplate("JUNIOR_FRONTEND_DEVELOPER");
    setValue("targetRole", "JUNIOR_FRONTEND_DEVELOPER", { shouldValidate: true });
    setValue("experienceLevel", "STUDENT", { shouldValidate: true });
    setValue("weeklyHours", "H5", { shouldValidate: true });
    setValue("cvText", DEMO_CV_TEXT, { shouldValidate: true });
    setValue("jobDescriptionText", demoRole.jobDescriptionTemplate, { shouldValidate: true });
    setFileName(null);
    setStep(STEPS.length - 1);
    toast.success("Demo profile loaded — review and analyze whenever you're ready.");
  }

  async function createDemoAnalysis() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/demo-analysis", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't create demo analysis.");
        setSubmitting(false);
        return;
      }
      router.push(`/dashboard/analysis/${data.id}/results`);
    } catch {
      toast.error("Something went wrong creating the demo.");
      setSubmitting(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    setParsing(true);
    setFileName(file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't read this file. Please paste your CV text instead.");
        setFileName(null);
        return;
      }
      setValue("cvText", data.text, { shouldValidate: true });
      toast.success("CV parsed successfully — review the text below.");
    } catch {
      toast.error("Something went wrong reading this file. Please paste your CV text instead.");
      setFileName(null);
    } finally {
      setParsing(false);
    }
  }

  const filteredRoles = ROLE_LIST.filter((role) => {
    const query = roleSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      role.label.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query) ||
      role.category.toLowerCase().includes(query)
    );
  });
  const rolesByCategory = filteredRoles.reduce<Partial<Record<RoleCategory, typeof ROLE_LIST>>>((acc, role) => {
    (acc[role.category] ??= []).push(role);
    return acc;
  }, {});

  function useJobTemplate() {
    const role = ROLE_LIST.find((r) => r.id === targetRole);
    if (role) {
      setValue("jobDescriptionText", role.jobDescriptionTemplate, { shouldValidate: true });
      toast.success("Template applied — personalize it for a more accurate analysis.");
    }
  }

  const onSubmit = async (values: CreateAnalysisInput) => {
    setSubmitting(true);
    try {
      const createRes = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const created = await createRes.json();
      if (!createRes.ok) {
        toast.error(created.error ?? "Couldn't create your analysis.");
        setSubmitting(false);
        return;
      }

      const extractRes = await fetch(`/api/analysis/${created.id}/extract`, { method: "POST" });
      const extracted = await extractRes.json();
      if (!extractRes.ok) {
        toast.error(extracted.error ?? "Couldn't analyze your CV. Please try again.");
        setSubmitting(false);
        router.push(`/dashboard/analysis/${created.id}/review`);
        return;
      }

      router.push(`/dashboard/analysis/${created.id}/review`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (submitting) {
    return <LoadingSequence />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">New skill-gap analysis</h1>
          <p className="text-sm text-muted-foreground">Three quick steps to your readiness score.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={createDemoAnalysis}
          className="gap-1.5 border-ai/30 text-ai hover:bg-ai/10 hover:text-ai"
        >
          <Sparkles className="h-3.5 w-3.5" /> Try Demo: Junior Frontend Developer
        </Button>
      </div>

      <Stepper step={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <Label className="mb-3 block text-base">Target role</Label>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  placeholder="Search roles (e.g. mobile, design, marketing)…"
                  className="pl-9"
                />
              </div>
              <RadioGroup
                value={targetRole}
                onValueChange={(v) => setValue("targetRole", v as CreateAnalysisInput["targetRole"], { shouldValidate: true })}
                className="max-h-[420px] space-y-4 overflow-y-auto rounded-xl border border-border/60 p-3"
              >
                {Object.entries(rolesByCategory).map(([category, roles]) => (
                  <div key={category}>
                    <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {category}
                    </p>
                    <div className="grid gap-2.5">
                      {roles!.map((role) => (
                        <Label
                          key={role.id}
                          htmlFor={role.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                            targetRole === role.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                          }`}
                        >
                          <RadioGroupItem value={role.id} id={role.id} className="mt-0.5" />
                          <span>
                            <span className="block font-medium">{role.label}</span>
                            <span className="block text-sm text-muted-foreground">{role.description}</span>
                          </span>
                        </Label>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredRoles.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground">No roles match &quot;{roleSearch}&quot;.</p>
                )}
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-3 block text-base">Experience level</Label>
              <RadioGroup
                value={experienceLevel}
                onValueChange={(v) => setValue("experienceLevel", v as CreateAnalysisInput["experienceLevel"], { shouldValidate: true })}
                className="flex flex-wrap gap-3"
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <Label
                    key={opt.value}
                    htmlFor={`exp-${opt.value}`}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                      experienceLevel === opt.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`exp-${opt.value}`} className="sr-only" />
                    {opt.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-3 block text-base">Study time available per week</Label>
              <RadioGroup
                value={weeklyHours}
                onValueChange={(v) => setValue("weeklyHours", v as CreateAnalysisInput["weeklyHours"], { shouldValidate: true })}
                className="flex flex-wrap gap-3"
              >
                {HOURS_OPTIONS.map((opt) => (
                  <Label
                    key={opt.value}
                    htmlFor={`hrs-${opt.value}`}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                      weeklyHours === opt.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`hrs-${opt.value}`} className="sr-only" />
                    {opt.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your CV is used only to generate your personal analysis — never to train a public model. You can
                delete it anytime.
              </AlertDescription>
            </Alert>

            <label
              htmlFor="cv-upload"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <UploadCloud className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">
                {parsing ? "Reading your file…" : fileName ? fileName : "Upload PDF or DOCX"}
              </span>
              <span className="text-xs text-muted-foreground">Max 5MB</span>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={handleFileUpload}
                disabled={parsing}
              />
            </label>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                or paste text
              </span>
            </div>

            <Textarea
              rows={10}
              placeholder="Paste your CV or profile text here — education, projects, experience, skills…"
              {...register("cvText")}
            />
            {formState.errors.cvText && (
              <p className="text-sm text-destructive">{formState.errors.cvText.message}</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label>Job description</Label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={fillDemoData} className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Fill demo inputs
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={useJobTemplate} className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Use a template
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Pasting a real job post from a company you&apos;re interested in gives more personalized results
              than using a template alone.
            </p>
            <Textarea
              rows={12}
              placeholder="Paste the full job description here…"
              {...register("jobDescriptionText")}
            />
            {formState.errors.jobDescriptionText && (
              <p className="text-sm text-destructive">{formState.errors.jobDescriptionText.message}</p>
            )}

            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <p className="mb-3 text-sm font-medium">Ready to submit</p>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Target role</dt>
                  <dd className="font-medium">{ROLE_LIST.find((r) => r.id === targetRole)?.label}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Experience level</dt>
                  <dd className="font-medium">
                    {EXPERIENCE_OPTIONS.find((o) => o.value === experienceLevel)?.label}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Study time</dt>
                  <dd className="font-medium">
                    {HOURS_OPTIONS.find((o) => o.value === weeklyHours)?.label}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">CV length</dt>
                  <dd className="font-medium">{cvText.length.toLocaleString()} characters</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Job description length</dt>
                  <dd className="font-medium">{jobDescriptionText.length.toLocaleString()} characters</dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                This score is a learning and preparation indicator. It is not a hiring decision.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={goBack} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext} className="gap-1.5">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="gap-1.5">
              Analyze My Skill Gap <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div>
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  i < step
                    ? "bg-matched text-matched-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 h-px flex-1 transition-colors ${i < step ? "bg-matched" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-muted-foreground sm:hidden">{STEPS[step].label}</p>
    </div>
  );
}
