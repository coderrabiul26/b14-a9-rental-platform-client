"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangleIcon, HomeIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  /** The thrown value (Error in production, may be unknown). */
  error: unknown;
  /** Re-fetch and re-render the failed segment. */
  retry: () => void;
  /** Optional eyebrow label, e.g. "Dashboard". */
  context?: string;
}

/**
 * Friendly, reusable error-boundary fallback UI.
 *
 * Used by every `error.tsx` in the app so a crashed route always shows a
 * helpful message with working "Try again" and "Back to home" actions
 * instead of a blank screen. Never redirects the user to the login page.
 */
const ErrorState = ({ error, retry, context }: ErrorStateProps) => {
  useEffect(() => {
    // Log for debugging; server errors carry a `digest` for log correlation.
    console.error(context ? `[${context}] ` : "", error);
  }, [error, context]);

  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest?: unknown }).digest ?? "")
      : "";

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="size-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          We hit an unexpected error while loading this page
          {context ? ` (${context.toLowerCase()})` : ""}. Your session is still
          active — please try again.
        </p>
        {digest ? (
          <p className="text-xs text-muted-foreground/70">Error ID: {digest}</p>
        ) : null}
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Button className="gap-2 rounded-xl" onClick={() => retry()}>
          <RotateCcwIcon className="size-4" />
          Try again
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          className="gap-2 rounded-xl"
          render={<Link href="/" />}
        >
          <HomeIcon className="size-4" />
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;