"use client";

import { useState } from "react";
import {
  SearchIcon,
  UserIcon,
  ShieldIcon,
  UserCheckIcon,
  UserXIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  Loader2Icon,
  MoreHorizontalIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TAdminUser } from "@/types";
import { updateUserRole, updateUserBlocked } from "@/lib/api/admin";

interface AdminUsersTableProps {
  initialUsers: TAdminUser[];
}

export default function AdminUsersTable({ initialUsers }: AdminUsersTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const handleRoleFilterChange = (value: string | null) => {
    setRoleFilter(value ?? "all");
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value ?? "all");
  };

  const filtered = initialUsers.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || item.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "blocked" && item.blocked === true) ||
      (statusFilter === "active" && item.blocked !== true);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleBlockToggle = async (userId: string, blocked: boolean) => {
    setUpdating(userId);
    try {
      const result = await updateUserBlocked(userId, !blocked);
      if (result.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update block status:", error);
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
            <ShieldIcon className="size-3 mr-1" />
            Admin
          </Badge>
        );
      case "owner":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <UserCheckIcon className="size-3 mr-1" />
            Owner
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
            <UserIcon className="size-3 mr-1" />
            Customer
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filter Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-card pl-9 pr-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">User</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Registered</TableHead>
              <TableHead className="font-bold">Contact</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserIcon className="size-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs">Try adjusting your search or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item._id} className="hover:bg-muted/40 transition">
                  {/* User Info with Avatar */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={item.image || undefined} alt={item.name} />
                        <AvatarFallback>
                          {item.name
                            .split(" ")
                            .map((part) => part.charAt(0))
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {item._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MailIcon className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="text-foreground">{item.email}</span>
                    </div>
                  </TableCell>

                  {/* Role with Dropdown */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={`w-full justify-between gap-2 h-8 px-2 inline-flex items-center border rounded-md bg-background text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${item.blocked ? "border-destructive text-destructive" : "border-input bg-background hover:bg-accent hover:text-accent-foreground"}`}
                        disabled={updating === item._id}
                      >
                        {getRoleBadge(item.role)}
                        <MoreHorizontalIcon className="size-3.5 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {["customer", "owner", "admin"].map((role) => (
                          <DropdownMenuItem
                            key={role}
                            className={
                              item.role === role
                                ? "bg-muted font-medium"
                                : ""
                            }
                            onClick={() => handleRoleChange(item._id, role)}
                            disabled={updating === item._id}
                          >
                            <div className="flex items-center gap-2">
                              {item.role === role && (
                                <UserCheckIcon className="size-3.5 text-primary" />
                              )}
                              <span className="capitalize">{role}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  {/* Status (Blocked/Active) */}
                  <TableCell>
                    <Button
                      variant={item.blocked ? "destructive" : "default"}
                      size="sm"
                      className="w-full gap-2 h-8"
                      onClick={() => handleBlockToggle(item._id, item.blocked || false)}
                      disabled={updating === item._id}
                    >
                      {updating === item._id ? (
                        <Loader2Icon className="size-3.5 animate-spin" />
                      ) : item.blocked ? (
                        <>
                          <UserXIcon className="size-3.5" />
                          Blocked
                        </>
                      ) : (
                        <>
                          <UserCheckIcon className="size-3.5" />
                          Active
                        </>
                      )}
                    </Button>
                  </TableCell>

                  {/* Registration Date */}
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarIcon className="size-3.5 shrink-0" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </TableCell>

                  {/* Contact Info */}
                  <TableCell className="text-sm">
                    <div className="flex flex-col gap-1">
                      {item.phoneNumber && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <PhoneIcon className="size-3.5 shrink-0" />
                          <span className="truncate max-w-xs">{item.phoneNumber}</span>
                        </div>
                      )}
                      {item.address && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <MailIcon className="size-3.5 shrink-0" />
                          <span className="truncate max-w-xs">{item.address}</span>
                        </div>
                      )}
                      {!item.phoneNumber && !item.address && (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8"
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(item._id, "customer")}
                          disabled={updating === item._id || item.role === "customer"}
                        >
                          Make Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(item._id, "owner")}
                          disabled={updating === item._id || item.role === "owner"}
                        >
                          Make Owner
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(item._id, "admin")}
                          disabled={updating === item._id || item.role === "admin"}
                        >
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBlockToggle(item._id, item.blocked || false)}
                          disabled={updating === item._id}
                          className={item.blocked ? "text-green-600" : "text-destructive"}
                        >
                          {item.blocked ? "Unblock User" : "Block User"}
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