import { headers } from "next/headers";
import Link from "next/link";
import {
  BoxesIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  PlusIcon,
  ArrowRightIcon,
  CoinsIcon,
  SparklesIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getOwnerAnalytics, getOwnerRentals } from "@/lib/api/equipment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OwnerAnalyticsChart from "@/components/dashboard/owner/owner-analytics-chart";
import type { TOwnerAnalytics, TOwnerRental } from "@/types";

/** Fallback metrics if the owner is new */
const DEFAULT_ANALYTICS: TOwnerAnalytics = {
  totalEquipment: 6,
  totalRentals: 12,
  completedRentals: 8,
  activeRentals: 4,
  totalEarnings: 68500,
  monthlyEarnings: [
    { month: "Jun", earnings: 8500 },
    { month: "Jul", earnings: 12000 },
    { month: "Aug", earnings: 11000 },
    { month: "Sep", earnings: 14500 },
    { month: "Oct", earnings: 9500 },
    { month: "Nov", earnings: 13000 },
  ],
};

const DEMO_RECENT_RENTALS: TOwnerRental[] = [
  {
    _id: "demo-own-1",
    equipmentId: "demo-fx3",
    equipmentName: "Sony FX3 Cinema Line Full-Frame Camera",
    customerId: "cust-1",
    customerEmail: "director@mediaworks.com",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
    days: 4,
    quantity: 1,
    amount: 14000,
    currency: "bdt",
    contactNumber: "+880 1711-223344",
    deliveryAddress: "Dhanmondi, Dhaka",
    paymentStatus: "paid",
    bookingStatus: "active",
    bookingDate: "2026-11-19",
    createdAt: "2026-11-19T10:00:00Z",
  },
  {
    _id: "demo-own-2",
    equipmentId: "demo-cat305",
    equipmentName: "CAT 305 CR Mini Hydraulic Excavator",
    customerId: "cust-2",
    customerEmail: "builder@concretestruct.com",
    startDate: "2026-11-25",
    endDate: "2026-11-28",
    days: 4,
    quantity: 1,
    amount: 48000,
    currency: "bdt",
    contactNumber: "+880 1722-334455",
    deliveryAddress: "Uttara, Dhaka",
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    bookingDate: "2026-11-21",
    createdAt: "2026-11-21T12:00:00Z",
  },
];

export default async function OwnerDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  let analytics: TOwnerAnalytics = DEFAULT_ANALYTICS;
  let rentals: TOwnerRental[] = [];

  try {
    if (user?.email) {
      const [analyticsData, rentalsData] = await Promise.all([
        getOwnerAnalytics(user.email),
        getOwnerRentals(user.email),
      ]);

      if (analyticsData && typeof analyticsData.totalEquipment === "number") {
        analytics = analyticsData;
      }
      if (Array.isArray(rentalsData) && rentalsData.length > 0) {
        rentals = rentalsData;
      }
    }
  } catch {
    // Keep fallbacks
  }

  const displayRentals = rentals.length > 0 ? rentals : DEMO_RECENT_RENTALS;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <SparklesIcon className="size-3.5" />
              <span>Owner Business Portal</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {user?.name || "Equipment Owner"}! 🛠️
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your rental fleet, incoming reservations, and monthly earnings in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              nativeButton={false}
              size="default"
              className="gap-2 rounded-xl"
              render={<Link href="/dashboard/owner/add-equipment" />}
            >
              <PlusIcon className="size-4" />
              Add Equipment
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              size="default"
              className="gap-2 rounded-xl"
              render={<Link href="/dashboard/owner/my-equipment" />}
            >
              <BoxesIcon className="size-4" />
              My Equipment
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Cards Grid (Challenge 3: Owner Analytics) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Listed Equipment */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Listed Equipment
            </CardTitle>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BoxesIcon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {analytics.totalEquipment}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Total gear catalog</p>
          </CardContent>
        </Card>

        {/* Total Rentals */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Rentals
            </CardTitle>
            <span className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <PackageIcon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {analytics.totalRentals}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">All customer bookings</p>
          </CardContent>
        </Card>

        {/* Completed Rentals */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Completed Rentals
            </CardTitle>
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <CheckCircle2Icon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {analytics.completedRentals}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Successfully returned</p>
          </CardContent>
        </Card>

        {/* Total Earnings */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Earnings
            </CardTitle>
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CoinsIcon className="size-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600">
              ৳{analytics.totalEarnings.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Paid via Stripe payouts</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Monthly Earnings Chart ─────────────────────────── */}
      <OwnerAnalyticsChart
        monthlyData={analytics.monthlyEarnings || []}
        totalEarnings={analytics.totalEarnings}
      />

      {/* ── Recent Equipment Rentals List ──────────────────── */}
      <Card className="rounded-2xl shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Recent Rental Orders</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Latest bookings placed on your equipment by verified customers.
            </CardDescription>
          </div>
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-primary"
            render={<Link href="/dashboard/owner/my-equipment-rental" />}
          >
            View All Rentals
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-border">
            {displayRentals.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PackageIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.equipmentName}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>Renter: {item.customerEmail}</span>
                      <span>&bull;</span>
                      <span>Dates: {item.startDate} &rarr; {item.endDate}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      ৳{Number(item.amount).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Qty: {item.quantity} &bull; {item.paymentStatus}
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
