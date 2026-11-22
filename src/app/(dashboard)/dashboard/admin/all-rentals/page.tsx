import { headers } from "next/headers";
import Link from "next/link";
import { PackageIcon, CheckCircle2Icon, ArrowLeftIcon, AlertCircleIcon, DollarSignIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAdminBookings } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import AdminBookingsTable from "@/components/dashboard/admin/admin-bookings-table";
import type { TAdminBooking } from "@/types";

/**
 * Offline safety net: shown only when the bookings API cannot be
 * reached, so the admin rentals page never renders as a blank screen.
 */
const DEFAULT_ADMIN_BOOKINGS: TAdminBooking[] = [
  {
    _id: "demo-booking-1",
    equipmentId: "demo-eq-1",
    equipmentName: "Sony FX3 Cinema Camera",
    customerId: "demo-cust-1",
    customerEmail: "john@example.com",
    customerName: "John Doe",
    customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    ownerEmail: "media.rentals@geargo.com",
    ownerName: "Media Rentals",
    startDate: "2026-11-25",
    endDate: "2026-11-27",
    days: 3,
    quantity: 1,
    amount: 10500,
    currency: "bdt",
    rentalType: "Daily",
    unitPrice: 3500,
    contactNumber: "+8801712345678",
    deliveryAddress: "Gulshan-1, Dhaka",
    notes: "Need by Friday morning",
    paymentStatus: "paid",
    paymentId: "pay-1",
    transactionId: "pi_123",
    bookingStatus: "active",
    bookingDate: "2026-11-20T10:30:00Z",
    createdAt: "2026-11-20T10:30:00Z",
  },
  {
    _id: "demo-booking-2",
    equipmentId: "demo-eq-2",
    equipmentName: "CAT 305 Mini Excavator",
    customerId: "demo-cust-2",
    customerEmail: "jane@example.com",
    customerName: "Jane Smith",
    customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    ownerEmail: "buildtech@geargo.com",
    ownerName: "BuildTech",
    startDate: "2026-12-01",
    endDate: "2026-12-05",
    days: 5,
    quantity: 1,
    amount: 60000,
    currency: "bdt",
    rentalType: "Daily",
    unitPrice: 12000,
    contactNumber: "+8801812345678",
    deliveryAddress: "Uttara Sector 10, Dhaka",
    notes: "",
    paymentStatus: "paid",
    paymentId: "pay-2",
    transactionId: "pi_456",
    bookingStatus: "completed",
    bookingDate: "2026-11-15T14:45:00Z",
    createdAt: "2026-11-15T14:45:00Z",
  },
  {
    _id: "demo-booking-3",
    equipmentId: "demo-eq-3",
    equipmentName: "John Deere 5050D Tractor",
    customerId: "demo-cust-3",
    customerEmail: "bob@example.com",
    customerName: "Bob Wilson",
    customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    ownerEmail: "agrorent@geargo.com",
    ownerName: "AgroRent",
    startDate: "2026-11-30",
    endDate: "2026-12-06",
    days: 7,
    quantity: 1,
    amount: 15000,
    currency: "bdt",
    rentalType: "Weekly",
    unitPrice: 15000,
    contactNumber: "+8801912345678",
    deliveryAddress: "Joydebpur, Gazipur",
    notes: "Weekly rental",
    paymentStatus: "pending",
    paymentId: "pay-3",
    bookingStatus: "pending",
    bookingDate: "2026-11-10T09:15:00Z",
    createdAt: "2026-11-10T09:15:00Z",
  },
  {
    _id: "demo-booking-4",
    equipmentId: "demo-eq-1",
    equipmentName: "Sony FX3 Cinema Camera",
    customerId: "demo-cust-4",
    customerEmail: "alice@example.com",
    customerName: "Alice Brown",
    customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    ownerEmail: "media.rentals@geargo.com",
    ownerName: "Media Rentals",
    startDate: "2026-11-28",
    endDate: "2026-11-30",
    days: 3,
    quantity: 2,
    amount: 21000,
    currency: "bdt",
    rentalType: "Daily",
    unitPrice: 3500,
    contactNumber: "+8801612345678",
    deliveryAddress: "Banani, Dhaka",
    notes: "Two cameras for event",
    paymentStatus: "paid",
    paymentId: "pay-4",
    transactionId: "pi_789",
    bookingStatus: "confirmed",
    bookingDate: "2026-11-18T11:20:00Z",
    createdAt: "2026-11-18T11:20:00Z",
  },
];

export default async function AdminAllRentalsPage() {
  await auth.api.getSession({
    headers: await headers(),
  });

  let bookings: TAdminBooking[] = [];
  let bookingsError: string | null = null;
  let usingFallback = false;

  try {
    const data = await getAdminBookings();
    if (Array.isArray(data)) {
      bookings = data;
    } else {
      bookingsError = "Received an unexpected response while loading rentals.";
    }
  } catch (error) {
    console.error("Failed to load admin bookings:", error);
    bookingsError = "Could not load rentals right now. Please try again later.";
    usingFallback = true;
  }

  const displayBookings = usingFallback ? DEFAULT_ADMIN_BOOKINGS : bookings;

  const paymentCounts = displayBookings.reduce(
    (acc, b) => {
      acc[b.paymentStatus] = (acc[b.paymentStatus] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalRevenue = displayBookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + Number(b.amount), 0);

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
              All Rentals
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor every rental booking on the platform with customer, owner, and payment details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2Icon className="size-4 text-emerald-600" />
              <span>{paymentCounts.paid || 0} Paid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircleIcon className="size-4 text-amber-600" />
              <span>{paymentCounts.pending || 0} Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PackageIcon className="size-4 text-primary" />
              <span>{displayBookings.length} Total</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSignIcon className="size-4 text-emerald-600" />
              <span>৳{totalRevenue.toLocaleString()} Revenue</span>
            </div>
          </div>
        </div>
      </div>

      {bookingsError && !usingFallback ? (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <p>{bookingsError}</p>
        </div>
      ) : (
        <AdminBookingsTable initialBookings={displayBookings} />
      )}

      {usingFallback && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-600">
          The rentals API is unreachable right now — showing sample data.
        </p>
      )}
    </div>
  );
}