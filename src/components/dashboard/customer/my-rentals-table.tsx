"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SearchIcon,
  PackageIcon,
  CalendarIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TCustomerBooking } from "@/types";

interface MyRentalsTableProps {
  initialBookings: TCustomerBooking[];
}

export default function MyRentalsTable({ initialBookings }: MyRentalsTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = initialBookings.filter((b) => {
    const matchesSearch = b.equipmentName.toLowerCase().includes(search.toLowerCase());
    const status = (b.bookingStatus || "confirmed").toLowerCase();
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (val?: string | Date) => {
    if (!val) return "N/A";
    const str = typeof val === "string" ? val : val.toISOString();
    try {
      return new Date(str).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return str;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search equipment name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-card pl-9 pr-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "active", "confirmed", "completed"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterStatus(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filterStatus === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Required by PDF: Equipment Name, Rental Start Date, Rental End Date, Booking Date, Total Amount, Payment Status, Booking Status */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Equipment Name</TableHead>
              <TableHead className="font-bold">Rental Start Date</TableHead>
              <TableHead className="font-bold">Rental End Date</TableHead>
              <TableHead className="font-bold">Booking Date</TableHead>
              <TableHead className="font-bold">Total Amount</TableHead>
              <TableHead className="font-bold">Payment Status</TableHead>
              <TableHead className="font-bold">Booking Status</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageIcon className="size-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">No rental bookings found</p>
                    <p className="text-xs">Browse equipment listings to book your first rental.</p>
                    <Button
                      nativeButton={false}
                      size="sm"
                      className="mt-2 rounded-xl"
                      render={<Link href="/all-equipment" />}
                    >
                      Browse Equipment
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const bookingStatus = (item.bookingStatus || "confirmed").toLowerCase();
                const isPaid = item.paymentStatus === "paid";

                return (
                  <TableRow key={item._id} className="hover:bg-muted/40 transition">
                    {/* Equipment Name */}
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <PackageIcon className="size-4 text-primary shrink-0" />
                        <span className="line-clamp-1">{item.equipmentName}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        Qty: {item.quantity || 1} unit(s)
                      </span>
                    </TableCell>

                    {/* Rental Start Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{item.startDate}</span>
                    </TableCell>

                    {/* Rental End Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{item.endDate}</span>
                      <span className="block text-[10px] text-muted-foreground">
                        ({item.days} days)
                      </span>
                    </TableCell>

                    {/* Booking Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(item.bookingDate || item.createdAt)}
                    </TableCell>

                    {/* Total Amount */}
                    <TableCell>
                      <span className="font-bold text-primary">
                        ৳{Number(item.amount).toLocaleString()}
                      </span>
                    </TableCell>

                    {/* Payment Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isPaid
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        }
                      >
                        {isPaid ? "Paid (Stripe)" : "Pending"}
                      </Badge>
                    </TableCell>

                    {/* Booking Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          bookingStatus === "completed"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                            : bookingStatus === "active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : "bg-purple-500/10 text-purple-600 border-purple-500/30"
                        }
                      >
                        {bookingStatus}
                      </Badge>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      {item.equipmentId && (
                        <Button
                          nativeButton={false}
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs text-primary hover:bg-primary/10"
                          render={<Link href={`/all-equipment/${item.equipmentId}`} />}
                        >
                          Details
                          <ExternalLinkIcon className="size-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
