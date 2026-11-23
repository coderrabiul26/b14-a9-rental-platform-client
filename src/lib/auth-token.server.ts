/**
 * Server-side auth helpers.
 *
 * These functions accept the cookie header as a parameter instead of
 * importing `next/headers` directly, so they can be safely imported by
 * modules used by both Server and Client Components. Callers (Server
 * Components) obtain the cookie via `await headers()` from `next/headers`
 * and pass it in.
 *
 * `serverAuthHeaders()` is the *universal* convenience wrapper used by
 * `src/lib/api/*`: it works in both environments…
 *
 *   - **Server** (Server Component / route handler): reads the request
 *     cookies through `next/headers` (imported lazily so this file stays
 *     free of server-only imports at module scope) and exchanges them for
 *     a JWT at `/api/auth/token`.
 *   - **Browser** (Client Component event handlers): falls back to
 *     `authClient.token()`, which reads the JWT the JWT plugin handed out
 *     on login/registration.
 *
 * If neither yields a token the caller still gets a valid JSON header set
 * (no `Authorization`), so public endpoints keep working and protected
 * ones answer 401/403 instead of crashing the UI.
 */

/**
 * True when running in the browser (Client Component code path).
 */
const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Reads the raw `cookie` header of the current request on the server.
 * Returns `null` outside a request scope (static rendering, worker…) or in
 * the browser.
 */
async function readRequestCookieHeader(): Promise<string | null> {
  if (isBrowser()) return null;
  try {
    // Lazily imported: keeps `next/headers` out of the module graph of
    // client bundles that import this file.
    const { headers } = await import("next/headers");
    const headerStore = await headers();
    return headerStore.get("cookie");
  } catch {
    return null;
  }
}

/**
 * Resolves the JWT access token for the current execution context
 * (server request scope → cookie exchange, browser → `authClient`).
 */
export async function getAccessToken(): Promise<string | null> {
  if (isBrowser()) {
    try {
      const { getAccessToken: getClientAccessToken } = await import(
        "@/lib/auth-token"
      );
      return await getClientAccessToken();
    } catch {
      return null;
    }
  }

  const cookieHeader = await readRequestCookieHeader();
  if (!cookieHeader) return null;
  return getServerAccessTokenFromCookie(cookieHeader);
}

/**
 * Universal auth-header builder for `src/lib/api/*` — safe to call from
 * both Server Components and Client Components.
 */
export async function serverAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Exchanges a Better Auth session cookie for a JWT access token via the
 * `/api/auth/token` endpoint (validated by `sessionMiddleware`).
 */
export async function getServerAccessTokenFromCookie(
  cookieHeader: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/token`,
      {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.token ?? null;
  } catch {
    return null;
  }
}

/**
 * Builds request headers for a protected API call from the SERVER.
 * Always sets `Content-Type: application/json`, and adds
 * `Authorization: Bearer …` when a server-side token is available.
 *
 * Callers (Server Components) obtain the cookie via `await headers()`
 * from `next/headers` and pass it in.
 */
export async function serverAuthHeadersFromCookie(
  cookieHeader: string
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await getServerAccessTokenFromCookie(cookieHeader);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}