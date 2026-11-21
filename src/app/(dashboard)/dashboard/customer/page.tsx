import { headers } from "next/headers";
import Link from "next/link";
import {
  PackageIcon,
  CalendarCheckIcon,
  ClockIcon,
  CreditCardIcon,
  HeartIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getCustomerBookings } from "@/lib/api/equipment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TCustomerBooking } from "@/types";

/** Fallback sample bookings if the customer has not booked anything yet */
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
];

export default async function CustomerDashboardPage() {
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

  // Compute summary metrics
  const totalBookings = displayBookings.length;
  const activeBookings = displayBookings.filter(
    (b) => b.bookingStatus === "active" || (b.paymentStatus === "paid" && (!b.bookingStatus || b.bookingStatus === "confirmed"))
  ).length;
  const completedBookings = displayBookings.filter((b) => b.bookingStatus === "completed").length;
  const totalSpent = displayBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <SparklesIcon className="size-3.5" />
              <span>Customer Portal</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {user?.name || "Renter"}! 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your active equipment rentals, review past bookings, and discover new gear.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              nativeButton={false}
              size="default"
              className="gap-2 rounded-xl"
              render={<Link href="/all-equipment" />}
            >
              <PackageIcon className="size-4" />
              Rent Equipment
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              size="default"
              className="gap-2 rounded-xl"
              render={<Link href="/dashboard/customer/favourites" />}
            >
              <HeartIcon className="size-4" />
              Favorites
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Bookings */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Rentals
            </CardTitle>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PackageIcon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{totalBookings}</div>
            <p className="mt-1 text-xs text-muted-foreground">Equipment rental orders</p>
          </CardContent>
        </Card>

        {/* Active Rentals */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Active Rentals
            </CardTitle>
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ClockIcon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600">
              {activeBookings}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Currently in possession</p>
          </CardContent>
        </Card>

        {/* Completed Rentals */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Completed
            </CardTitle>
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <CalendarCheckIcon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {completedBookings}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Returned successfully</p>
          </CardContent>
        </Card>

        {/* Total Spend */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Spent
            </CardTitle>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCardIcon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-primary">
              ৳{totalSpent.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Processed via Stripe</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Rentals List ────────────────────────────── */}
      <Card className="rounded-2xl shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Recent Rentals</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Quick view of your latest booked gear.
            </CardDescription>
          </div>
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-primary"
            render={<Link href="/dashboard/customer/my-rental" />}
          >
            View All Rentals
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-border">
            {displayBookings.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                    <PackageIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.equipmentName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Period: {item.startDate} &rarr; {item.endDate} ({item.days} days) &bull; Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      ৳{Number(item.amount).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Stripe &bull; {item.paymentStatus}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      item.bookingStatus === "completed"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    }
                  >
                    {item.bookingStatus || "Confirmed"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
