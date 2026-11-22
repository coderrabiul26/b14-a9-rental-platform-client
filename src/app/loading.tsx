import { Loader2Icon } from "lucide-react";

/**
 * Root loading UI (`src/app/loading.tsx`).
 *
 * Catches routes that don't have their own, more specific `loading.tsx`
 * (e.g. `/signin`, `/signup`, `/checkout`). Routes with a closer
 * `loading.tsx` — home, all-equipment, details, dashboard — use their own
 * tailored skeletons instead.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <Loader2Icon className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading…</p>
      <span className="sr-only">Loading page</span>
    </div>
  );
}