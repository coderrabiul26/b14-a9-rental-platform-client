import HomeSkeleton from "@/components/skeletons/home-skeleton";

/**
 * Instant loading UI for the public home page (`src/app/(root)/page.tsx`).
 * Shown while the server streams in the hero, featured listings, etc.
 */
export default function Loading() {
  return <HomeSkeleton />;
}