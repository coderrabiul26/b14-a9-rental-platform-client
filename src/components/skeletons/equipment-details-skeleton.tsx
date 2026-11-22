import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the Equipment Details page
 * (`src/app/(root)/all-equipment/[id]/page.tsx`): back link, two-column
 * photo + summary, and the specifications / terms panels.
 */
const EquipmentDetailsSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Back link ────────────────────────────────────── */}
      <Skeleton className="mb-4 h-4 w-40" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Photo ────────────────────────────────────────── */}
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <Skeleton className="size-full rounded-none" />
        </div>

        {/* ── Summary ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-40" />
          </div>

          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>

      {/* ── Specs + terms ────────────────────────────────── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-foreground/10 bg-card px-4 py-2.5 last:border-b-0"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsSkeleton;