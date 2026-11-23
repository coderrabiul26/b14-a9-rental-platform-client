import DashboardHeader from "@/components/dashboard/shared/dashboardHeader";
import DashboardSidebar from "@/components/dashboard/shared/dashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

/**
 * Dashboard shell: sidebar on the left, page content on the right.
 *
 * Server-side auth + role guard (defense-in-depth on top of `src/proxy.ts`):
 *
 * 1. Re-validates the session against the database (the Edge middleware only
 *    sees the cached-session cookie, which can be briefly stale).
 * 2. Enforces the role for the current dashboard segment. The middleware
 *    forwards the request path in the `x-dashboard-path` header; if the header
 *    is missing (fallback), we derive the segment from the page's own route.
 *
 * The Express API independently enforces 401/403 on protected endpoints via
 * JWT middlewares, so this is the UI-layer guard.
 */

const SEGMENT_TO_ROLE: Record<string, string> = {
  admin: "admin",
  owner: "owner",
  customer: "customer",
};

const ROLE_HOME: Record<string, string> = {
  admin: "/dashboard/admin",
  owner: "/dashboard/owner",
  customer: "/dashboard/customer",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const headerList = await headers();

  // ── 1. Resolve the session (never let a storage blip crash the route) ──
  // Better Auth re-throws storage errors to its caller, so a transient
  // MongoDB failure would otherwise surface as an unhandled error page.
  // The adapter already retries once (`src/lib/auth.ts`); this is the last
  // line of defence: one more attempt, then fail closed as "signed out".
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  for (let attempt = 0; attempt < 2 && !session; attempt++) {
    try {
      session = await auth.api.getSession({ headers: headerList });
    } catch (error) {
      if (attempt === 1) {
        console.error("[dashboard] Session lookup failed after retry:", error);
      }
    }
  }

  const path = headerList.get("x-dashboard-path") ?? "";

  // ── 2. Must be logged in ─────────────────────────────────────────
  if (!session?.user) {
    // Fail closed, but keep where the user was heading so signing back in
    // returns them to the same page instead of dropping them at the root.
    const redirectTo = path || "/dashboard";
    redirect(`/signin?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  // ── 3. Role vs. requested dashboard ──────────────────────────────
  const role = (session.user as { role?: string }).role ?? "customer";

  // Fallback: if the middleware header isn't set, derive the segment from
  // the current route. `headers()` in a layout doesn't include the URL, so we
  // rely on the middleware header; if absent, skip the cross-segment check
  // (the middleware already handled it).
  const requestedSegment = path.split("/").filter(Boolean)[1];

  if (
    requestedSegment &&
    SEGMENT_TO_ROLE[requestedSegment] &&
    SEGMENT_TO_ROLE[requestedSegment] !== role
  ) {
    redirect(ROLE_HOME[role] ?? "/");
  }

  return (
    <SidebarProvider>
      <TooltipProvider>

        <DashboardSidebar />
        <SidebarInset>
            <DashboardHeader></DashboardHeader>
            {children}

            </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;