import { headers } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ActivityIcon,
  ArrowRightIcon,
  BoxesIcon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  ClockIcon,
  CoinsIcon,
  PackageIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getAdminAnalytics } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminAnalyticsChart from "@/components/dashboard/admin/admin-analytics-chart";
import type { TAdminAnalytics } from "@/types";

/**
 * Offline safety net: shown only when the analytics API cannot be
 * reached (same pattern the owner dashboard uses), so the admin
 * overview never renders as a blank screen.
 */
const DEFAULT_ADMIN_ANALYTICS: TAdminAnalytics = {
  totalUsers: 48,
  totalCustomers: 31,
  totalOwners: 16,
  totalAdmins: 1,
  totalEquipment: 86,
  pendingApprovals: 12,
  totalBookings: 132,
  completedRentals: 94,
  activeRentals: 27,
  totalPayments: 118,
  totalRevenue: 486500,
  monthlyBookings: [
    { month: "Jun", bookings: 14 },
    { month: "Jul", bookings: 21 },
    { month: "Aug", bookings: 18 },
    { month: "Sep", bookings: 26 },
    { month: "Oct", bookings: 31 },
    { month: "Nov", bookings: 22 },
  ],
};

/** One KPI tile in the overview grid. */
function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <Card className="rounded-2xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {label}
        </CardTitle>
        <span
          className={`flex size-9 items-center justify-center rounded-xl ${accent}`}
        >
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  let analytics: TAdminAnalytics = DEFAULT_ADMIN_ANALYTICS;
  let usingFallback = false;

  try {
    const data = await getAdminAnalytics();
    if (data && typeof data.totalUsers === "number") {
      analytics = data;
    }
  } catch (error) {
    console.error("Failed to load admin analytics:", error);
    usingFallback = true;
  }

  const roleRows: { label: string; count: number; accent: string }[] = [
    {
      label: "Customers",
      count: analytics.totalCustomers,
      accent: "bg-primary",
    },
    {
      label: "Owners",
      count: analytics.totalOwners,
      accent: "bg-emerald-500",
    },
    {
      label: "Admins",
      count: analytics.totalAdmins,
      accent: "bg-amber-500",
    },
  ];
  const roleTotal = Math.max(
    roleRows.reduce((sum, r) => sum + r.count, 0),
    1
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheckIcon className="size-3.5" />
              <span>Admin Control Panel</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {user?.name || "Administrator"}! 🛡️
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Oversee users, approve listings, and track the platform&apos;s rental performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              nativeButton={false}
              size="default"
              className="gap-2 rounded-xl"
              render={<Link href="/dashboard/admin/all-users" />}
            >
              <UsersIcon className="size-4" />
              Manage Users
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              size="default"
              className="gap-2 rounded-xl"
              render={<Link href="/dashboard/admin/all-equipment" />}
            >
              <ClockIcon className="size-4" />
              {analytics.pendingApprovals} Pending
            </Button>
          </div>
        </div>
      </div>

      {usingFallback ? (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-600">
          The analytics API is unreachable right now — showing sample figures.
        </p>
      ) : null}

      {/* ── KPI Metric Cards (Challenge 3: Admin Analytics) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          hint={`${analytics.totalCustomers} customers · ${analytics.totalOwners} owners`}
          icon={<UsersIcon className="size-4" />}
          accent="bg-primary/10 text-primary"
        />
        <StatCard
          label="Total Equipment"
          value={analytics.totalEquipment.toLocaleString()}
          hint="Listings across all owners"
          icon={<BoxesIcon className="size-4" />}
          accent="bg-purple-500/10 text-purple-600"
        />
        <StatCard
          label="Total Bookings"
          value={analytics.totalBookings.toLocaleString()}
          hint={`${analytics.activeRentals} currently active`}
          icon={<PackageIcon className="size-4" />}
          accent="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          label="Pending Approvals"
          value={analytics.pendingApprovals.toLocaleString()}
          hint="Equipment waiting for review"
          icon={<ClockIcon className="size-4" />}
          accent="bg-amber-500/10 text-amber-600"
        />
        <StatCard
          label="Completed Rentals"
          value={analytics.completedRentals.toLocaleString()}
          hint="Bookings marked as returned"
          icon={<CheckCircle2Icon className="size-4" />}
          accent="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          label="Total Revenue"
          value={`৳${analytics.totalRevenue.toLocaleString()}`}
          hint={`From ${analytics.totalPayments} Stripe payments`}
          icon={<CoinsIcon className="size-4" />}
          accent="bg-emerald-500/10 text-emerald-600"
        />
      </div>

      {/* ── Chart + Role distribution ──────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminAnalyticsChart
            monthlyData={analytics.monthlyBookings || []}
            totalBookings={analytics.totalBookings}
          />
        </div>

        <Card className="rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold">User Roles</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              How registered users are distributed across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {roleRows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{row.label}</span>
                  <span className="font-semibold text-foreground">{row.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${row.accent}`}
                    style={{ width: `${Math.round((row.count / roleTotal) * 100)}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-1 flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              <ActivityIcon className="size-4 shrink-0 text-primary" />
              <span>
                {analytics.completedRentals} of {analytics.totalBookings} rentals completed
                platform-wide.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick navigation ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            href: "/dashboard/admin/all-users",
            title: "All Users",
            description: "Change roles, block or unblock accounts.",
            icon: <UsersIcon className="size-5" />,
            accent: "bg-primary/10 text-primary",
          },
          {
            href: "/dashboard/admin/all-equipment",
            title: "All Equipment",
            description: "Approve, reject, update or delete listings.",
            icon: <BoxesIcon className="size-5" />,
            accent: "bg-amber-500/10 text-amber-600",
          },
          {
            href: "/dashboard/admin/all-rentals",
            title: "All Rentals",
            description: "Monitor every rental activity on the platform.",
            icon: <CalendarCheckIcon className="size-5" />,
            accent: "bg-emerald-500/10 text-emerald-600",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-xs transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.accent}`}
            >
              {item.icon}
            </span>
            <div>
              <h3 className="flex items-center gap-1 text-sm font-semibold text-foreground">
                {item.title}
                <ArrowRightIcon className="size-3.5 opacity-0 transition group-hover:opacity-100" />
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <SparklesIcon className="size-3.5 text-primary" />
        Figures update live from MongoDB every time this page loads.
      </p>
    </div>
  );
}
