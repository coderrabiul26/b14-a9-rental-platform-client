"use client";

import { motion } from "framer-motion";
import { BarChart3Icon, CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MonthlyBookingItem {
  month: string;
  bookings: number;
}

interface AdminAnalyticsChartProps {
  monthlyData: MonthlyBookingItem[];
  totalBookings: number;
}

/**
 * Admin "Monthly Booking Statistics" bar chart (Challenge 3).
 *
 * Same framer-motion bar treatment as the owner earnings chart so both
 * dashboards feel like one product, tinted amber to match the admin view.
 */
export default function AdminAnalyticsChart({
  monthlyData,
  totalBookings,
}: AdminAnalyticsChartProps) {
  const maxBookings = Math.max(...monthlyData.map((d) => d.bookings), 1);

  return (
    <Card className="rounded-2xl shadow-xs">
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Monthly Booking Statistics</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Rental bookings created across the platform over the last 6 months.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600">
          <CalendarIcon className="size-4" />
          <span>Total: {totalBookings.toLocaleString()} bookings</span>
        </div>
      </CardHeader>

      <CardContent>
        {monthlyData.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 text-muted-foreground">
            <BarChart3Icon className="size-8 opacity-60" />
            <p className="text-sm font-medium">No booking data yet</p>
            <p className="text-xs">Statistics appear once customers start booking.</p>
          </div>
        ) : (
          <div className="mt-4 flex h-56 w-full items-end gap-3 pt-6 pb-2 sm:gap-6">
            {monthlyData.map((item, index) => {
              const heightPercent = Math.max(
                Math.round((item.bookings / maxBookings) * 100),
                8
              );

              return (
                <div
                  key={item.month}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  {/* Value on hover */}
                  <span className="text-[11px] font-bold text-amber-600 opacity-0 transition group-hover:opacity-100">
                    {item.bookings} booking{item.bookings === 1 ? "" : "s"}
                  </span>

                  {/* Animated bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="w-full max-w-[48px] cursor-pointer rounded-t-xl bg-gradient-to-t from-amber-500/70 to-amber-500 transition-all group-hover:from-amber-500 group-hover:to-orange-400 group-hover:shadow-md"
                  />

                  {/* Month label */}
                  <span className="text-xs font-medium text-muted-foreground transition group-hover:text-foreground">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
