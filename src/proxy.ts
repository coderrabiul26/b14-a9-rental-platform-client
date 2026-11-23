import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Proxy (Next.js 16 middleware) — logged-in + role gate for the dashboard.
 *
 * This file is `src/proxy.ts` and exports a `proxy` function. It runs on the
 * server before any `/dashboard/*` page renders.
 *
 * It enforces:
 *
 * 1. **Logged-in gate** — no valid session means redirect to
 *    `/signin?redirectTo=…` so the user returns after logging in.
 * 2. **Role gate** — a user opening a dashboard segment that isn't theirs
 *    (e.g. a customer opening `/dashboard/admin`) is redirected to their own
 *    home segment.
 * 3. **Auth-page gate** — already-logged-in users are bounced from `/signin`
 *    and `/signup` to their role-specific dashboard (prevents redirect loops).
 * 4. **Header forwarding** — sets `x-dashboard-path` so
 *    `src/app/(dashboard)/layout.tsx` can re-validate the role against the DB
 *    session as defense-in-depth.
 *
 * Session is resolved via `auth.api.getSession()` (the official Better Auth
 * API) rather than manually parsing cookies, so it works regardless of the
 * underlying cookie name/format.
 *
 * The Express API independently enforces 401/403 on protected endpoints via
 * JWT middlewares (`verifyToken`, `verifyRenter`, `verifyOwner`,
 * `verifyAdmin`).
 */

export const config = {
  matcher: ["/dashboard/:path*", "/all-equipment/:path*", "/signin", "/signup"],
};

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Resolve the session via Better Auth's official API.
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Private equipment details route
if (pathname.startsWith("/all-equipment/")) {
  if (!session?.user) {
    const signInUrl = new URL("/signin", request.url);

    signInUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(signInUrl);
  }
}

  // ── 1. Dashboard routes ────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    // Must be logged in
    if (!session?.user) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role-based access control
    const role = (session.user as { role?: string }).role ?? "customer";
    const segments = pathname.split("/").filter(Boolean);
    // segments[0] = "dashboard", segments[1] = "admin" | "owner" | "customer"
    const requestedSegment = segments[1];

    if (
      requestedSegment &&
      SEGMENT_TO_ROLE[requestedSegment] &&
      SEGMENT_TO_ROLE[requestedSegment] !== role
    ) {
      return NextResponse.redirect(
        new URL(ROLE_HOME[role] ?? "/", request.url)
      );
    }

    // Forward the path so the server layout can re-check against the DB session.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-dashboard-path", pathname);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // ── 2. Auth routes — redirect already-logged-in users ──────────────
  if ((pathname === "/signin" || pathname === "/signup") && session?.user) {
    const role = (session.user as { role?: string }).role ?? "customer";
    return NextResponse.redirect(
      new URL(ROLE_HOME[role] ?? "/", request.url)
    );
  }

  return NextResponse.next();
}