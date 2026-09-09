import { ApplicationTracker } from "@/components/applications/application-tracker";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Job application tracker</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Save target roles, track status, and connect applications to your SkillBridge readiness work.
        </p>
      </div>
      <ApplicationTracker />
    </div>
  );
}
