"use client";

import { useState } from "react";
import {
  SearchIcon,
  PackageIcon,
  MapPinIcon,
  DollarSignIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  MoreHorizontalIcon,
  Trash2Icon,
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
import type { TAdminEquipment } from "@/types";
import { updateEquipmentStatus, deleteAdminEquipment } from "@/lib/api/admin";

interface AdminEquipmentTableProps {
  initialEquipment: TAdminEquipment[];
}

export default function AdminEquipmentTable({ initialEquipment }: AdminEquipmentTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = initialEquipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.ownerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (equipmentId: string, newStatus: string) => {
    setUpdating(equipmentId);
    try {
      const result = await updateEquipmentStatus(equipmentId, newStatus);
      if (result.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update equipment status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (equipmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this equipment listing? This action cannot be undone.")) {
      return;
    }
    setUpdating(equipmentId);
    try {
      const result = await deleteAdminEquipment(equipmentId);
      if (result.success || result.deletedCount > 0) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to delete equipment:", error);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <CheckCircle2Icon className="size-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            <XCircleIcon className="size-3 mr-1" />
            Rejected
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

  const getStatusActions = (status: string) => {
    const actions = [];
    if (status !== "approved") {
      actions.push({ label: "Approve", status: "approved" as const, icon: CheckCircle2Icon, color: "text-emerald-600" });
    }
    if (status !== "rejected") {
      actions.push({ label: "Reject", status: "rejected" as const, icon: XCircleIcon, color: "text-destructive" });
    }
    if (status !== "pending") {
      actions.push({ label: "Set to Pending", status: "pending" as const, icon: AlertCircleIcon, color: "text-amber-600" });
    }
    return actions;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, category, location, owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-card pl-9 pr-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border bg-card px-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Equipment</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Owner</TableHead>
              <TableHead className="font-bold">Price / Type</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Qty</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Added</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageIcon className="size-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">No equipment found</p>
                    <p className="text-xs">Try adjusting your search or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item._id} className="hover:bg-muted/40 transition">
                  {/* Equipment Info with Image */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback className="bg-muted">
                          <PackageIcon className="size-5 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate max-w-xs">{item.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{item.category}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{item._id.slice(-8)}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  </TableCell>

                  {/* Owner */}
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MailIcon className="size-3.5 shrink-0" />
                      <span className="truncate max-w-xs">{item.ownerEmail}</span>
                    </div>
                  </TableCell>

                  {/* Price / Type */}
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <DollarSignIcon className="size-3.5 shrink-0 text-primary" />
                      <span className="font-semibold">৳{Number(item.rentalPrice).toLocaleString()}</span>
                      <span className="text-muted-foreground">/</span>
                      <Badge variant="outline" className="text-xs h-5 px-2">
                        {item.rentalType}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPinIcon className="size-3.5 shrink-0" />
                      <span className="truncate max-w-xs">{item.location}</span>
                    </div>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell className="text-center">
                    <span className={`rounded-md px-2 py-0.5 font-semibold text-xs ${
                      item.availableQuantity > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
                    }`}>
                      {item.availableQuantity} unit(s)
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>{getStatusBadge(item.status)}</TableCell>

                  {/* Added Date */}
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ClockIcon className="size-3.5 shrink-0" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8"
                        disabled={updating === item._id}
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {getStatusActions(item.status).map((action) => (
                          <DropdownMenuItem
                            key={action.status}
                            onClick={() => handleStatusChange(item._id, action.status)}
                            disabled={updating === item._id}
                            className={`flex items-center gap-2 ${action.color}`}
                          >
                            <action.icon className="size-3.5" />
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                          onClick={() => handleDelete(item._id)}
                          disabled={updating === item._id}
                          className="text-destructive flex items-center gap-2"
                        >
                          <Trash2Icon className="size-3.5" />
                          Delete
                        </DropdownMenuItem>
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