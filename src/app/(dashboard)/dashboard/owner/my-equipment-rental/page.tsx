import { headers } from "next/headers";
import Link from "next/link";
import { PlusIcon, PackageIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOwnerRentals } from "@/lib/api/equipment";
import { Button } from "@/components/ui/button";
import OwnerRentalsTable from "@/components/dashboard/owner/owner-rentals-table";
import type { TOwnerRental } from "@/types";

/** Fallback sample rental bookings if owner has no rentals yet */
const DEMO_OWNER_RENTALS: TOwnerRental[] = [
  {
    _id: "demo-own-rent-1",
    equipmentId: "demo-fx3",
    equipmentName: "Sony FX3 Cinema Line Full-Frame Camera",
    customerId: "cust-1",
    customerEmail: "customer1@email.com",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
    days: 4,
    quantity: 1,
    amount: 14000,
    currency: "bdt",
    rentalType: "Daily",
    unitPrice: 3500,
    contactNumber: "+880 1711-223344",
    deliveryAddress: "Dhanmondi 27, Dhaka",
    paymentStatus: "paid",
    transactionId: "pi_3MtwDemoStripe001",
    bookingStatus: "active",
    bookingDate: "2026-11-19",
    createdAt: "2026-11-19T10:00:00Z",
  },
  {
    _id: "demo-own-rent-2",
    equipmentId: "demo-cat305",
    equipmentName: "CAT 305 CR Mini Hydraulic Excavator",
    customerId: "cust-2",
    customerEmail: "contractor@buildcorp.com",
    startDate: "2026-11-25",
    endDate: "2026-11-28",
    days: 4,
    quantity: 1,
    amount: 48000,
    currency: "bdt",
    rentalType: "Daily",
    unitPrice: 12000,
    contactNumber: "+880 1722-334455",
    deliveryAddress: "Uttara Sector 10, Dhaka",
    paymentStatus: "paid",
    transactionId: "pi_3MtwDemoStripe002",
    bookingStatus: "confirmed",
    bookingDate: "2026-11-21",
    createdAt: "2026-11-21T12:00:00Z",
  },
];

export default async function MyEquipmentRentalPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  let rentals: TOwnerRental[] = [];
  try {
    if (user?.email) {
      const data = await getOwnerRentals(user.email);
      if (Array.isArray(data)) {
        rentals = data;
      }
    }
  } catch {
    rentals = [];
  }

  // Use live data from database if available, else demo data
  const displayRentals = rentals.length > 0 ? rentals : DEMO_OWNER_RENTALS;

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

      {/* Owner Rentals Table (All PDF requirements) */}
      <OwnerRentalsTable initialRentals={displayRentals} />
    </div>
  );
}
