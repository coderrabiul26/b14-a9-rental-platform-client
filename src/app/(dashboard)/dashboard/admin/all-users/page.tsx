import { headers } from "next/headers";
import Link from "next/link";
import { UsersIcon, ArrowLeftIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAdminUsers } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import AdminUsersTable from "@/components/dashboard/admin/admin-users-table";
import type { TAdminUser } from "@/types";

/**
 * Offline safety net: shown only when the users API cannot be
 * reached, so the admin users page never renders as a blank screen.
 */
const DEFAULT_ADMIN_USERS: TAdminUser[] = [
  {
    _id: "demo-user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    createdAt: "2026-01-15T10:30:00Z",
    blocked: false,
    phoneNumber: "+8801712345678",
    address: "Gulshan-1, Dhaka",
  },
  {
    _id: "demo-user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "owner",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    createdAt: "2026-02-20T14:45:00Z",
    blocked: false,
    phoneNumber: "+8801812345678",
    address: "Banani, Dhaka",
  },
  {
    _id: "demo-user-3",
    name: "Admin User",
    email: "admin@geargo.com",
    role: "admin",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    createdAt: "2026-01-01T00:00:00Z",
    blocked: false,
    phoneNumber: "+8801912345678",
    address: "Dhanmondi, Dhaka",
  },
  {
    _id: "demo-user-4",
    name: "Blocked User",
    email: "blocked@example.com",
    role: "customer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=blocked",
    createdAt: "2026-03-10T09:15:00Z",
    blocked: true,
    phoneNumber: "+8801612345678",
    address: "Uttara, Dhaka",
  },
];

export default async function AdminAllUsersPage() {
  await auth.api.getSession({
    headers: await headers(),
  });

  let users: TAdminUser[] = [];
  let usersError: string | null = null;
  let usingFallback = false;

  try {
    const data = await getAdminUsers();
    if (Array.isArray(data)) {
      users = data;
    } else {
      usersError = "Received an unexpected response while loading users.";
    }
  } catch (error) {
    console.error("Failed to load admin users:", error);
    usersError = "Could not load users right now. Please try again later.";
    usingFallback = true;
  }

  const displayUsers = usingFallback ? DEFAULT_ADMIN_USERS : users;

  const roleCounts = displayUsers.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const blockedCount = displayUsers.filter((u) => u.blocked).length;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl"
            nativeButton={false}
            render={<Link href="/dashboard/admin" />}
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              All Users
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage user accounts, change roles, and block or unblock access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <UsersIcon className="size-4 text-primary" />
              <span>{roleCounts.customer || 0} Customers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon className="size-4 text-emerald-600" />
              <span>{roleCounts.owner || 0} Owners</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon className="size-4 text-amber-600" />
              <span>{roleCounts.admin || 0} Admins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon className="size-4 text-destructive" />
              <span>{blockedCount} Blocked</span>
            </div>
          </div>
        </div>
      </div>

      {usersError && !usingFallback ? (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <p>{usersError}</p>
        </div>
      ) : (
        <AdminUsersTable initialUsers={displayUsers} />
      )}

      {usingFallback && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-600">
          The users API is unreachable right now — showing sample data.
        </p>
      )}
    </div>
  );
}