import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { safeLocalRedirectPath } from "@/lib/security/url";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string | string[]; returnUrl?: string | string[] }>;
}) {
  const params = await searchParams;
  const redirectUrl = safeLocalRedirectPath(
    params.redirect_url ?? params.returnUrl,
    "/dashboard",
    ["/dashboard", "/dashboard/analysis", "/dashboard/analysis/new", "/dashboard/billing", "/pricing"]
  );
  const { userId } = await auth();
  if (userId) redirect(redirectUrl);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <SignIn fallbackRedirectUrl="/dashboard" forceRedirectUrl={redirectUrl} signUpFallbackRedirectUrl={redirectUrl} />
    </div>
  );
}
