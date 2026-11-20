import Link from "next/link";
import { ImageIcon, MapPinIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TOwnerEquipment } from "@/types";

/**
 * Equipment card used in the public "All Equipment" grid.
 *
 * Server component — it has no click handlers of its own:
 * the "View Details" button is just a Link.
 */
export function EquipmentCard({ equipment }: { equipment: TOwnerEquipment }) {
  // A unit is rentable only when at least one is in stock.
  const isAvailable = equipment.availableQuantity > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10 transition hover:shadow-md">
      {/* ── Equipment Image ─────────────────────────────────── */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {equipment.image ? (
          // Plain <img> on purpose: the photo is hosted on ImgBB (an external
          // domain) which is not set up in next.config.ts → next/image would
          // throw at runtime. Switch to <Image> once you add remotePatterns.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={equipment.image}
            alt={equipment.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageIcon className="size-8" />
            <span className="text-xs">No photo</span>
          </div>
        )}

        {/* Availability Status — pill on top of the photo */}
        <Badge
          variant="outline"
          className={cn(
            "absolute top-2 left-2 border-transparent",
            isAvailable
              ? "bg-emerald-500 text-white hover:bg-emerald-500"
              : "bg-red-500/90 text-white hover:bg-red-500/90"
          )}
        >
          {isAvailable ? "Available" : "Out of Stock"}
        </Badge>
      </div>

      {/* ── Card body ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        {/* Name + Category */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-1 font-semibold leading-snug">
            {equipment.name}
          </h2>
          <Badge variant="secondary" className="shrink-0">
            {equipment.category}
          </Badge>
        </div>

        {/* Rental Price + Rental Type */}
        <p className="flex items-baseline gap-1">
          <span className="text-xl font-bold tracking-tight text-primary">
            ৳{equipment.rentalPrice}
          </span>
          <span className="text-xs text-muted-foreground">
            / {equipment.rentalType.toLowerCase()}
          </span>
        </p>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-4 shrink-0" />
          <span className="line-clamp-1">{equipment.location}</span>
        </p>

        {/* ── Footer: stock count + View Details ────────────── */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-2.5">
          <span
            className={cn(
              "text-xs font-medium",
              isAvailable ? "text-emerald-600" : "text-destructive"
            )}
          >
            {isAvailable
              ? `${equipment.availableQuantity} unit(s) in stock`
              : "No units available"}
          </span>

          {/* TODO (you): create the details page at
              src/app/all-equipment/[id]/page.tsx
              (read `params.id`, fetch one item, show everything).
              Prefer a dialog instead? Swap the Link for a button with
              an empty onClick and open <Dialog> with this `equipment`. */}
          <Button
            nativeButton={false}
            size="sm"
            className="rounded-full"
            render={<Link href={`/all-equipment/${equipment._id}`} />}
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}

export default EquipmentCard;
