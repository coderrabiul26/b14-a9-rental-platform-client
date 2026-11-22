"use client";

import ErrorState from "@/components/states/error-state";

/**
 * Root application error boundary (`src/app/error.tsx`).
 *
 * Catches errors that bubble up past the route-group boundaries and
 * renders a friendly fallback inside the root layout. Session is
 * preserved — no redirect to login.
 */
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return <ErrorState error={error} retry={retry} context="Application" />;
}