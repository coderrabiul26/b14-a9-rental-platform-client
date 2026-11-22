"use client";

import { useState } from "react";
import {
  SearchIcon,
  PackageIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  ActivityIcon,
  MoreHorizontalIcon,
  MailIcon,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TAdminBooking } from "@/types";
import { updateBookingStatus } from "@/lib/api/admin";

interface AdminBookingsTableProps {
  initialBookings: TAdminBooking[];
}

export default function AdminBookingsTable({ initialBookings }: AdminBookingsTableProps) {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = initialBookings.filter((item) => {
    const matchesSearch =
      item.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      item.ownerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesPayment = paymentFilter === "all" || item.paymentStatus === paymentFilter;
    const matchesBooking = bookingFilter === "all" || item.bookingStatus === bookingFilter;

    return matchesSearch && matchesPayment && matchesBooking;
  });

  const handleBookingStatusChange = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId);
    try {
      const result = await updateBookingStatus(bookingId, newStatus);
      if (result.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update booking status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <CheckCircle2Icon className="size-3 mr-1" />
            Paid
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
            <AlertCircleIcon className="size-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getBookingBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
            <CheckCircle2Icon className="size-3 mr-1" />
            Completed
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <ActivityIcon className="size-3 mr-1" />
            Active
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
            <CheckCircle2Icon className="size-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            <XCircleIcon className="size-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
            <AlertCircleIcon className="size-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getBookingStatusActions = (currentStatus?: string) => {
    const allStatuses: Array<{ label: string; value: string; icon: typeof CheckCircle2Icon | typeof ActivityIcon | typeof XCircleIcon | typeof AlertCircleIcon; color: string }> = [
      { label: "Confirm", value: "confirmed", icon: CheckCircle2Icon, color: "text-purple-600" },
      { label: "Activate", value: "active", icon: ActivityIcon, color: "text-emerald-600" },
      { label: "Complete", value: "completed", icon: CheckCircle2Icon, color: "text-blue-600" },
      { label: "Cancel", value: "cancelled", icon: XCircleIcon, color: "text-destructive" },
      { label: "Set to Pending", value: "pending", icon: AlertCircleIcon, color: "text-amber-600" },
    ];

    return allStatuses.filter((s) => s.value !== currentStatus);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search equipment, customer, owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-card pl-9 pr-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-xl border bg-card px-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Payment</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
            className="rounded-xl border bg-card px-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Booking Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Booking</TableHead>
              <TableHead className="font-bold">Customer</TableHead>
              <TableHead className="font-bold">Owner</TableHead>
              <TableHead className="font-bold">Equipment</TableHead>
              <TableHead className="font-bold">Duration</TableHead>
              <TableHead className="font-bold">Qty</TableHead>
              <TableHead className="font-bold">Amount</TableHead>
              <TableHead className="font-bold">Payment</TableHead>
              <TableHead className="font-bold">Booking Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageIcon className="size-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">No rental bookings found</p>
                    <p className="text-xs">Try adjusting your search or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item._id} className="hover:bg-muted/40 transition">
                  {/* Booking ID */}
                  <TableCell className="text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item._id.slice(-8)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={item.customerImage || undefined} alt={item.customerName} />
                        <AvatarFallback>
                          {item.customerName
                            .split(" ")
                            .map((part) => part.charAt(0))
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate max-w-xs">{item.customerName || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{item.customerEmail}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Owner */}
                  <TableCell className="text-sm">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <UserIcon className="size-3.5 shrink-0" />
                        <span className="truncate max-w-xs">{item.ownerName || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MailIcon className="size-3.5 shrink-0" />
                        <span className="truncate max-w-xs">{item.ownerEmail}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Equipment */}
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-muted">
                          <PackageIcon className="size-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate max-w-xs">{item.equipmentName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{item.equipmentId.slice(-8)}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Duration */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <CalendarIcon className="size-3.5 shrink-0" />
                        <span>{item.startDate} → {item.endDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <ClockIcon className="size-3 shrink-0" />
                        <span>{item.days} day(s) · {item.rentalType || "Daily"}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell className="text-center">
                    <span className="rounded-md bg-muted px-2 py-0.5 font-semibold text-foreground text-sm">
                      {item.quantity} unit(s)
                    </span>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    <span className="font-bold text-primary">
                      ৳{Number(item.amount).toLocaleString()}
                    </span>
                  </TableCell>

                  {/* Payment Status */}
                  <TableCell>{getPaymentBadge(item.paymentStatus)}</TableCell>

                  {/* Booking Status */}
                  <TableCell>{getBookingBadge(item.bookingStatus)}</TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8"
                        disabled={updating === item._id}
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {getBookingStatusActions(item.bookingStatus).map((action) => (
                          <DropdownMenuItem
                            key={action.value}
                            onClick={() => handleBookingStatusChange(item._id, action.value)}
                            disabled={updating === item._id}
                            className={`flex items-center gap-2 ${action.color}`}
                          >
                            <action.icon className="size-3.5" />
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}