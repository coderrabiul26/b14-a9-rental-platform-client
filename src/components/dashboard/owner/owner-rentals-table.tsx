"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SearchIcon,
  PackageIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
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
import type { TOwnerRental } from "@/types";

interface OwnerRentalsTableProps {
  initialRentals: TOwnerRental[];
}

export default function OwnerRentalsTable({ initialRentals }: OwnerRentalsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = initialRentals.filter((item) => {
    const matchesSearch =
      item.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      item.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (item.contactNumber && item.contactNumber.includes(search));

    const status = (item.bookingStatus || (item.paymentStatus === "paid" ? "confirmed" : "pending")).toLowerCase();
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filter Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search equipment or customer email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-card pl-9 pr-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "confirmed", "active", "completed"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                statusFilter === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table (PDF Requirements: Customer Info, Equipment Info, Duration, Quantity, Booking Amount, Payment Status, Booking Status) */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Customer Information</TableHead>
              <TableHead className="font-bold">Equipment Information</TableHead>
              <TableHead className="font-bold">Rental Duration</TableHead>
              <TableHead className="font-bold">Quantity</TableHead>
              <TableHead className="font-bold">Booking Amount</TableHead>
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
                    <p className="text-sm font-medium">No equipment rental records found</p>
                    <p className="text-xs">When customers book and pay for your equipment, orders appear here.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const isPaid = item.paymentStatus === "paid";
                const bookingStatus = (
                  item.bookingStatus || (isPaid ? "Confirmed" : "Pending")
                ).toLowerCase();

                return (
                  <TableRow key={item._id} className="hover:bg-muted/40 transition">
                    {/* Customer Information */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <UserIcon className="size-3.5 text-primary" />
                          {item.customerEmail}
                        </span>
                        {item.contactNumber && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <PhoneIcon className="size-3 text-muted-foreground" />
                            {item.contactNumber}
                          </span>
                        )}
                        {item.deliveryAddress && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate max-w-xs">
                            <MapPinIcon className="size-3 text-muted-foreground" />
                            {item.deliveryAddress}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Equipment Information */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground line-clamp-1">
                          {item.equipmentName}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          ID: {item.equipmentId.slice(-8)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Rental Duration */}
                    <TableCell className="text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground">
                          {item.startDate} &rarr; {item.endDate}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {item.days} day(s) &bull; {item.rentalType || "Daily"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Required Quantity */}
                    <TableCell className="text-xs">
                      <span className="rounded-md bg-muted px-2 py-0.5 font-semibold text-foreground">
                        {item.quantity} unit(s)
                      </span>
                    </TableCell>

                    {/* Booking Amount */}
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
                      <Button
                        nativeButton={false}
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs text-primary"
                        render={<Link href={`/all-equipment/${item.equipmentId}`} />}
                      >
                        Listing
                        <ExternalLinkIcon className="size-3" />
                      </Button>
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
