import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for dashboard pages
 * (`src/app/(dashboard)/dashboard/**`): page header, KPI metric card
 * grid, and the chart / table content area.
 *
 * Works for customer, owner, and admin overviews and list pages.
 */
const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <Skeleton className="h-8 w-40 rounded-xl" />
      </div>

      {/* ── KPI metric cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="size-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        ))}
      </div>

      {/* ── Chart ────────────────────────────────────────── */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-64 w-full rounded-xl" />
      </div>

      {/* ── Table ────────────────────────────────────────── */}
      <div className="rounded-2xl border bg-card shadow-xs">
        <div className="border-b p-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-2 h-3 w-72 max-w-full" />
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 border-b border-border py-3.5 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56 max-w-full" />
                  </div>
                </div>
                <div className="hidden items-center gap-4 sm:flex">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;