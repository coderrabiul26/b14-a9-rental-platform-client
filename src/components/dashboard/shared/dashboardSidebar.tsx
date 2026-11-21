import type { LucideIcon } from "lucide-react";
import {
  BoxesIcon,
  CalendarClockIcon,
  CreditCardIcon,
  GaugeCircleIcon,
  LifeBuoyIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TSidebarMenuGroup, TSidebarMenuItem } from "@/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

/**
 * DEMO DATA — placeholder menu items only.
 *
 * TODO (roles & menu): replace this with the real, role-filtered menu
 * (e.g. fetched per session role) and swap the `<button>` below for a
 * `SidebarMenuButton render={<Link href={item.href} />}`.
 */


const roleBasedSidebarItems: Record<string, { title: string; href: string }[]> = {
    customer:[
        {
            title: 'Overview',
            href: '/dashboard/customer',
        },
        {
            title: 'My Rentals',
            href: '/dashboard/customer/my-rental',
        },
        {
            title: 'Favourites',
            href: '/dashboard/customer/favourites',
        },
        {
            title: 'Profile',
            href: '/dashboard/customer/profile',
        }

    ],
    admin:[
        {
            title: 'Overview',
            href: '/dashboard/admin',
        },
        {
            title: 'All Users',
            href: '/dashboard/admin/all-users',
        },
        {
            title: 'All Equipment',
            href: '/dashboard/admin/all-equipment',
        },
        {
            title: 'All Rentals',
            href: '/dashboard/admin/all-rentals',
        },
         {
            title: 'My Profile',
            href: '/dashboard/admin/my-profile',
        }


    ],
    owner:[
        {
            title: 'Overview',
            href: '/dashboard/owner',
        },
        {
            title: 'Add Equipment',
            href: '/dashboard/owner/add-equipment',
        },
        {
            title: 'My Equipment',
            href: '/dashboard/owner/my-equipment',
        },
        {
            title: 'My Equipment Rental',
            href: '/dashboard/owner/my-equipment-rental',
        },
         {
            title: 'My Profile',
            href: '/dashboard/owner/my-profile',
        }

    ]
}
/**
 * DEMO DATA — placeholder signed-in user for the footer.
 * Replace with the real session user once roles are wired up.
 */


/**
 * Dashboard sidebar — structure only (no auth / role / routing logic yet).
 *
 * Layout: header (logo + collapse trigger) → scrollable menu groups →
 * footer (user card with role badge + logout).
 *
 * Must be rendered inside a `<SidebarProvider>` (see `src/app/dashboard/layout.tsx`).
 */
const DashboardSidebar = async() => {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
    

    const role = (session?.user?.role as string) || "customer";
    const sidebarItems = roleBasedSidebarItems[role] || roleBasedSidebarItems.customer;
  

  return (
    <Sidebar collapsible="offcanvas">
      {/* ── Header ─────────────────────────────────────────── */}
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <Logo nameClassName="text-base" />
          {/* <SidebarTrigger aria-label="Collapse sidebar" /> */}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Menu (demo items) ──────────────────────────────── */}
      {/* <SidebarContent>
        {DEMO_MENU.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.isActive} tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent> */}
      <SidebarContent>{
        sidebarItems.map((item)=>{
            const {title, href}= item;
            return  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton render={<Link href={item.href} />} tooltip={item.title}>
                      <span>{item.title}</span>
                    </SidebarMenuButton>

                  </SidebarMenuItem>
        })}</SidebarContent>
        
     
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

          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            aria-label="Log out"
          >
            <LogOutIcon />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
