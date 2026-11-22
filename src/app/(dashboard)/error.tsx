"use client";

import ErrorState from "@/components/states/error-state";

/**
 * Error boundary for the authenticated (dashboard) route group.
 *
 * Renders inside the dashboard layout, so the sidebar + header remain
 * visible while the page content area shows a friendly recovery UI.
 * It deliberately does NOT redirect to the login page — the user's
 * session stays intact and they can simply retry.
 */
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return <ErrorState error={error} retry={retry} context="Dashboard" />;
}