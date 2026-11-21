"use client";

import { motion } from "framer-motion";
import { TrendingUpIcon, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyEarningsItem {
  month: string;
  earnings: number;
}

interface OwnerAnalyticsChartProps {
  monthlyData: MonthlyEarningsItem[];
  totalEarnings: number;
}

export default function OwnerAnalyticsChart({
  monthlyData,
  totalEarnings,
}: OwnerAnalyticsChartProps) {
  const maxEarning = Math.max(...monthlyData.map((d) => d.earnings), 1000);

  return (
    <Card className="rounded-2xl shadow-xs">
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Monthly Earnings Performance</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Revenue generated from paid customer equipment rentals.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <TrendingUpIcon className="size-4" />
          <span>Total: ৳{totalEarnings.toLocaleString()}</span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Responsive Bar Chart Visualization */}
        <div className="mt-4 flex h-56 w-full items-end gap-3 sm:gap-6 pt-6 pb-2">
          {monthlyData.map((item, index) => {
            const heightPercent = Math.max(Math.round((item.earnings / maxEarning) * 100), 8);

            return (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2 h-full justify-end group">
                {/* Tooltip on hover */}
                <span className="text-[11px] font-bold text-primary opacity-0 transition group-hover:opacity-100">
                  ৳{item.earnings.toLocaleString()}
                </span>

                {/* Animated Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-primary/70 to-primary transition-all group-hover:from-primary group-hover:to-teal-400 group-hover:shadow-md cursor-pointer"
                />

                {/* Month Label */}
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
