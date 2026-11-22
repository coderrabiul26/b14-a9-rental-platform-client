import type { LucideIcon } from "lucide-react";
import {
  BoxesIcon,
  CalendarClockIcon,
  ClipboardListIcon,
  GaugeCircleIcon,
  HeartIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PlusCircleIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import SidebarLogoutButton from "./sidebarLogoutButton";

/**
 * Role-based sidebar menu items with icons.
 */
const roleBasedSidebarItems: Record<
  string,
  { title: string; href: string; icon: LucideIcon; badge?: string }[]
> = {
  customer: [
    {
      title: "Overview",
      href: "/dashboard/customer",
      icon: GaugeCircleIcon,
    },
    {
      title: "My Rentals",
      href: "/dashboard/customer/my-rental",
      icon: CalendarClockIcon,
    },
    {
      title: "Favourites",
      href: "/dashboard/customer/favourites",
      icon: HeartIcon,
    },
    {
      title: "Profile",
      href: "/dashboard/customer/profile",
      icon: UserCircleIcon,
    },
  ],
  admin: [
    {
      title: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "All Users",
      href: "/dashboard/admin/all-users",
      icon: UsersIcon,
    },
    {
      title: "All Equipment",
      href: "/dashboard/admin/all-equipment",
      icon: PackageIcon,
    },
    {
      title: "All Rentals",
      href: "/dashboard/admin/all-rentals",
      icon: ClipboardListIcon,
    },
    {
      title: "My Profile",
      href: "/dashboard/admin/my-profile",
      icon: UserCircleIcon,
    },
  ],
  owner: [
    {
      title: "Overview",
      href: "/dashboard/owner",
      icon: GaugeCircleIcon,
    },
    {
      title: "Add Equipment",
      href: "/dashboard/owner/add-equipment",
      icon: PlusCircleIcon,
    },
    {
      title: "My Equipment",
      href: "/dashboard/owner/my-equipment",
      icon: BoxesIcon,
    },
    {
      title: "My Equipment Rental",
      href: "/dashboard/owner/my-equipment-rental",
      icon: CalendarClockIcon,
    },
    {
      title: "My Profile",
      href: "/dashboard/owner/my-profile",
      icon: UserCircleIcon,
    },
  ],
};

/**
 * Dashboard sidebar — role-filtered menu with icons, user card, and logout.
 *
 * Layout: header (logo) → scrollable menu groups → footer (user card + logout).
 *
 * Must be rendered inside a `<SidebarProvider>` (see `src/app/dashboard/layout.tsx`).
 */
const DashboardSidebar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = (session?.user?.role as string) || "customer";
  const sidebarItems =
    roleBasedSidebarItems[role] || roleBasedSidebarItems.customer;

  return (
    <Sidebar collapsible="offcanvas">
      {/* ── Header ─────────────────────────────────────────── */}
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <Logo nameClassName="text-base" />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Menu ────────────────────────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      tooltip={item.title}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ─────────────────────────────────────────── */}
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-2">
          <Avatar>
            <AvatarFallback>
              {(session?.user?.name || "User")
                .split(" ")
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold">
                {session?.user?.name || "Guest"}
              </span>
              <Badge variant="secondary" className="shrink-0 capitalize">
                {session?.user?.role || "customer"}
              </Badge>
            </div>
            <span className="truncate text-xs text-sidebar-foreground/70">
              {session?.user?.email || "guest@geargo.com"}
            </span>
          </div>

          <SidebarLogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
