import { authClient } from "@/lib/auth-client";

/**
 * Returns the current user's JWT access token (minted by the Better Auth
 * JWT plugin on login / registration), or `null` if the user is signed out
 * or the token could not be read.
 *
 * Client-side only — reads the token that `authClient` stored from the
 * `set-auth-jwt` response header. Does NOT work in Server Components.
 *
 * Protected API calls from Client Components use it to build the
 * `Authorization: Bearer <token>` header that the Express `verifyToken`
 * middleware validates.
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await authClient.token();
    return data?.token ?? null;
  } catch {
    return null;
  }
}

/**
 * Builds request headers for a protected API call from the CLIENT.
 * Always sets `Content-Type: application/json`, and adds
 * `Authorization: Bearer …` when a token is available.
 */
export async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}