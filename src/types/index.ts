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

/* ────────────────────────────────────────────────────────────
   Add Equipment (owner listing form)
   ──────────────────────────────────────────────────────────── */

/** How long the equipment can be rented for. */
export type TRentalType = "Daily" | "Weekly" | "Monthly";

/** Condition of the equipment being listed. */
export type TEquipmentCondition = "New" | "Like New" | "Good" | "Fair";

/** A new listing always starts as "pending" until an admin reviews it. */
export type TEquipmentStatus = "pending" | "approved" | "rejected";

/**
 * The payload sent to the server when an owner submits the
 * "Add Equipment" form.
 *
 * = every form field  +  ownerEmail  +  status
 */
export type TEquipmentSubmission = {
  name: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: TRentalType;
  availableQuantity: number;
  condition: TEquipmentCondition;
  brand: string;
  model: string;
  /** Public URL of the photo hosted on ImgBB (not the File itself). */
  image: string;
  terms: string;

  /* --- the 2 extra pieces of information --- */
  /** Email of the logged-in owner (from the session). */
  ownerEmail: string;
  /** Always "pending" when the form is submitted. */
  status: TEquipmentStatus;
};

/**
 * One row in the owner's "My Equipment" table.
 *
 * It is the same payload the add-equipment form sends, plus the `_id`
 * the server stores it with — that `_id is what the Update / Delete /
 * View Details actions need to know WHICH row was clicked.
 */
export type TOwnerEquipment = TEquipmentSubmission & {
  _id: string;
};