import { Skeleton } from "@/components/ui/skeleton";
import EquipmentCardSkeleton from "./equipment-card-skeleton";

/**
 * Home page loading skeleton.
 *
 * Mirrors the section order of `src/app/(root)/page.tsx`:
 * hero → featured grid → categories → why/how/reviews/CTA blocks.
 */
const HomeSkeleton = () => {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-12 w-full max-w-2xl" />
            <Skeleton className="h-12 w-full max-w-xl" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="mt-2 flex gap-3">
              <Skeleton className="h-10 w-36 rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured equipment ───────────────────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EquipmentCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why / How / Reviews / CTA blocks ─────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Skeleton className="mx-auto h-9 w-56" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSkeleton;