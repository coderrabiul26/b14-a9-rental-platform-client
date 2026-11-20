import Link from "next/link";
import { ArrowLeftIcon, ImageIcon, MapPinIcon } from "lucide-react";
import { getEquipmentById } from "@/lib/api/equipment";
import EquipmentActions from "@/components/shared/equipmentActions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { TOwnerEquipment } from "@/types";

/** Colour for each listing status badge. */
const STATUS_STYLES: Record<string, string> = {
  approved: "border-transparent bg-emerald-500 text-white hover:bg-emerald-500",
  pending: "border-transparent bg-amber-500 text-white hover:bg-amber-500",
  rejected: "border-transparent bg-red-500/90 text-white hover:bg-red-500/90",
};

/**
 * Public "Equipment Details" page — /all-equipment/[id]
 *
 * Server component: it reads the id from the URL, asks the API for that one
 * item and lays it out. The only interactive parts (Book + favourite) live
 * in the client component <EquipmentActions />.
 */
const EquipmentDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  // ── Fetch ONE item ───────────────────────────────────────
  // Your getEquipmentById() already calls the API. Note: the API answers
  // 500 for an id that doesn't exist, so never assume the response is a
  // full equipment object — check it, and fall through to "not found".
  let equipment: TOwnerEquipment | null = null;
  try {
    const data = await getEquipmentById(id);
    equipment = data && typeof data === "object" && data._id ? data : null;
  } catch {
    equipment = null;
  }

  // ── Unknown / broken id ──────────────────────────────────
  if (!equipment) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Equipment not found
        </h1>
        <p className="text-sm text-muted-foreground">
          This listing doesn’t exist, or it has been removed.
        </p>
        <Link
          href="/all-equipment"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeftIcon className="size-4" /> Back to all equipment
        </Link>
      </div>
    );
  }

  // A unit is rentable only when at least one is in stock.
  const isAvailable = equipment.availableQuantity > 0;

  // Every remaining field, as label → value rows for the specs table.
  const specs: [string, string][] = [
    ["Brand", equipment.brand],
    ["Model", equipment.model],
    ["Condition", equipment.condition],
    ["Rental type", equipment.rentalType],
    ["Available units", String(equipment.availableQuantity)],
    ["Location", equipment.location],
    ["Listed by", equipment.ownerEmail],
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Back link ─────────────────────────────────────── */}
      <Link
        href="/all-equipment"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" /> Back to all equipment
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Left: photo ─────────────────────────────────── */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
          {equipment.image ? (
            // Plain <img> on purpose: the photo is hosted on an external
            // domain (ImgBB / Unsplash) that is not configured in
            // next.config.ts → next/image would throw at runtime.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={equipment.image}
              alt={equipment.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <ImageIcon className="size-10" />
              <span className="text-sm">No photo</span>
            </div>
          )}

          {/* Availability pill on top of the photo */}
          <Badge
            variant="outline"
            className={cn(
              "absolute top-3 left-3 border-transparent text-white",
              isAvailable
                ? "bg-emerald-500 hover:bg-emerald-500"
                : "bg-red-500/90 hover:bg-red-500/90"
            )}
          >
            {isAvailable ? "Available" : "Out of Stock"}
          </Badge>
        </div>

        {/* ── Right: summary + actions ────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Category + status badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{equipment.category}</Badge>
            <Badge
              variant="outline"
              className={cn(STATUS_STYLES[equipment.status])}
            >
              {equipment.status}
            </Badge>
          </div>

          {/* Name + location */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {equipment.name}
            </h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="size-4 shrink-0" />
              {equipment.location}
            </p>
          </div>

          {/* Price */}
          <p className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-primary">
              ৳{equipment.rentalPrice}
            </span>
            <span className="text-sm text-muted-foreground">
              / {equipment.rentalType.toLowerCase()}
            </span>
          </p>

          <Separator />

          {/* Description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {equipment.description}
          </p>

          {/* ── Book + favourite (client component) ────────── */}
          <EquipmentActions equipment={equipment} />
        </div>
      </div>

      {/* ── Specifications + terms ───────────────────────── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-base font-semibold">Specifications</h2>
          <dl className="mt-3 overflow-hidden rounded-xl ring-1 ring-foreground/10">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-foreground/10 bg-card px-4 py-2.5 text-sm last:border-b-0"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-base font-semibold">Rental terms</h2>
          <div className="mt-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {equipment.terms}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EquipmentDetailsPage;
