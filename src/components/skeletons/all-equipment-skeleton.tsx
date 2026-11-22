import { Skeleton } from "@/components/ui/skeleton";
import EquipmentCardSkeleton from "./equipment-card-skeleton";

/**
 * Loading skeleton for the "Browse Equipment" page
 * (`src/app/(root)/all-equipment/page.tsx`): heading, filter sidebar,
 * result count, and the responsive grid of equipment cards.
 */
const AllEquipmentSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Heading ──────────────────────────────────────── */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        {/* ── Filter sidebar ───────────────────────────────── */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="space-y-4 rounded-xl border p-4">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-full" />
              ))}
            </div>
            <div className="space-y-2 border-t pt-4">
              <Skeleton className="h-4 w-20" />
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-full" />
              ))}
            </div>
          </div>
        </aside>

        {/* ── Results ──────────────────────────────────────── */}
        <section className="min-w-0">
          <Skeleton className="mb-3 h-4 w-32" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EquipmentCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllEquipmentSkeleton;