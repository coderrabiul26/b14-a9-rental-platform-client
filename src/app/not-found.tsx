import NotFoundState from "@/components/states/not-found-state";

/**
 * Root not-found page (`src/app/not-found.tsx`).
 *
 * Handles any unmatched URL across the entire app. Rendered inside the
 * root layout, so it keeps the global fonts/styles from `layout.tsx`.
 */
export default function NotFound() {
  return <NotFoundState />;
}