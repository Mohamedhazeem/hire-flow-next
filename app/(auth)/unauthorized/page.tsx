import { auth } from "@/app/features/auth/libs/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function UnauthorizedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user ? (session.user as { role: string }).role : undefined;

  let dashboardPath = "/login";
  if (userRole === "ADMIN") dashboardPath = "/admin";
  else if (userRole === "EMPLOYER") dashboardPath = "/company";
  else if (userRole === "USER") dashboardPath = "/user";

  return (
    <div className="min-h-screen bg-bg-page px-4 py-20 text-text-body">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-border-subtle bg-bg-surface px-8 py-12 shadow-lg shadow-brand/10 text-center">
        <span className="inline-flex rounded-full bg-error/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-error">
          Access denied
        </span>

        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-text-heading sm:text-5xl">
            403 — Unauthorized
          </h1>
          <p className="max-w-md text-sm leading-7 text-text-muted">
            You don&apos;t have permission to view this page. Please return to your dashboard or
            sign in with an account that has the required access.
          </p>
        </div>

        <Link
          href={dashboardPath}
          className="inline-flex items-center justify-center rounded-2xl bg-button-primary px-6 py-3 text-sm font-semibold text-button-primary-text transition hover:bg-button-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {session ? "Go Back to My Dashboard" : "Go to Login"}
        </Link>
      </div>
    </div>
  );
}
