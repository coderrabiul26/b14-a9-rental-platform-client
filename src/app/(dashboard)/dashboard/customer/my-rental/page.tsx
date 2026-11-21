import { headers } from "next/headers";
import Link from "next/link";
import { PackageIcon, PlusIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCustomerBookings } from "@/lib/api/equipment";
import { Button } from "@/components/ui/button";
import MyRentalsTable from "@/components/dashboard/customer/my-rentals-table";
import type { TCustomerBooking } from "@/types";

const DEMO_BOOKINGS: TCustomerBooking[] = [
  {
    _id: "demo-bk-1",
    equipmentId: "demo-fx3",
    equipmentName: "Sony FX3 Cinema Line Full-Frame Camera",
    customerId: "cust-1",
    customerEmail: "customer@geargo.com",
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
    _id: "demo-bk-2",
    equipmentId: "demo-jbl-prx",
    equipmentName: "JBL PRX ONE All-in-One Column PA System",
    customerId: "cust-1",
    customerEmail: "customer@geargo.com",
    startDate: "2026-11-10",
    endDate: "2026-11-12",
    days: 3,
    quantity: 2,
    amount: 24000,
    currency: "bdt",
    rentalType: "Daily",
    unitPrice: 4000,
    contactNumber: "+880 1711-223344",
    deliveryAddress: "Gulshan-2, Dhaka",
    paymentStatus: "paid",
    transactionId: "pi_3MtwDemoStripe002",
    bookingStatus: "completed",
    bookingDate: "2026-11-09",
    createdAt: "2026-11-09T08:30:00Z",
  },
  {
    _id: "demo-bk-3",
    equipmentId: "demo-cat305",
    equipmentName: "CAT 305 CR Mini Hydraulic Excavator",
    customerId: "cust-1",
    customerEmail: "customer@geargo.com",
    startDate: "2026-11-25",
    endDate: "2026-11-27",
    days: 3,
    quantity: 1,
    amount: 36000,
    currency: "bdt",
    rentalType: "Daily",
    unitPrice: 12000,
    contactNumber: "+880 1711-223344",
    deliveryAddress: "Uttara Sector 10, Dhaka",
    paymentStatus: "paid",
    transactionId: "pi_3MtwDemoStripe003",
    bookingStatus: "confirmed",
    bookingDate: "2026-11-21",
    createdAt: "2026-11-21T14:00:00Z",
  },
];

export default async function MyRentalsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  let bookings: TCustomerBooking[] = [];
  try {
    if (user?.email) {
      const data = await getCustomerBookings(user.email);
      if (Array.isArray(data)) {
        bookings = data;
      }
    }
  } catch {
    bookings = [];
  }

  // Show live database bookings for the logged-in user
  const displayBookings = user ? bookings : DEMO_BOOKINGS;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Rentals
          </h1>
          <p className="text-sm text-muted-foreground">
            View all your equipment bookings, check payment confirmations, and monitor return statuses.
          </p>
        </div>

        <Button
          nativeButton={false}
          className="gap-2 rounded-xl"
          render={<Link href="/all-equipment" />}
        >
          <PlusIcon className="size-4" />
          Rent New Equipment
        </Button>
      </div>

      {/* Interactive Rentals Table (PDF Spec columns) */}
      <MyRentalsTable initialBookings={displayBookings} />
    </div>
  );
}
