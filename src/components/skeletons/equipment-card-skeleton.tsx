import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder that mirrors <EquipmentCard /> from
 * `src/components/owner/equipmentCard.tsx` — image, badges, title,
 * price row, and footer CTA.
 */
const EquipmentCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Skeleton className="size-full rounded-none" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        <div className="flex items-baseline justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>

        <Skeleton className="h-3 w-2/5" />

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default EquipmentCardSkeleton;