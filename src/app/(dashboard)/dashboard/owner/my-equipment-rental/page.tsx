import { headers } from "next/headers";
import Link from "next/link";
import { PlusIcon, AlertTriangleIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOwnerRentals } from "@/lib/api/equipment";
import { Button } from "@/components/ui/button";
import OwnerRentalsTable from "@/components/dashboard/owner/owner-rentals-table";
import type { TOwnerRental } from "@/types";

export default async function MyEquipmentRentalPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  let rentals: TOwnerRental[] = [];
  let rentalsError: string | null = null;

  if (user?.email) {
    try {
      const data = await getOwnerRentals(user.email);
      if (Array.isArray(data)) {
        rentals = data;
      } else {
        rentalsError = "Received an unexpected response while loading rentals.";
      }
    } catch (error) {
      console.error("Failed to load owner rentals:", error);
      rentalsError = "Could not load your rentals right now. Please try again later.";
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Equipment Rentals
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming bookings on your equipment, customer contact details, and payment verification.
          </p>
        </div>

        <Button
          nativeButton={false}
          className="gap-2 rounded-xl"
          render={<Link href="/dashboard/owner/add-equipment" />}
        >
          <PlusIcon className="size-4" />
          List New Equipment
        </Button>
      </div>

      {rentalsError ? (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangleIcon className="size-5 shrink-0" />
          <p>{rentalsError}</p>
        </div>
      ) : (
        /* Owner Rentals Table (All PDF requirements) */
        <OwnerRentalsTable initialRentals={rentals} />
      )}
    </div>
  );
}
