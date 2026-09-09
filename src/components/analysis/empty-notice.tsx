import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyNotice({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-5 font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <Button className="mt-6" asChild>
        <Link href={action.href}>{action.label}</Link>
      </Button>
    </div>
  );
}
