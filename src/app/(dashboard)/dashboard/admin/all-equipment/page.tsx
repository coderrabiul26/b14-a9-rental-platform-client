import { headers } from "next/headers";
import Link from "next/link";
import { PackageIcon, ClockIcon, CheckCircle2Icon, XCircleIcon, ArrowLeftIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAdminEquipment } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import AdminEquipmentTable from "@/components/dashboard/admin/admin-equipment-table";
import type { TAdminEquipment } from "@/types";

/**
 * Offline safety net: shown only when the equipment API cannot be
 * reached, so the admin equipment page never renders as a blank screen.
 */
const DEFAULT_ADMIN_EQUIPMENT: TAdminEquipment[] = [
  {
    _id: "demo-eq-1",
    name: "Sony FX3 Cinema Camera",
    description: "Professional 4K cinema camera with XLR audio unit.",
    category: "Photography Equipment",
    location: "Gulshan-1, Dhaka",
    rentalPrice: 3500,
    rentalType: "Daily",
    availableQuantity: 3,
    condition: "Like New",
    brand: "Sony",
    model: "ILME-FX3",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    terms: "Security deposit of ৳10,000 required.",
    ownerEmail: "media.rentals@geargo.com",
    status: "approved",
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-01-15T10:30:00Z",
    reviewedAt: "2026-01-16T09:00:00Z",
  },
  {
    _id: "demo-eq-2",
    name: "CAT 305 Mini Excavator",
    description: "Compact excavator with 18-inch bucket and enclosed cab.",
    category: "Construction Equipment",
    location: "Uttara Sector 10, Dhaka",
    rentalPrice: 12000,
    rentalType: "Daily",
    availableQuantity: 2,
    condition: "Good",
    brand: "Caterpillar",
    model: "305 CR",
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
    terms: "Diesel provided by renter.",
    ownerEmail: "buildtech@geargo.com",
    status: "pending",
    createdAt: "2026-02-20T14:45:00Z",
    updatedAt: "2026-02-20T14:45:00Z",
  },
  {
    _id: "demo-eq-3",
    name: "John Deere 5050D Tractor",
    description: "Heavy duty 50 HP tractor with hydraulic power steering.",
    category: "Agriculture Equipment",
    location: "Joydebpur, Gazipur",
    rentalPrice: 15000,
    rentalType: "Weekly",
    availableQuantity: 1,
    condition: "Good",
    brand: "John Deere",
    model: "5050D",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
    terms: "Weekly minimum rental.",
    ownerEmail: "agrorent@geargo.com",
    status: "rejected",
    createdAt: "2026-03-10T09:15:00Z",
    updatedAt: "2026-03-10T09:15:00Z",
    reviewedAt: "2026-03-11T10:00:00Z",
  },
];

export default async function AdminAllEquipmentPage() {
  await auth.api.getSession({
    headers: await headers(),
  });

  let equipment: TAdminEquipment[] = [];
  let equipmentError: string | null = null;
  let usingFallback = false;

  try {
    const data = await getAdminEquipment();
    if (Array.isArray(data)) {
      equipment = data;
    } else {
      equipmentError = "Received an unexpected response while loading equipment.";
    }
  } catch (error) {
    console.error("Failed to load admin equipment:", error);
    equipmentError = "Could not load equipment right now. Please try again later.";
    usingFallback = true;
  }

  const displayEquipment = usingFallback ? DEFAULT_ADMIN_EQUIPMENT : equipment;

  const statusCounts = displayEquipment.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl"
            nativeButton={false}
            render={<Link href="/dashboard/admin" />}
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              All Equipment
            </h1>
            <p className="text-sm text-muted-foreground">
              Review, approve, reject, or delete equipment listings from all owners.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ClockIcon className="size-4 text-amber-600" />
              <span>{statusCounts.pending || 0} Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2Icon className="size-4 text-emerald-600" />
              <span>{statusCounts.approved || 0} Approved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircleIcon className="size-4 text-destructive" />
              <span>{statusCounts.rejected || 0} Rejected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PackageIcon className="size-4 text-primary" />
              <span>{displayEquipment.length} Total</span>
            </div>
          </div>
        </div>
      </div>

      {equipmentError && !usingFallback ? (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <p>{equipmentError}</p>
        </div>
      ) : (
        <AdminEquipmentTable initialEquipment={displayEquipment} />
      )}

      {usingFallback && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-600">
          The equipment API is unreachable right now — showing sample data.
        </p>
      )}
    </div>
  );
}