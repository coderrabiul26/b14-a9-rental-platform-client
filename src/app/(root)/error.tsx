"use client";

import ErrorState from "@/components/states/error-state";

/**
 * Error boundary for the public (root) route group.
 * Catches render/data errors on `/`, `/all-equipment`, etc.
 */
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return <ErrorState error={error} retry={retry} context="Public page" />;
}