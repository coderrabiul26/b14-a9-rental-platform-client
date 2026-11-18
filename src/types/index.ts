import { LucideIcon } from "lucide-react";

export type TUserRole= 'admin'|'owner'|'customer'
export type TUser = {
  name: string;
  email: string;
  password: string;
  image: string | null;
  role?: string | null;
};

export type TSidebarMenuItem = {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  /** Optional right-aligned count, e.g. pending bookings. */
  badge?: string;
};

export type TSidebarMenuGroup = {
  label: string;
  items: TSidebarMenuItem[];
};