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

 export type TBookingEquipment={

    equipmentId: string,
    customerId: string,
    customerEmail: string,
    equipmentName: string,
    createdAt: Date

}

/* ────────────────────────────────────────────────────────────
   Book Equipment → payment flow
   ──────────────────────────────────────────────────────────── */

/**
 * What the booking modal sends to `POST /api/prepareBooking` when the
 * customer presses "Confirm Booking" (the 6 modal fields + who/what).
 */
export type TBookingRequest = {
  equipmentId: string;
  customerId: string;
  customerEmail: string;
  equipmentName: string;
  /** Rental dates as "YYYY-MM-DD" — exactly what <input type="date"> gives. */
  startDate: string;
  endDate: string;
  quantity: number;
  contactNumber: string;
  deliveryAddress: string;
  /** Optional — the modal lets this stay empty. */
  notes: string;
};

/**
 * One row in the `payments` collection.
 *
 * It starts with `payment_status: "pending"` the moment the booking is
 * confirmed in the modal. Stripe charges its `amount`, and only after
 * the payment succeeds does `/payment/checkout-verify` flip it to
 * "paid", write the Stripe transaction details onto it, and create the
 * actual booking record.
 */
export type TPaymentRecord = {
  _id: string;
  payment_status: "pending" | "paid";
  /** The customer's id (same field the premium endpoint looks at). */
  userId: string;
  customerEmail: string;
  equipmentId: string;
  equipmentName: string;
  rentalType: TRentalType;
  /** Price for ONE rental unit (equipment.rentalPrice). */
  unitPrice: number;
  startDate: string;
  endDate: string;
  /** Inclusive day count: start day and end day both count. */
  days: number;
  /** How many rentalType units those days cover (8 Daily days… see API). */
  units: number;
  quantity: number;
  /** Total = unitPrice × units × quantity, in BDT. */
  amount: number;
  currency: string;
  contactNumber: string;
  deliveryAddress: string;
  notes: string;
  /* --- written only after Stripe says the money arrived --- */
  sessionId?: string;
  payment_intent?: string;
  paidAt?: string;
  createdAt: string;
};


/* ────────────────────────────────────────────────────────────
   Customer Dashboard Types
   ──────────────────────────────────────────────────────────── */

export type TCustomerBooking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  customerId: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  days: number;
  quantity: number;
  amount: number;
  currency: string;
  rentalType?: TRentalType;
  unitPrice?: number;
  contactNumber?: string;
  deliveryAddress?: string;
  notes?: string;
  paymentStatus: "paid" | "pending";
  paymentId?: string;
  transactionId?: string;
  bookingStatus?: "confirmed" | "completed" | "active" | "cancelled";
  bookingDate?: string | Date;
  createdAt: string | Date;
};

export type TCustomerFavourite = {
  _id: string;
  equipmentId: string;
  customerId: string;
  customerEmail: string;
  equipmentName: string;
  createdAt: string | Date;
};

export type TUserProfile = {
  _id?: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  phoneNumber?: string;
  address?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};


/* ────────────────────────────────────────────────────────────
   Owner Dashboard Types
   ──────────────────────────────────────────────────────────── */

export type TOwnerRental = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  customerId: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  days: number;
  quantity: number;
  amount: number;
  currency: string;
  rentalType?: TRentalType;
  unitPrice?: number;
  contactNumber: string;
  deliveryAddress: string;
  notes?: string;
  paymentStatus: "paid" | "pending";
  paymentId?: string;
  transactionId?: string;
  bookingStatus?: "confirmed" | "completed" | "active" | "cancelled";
  bookingDate?: string | Date;
  createdAt: string | Date;
};

export type TOwnerAnalytics = {
  totalEquipment: number;
  totalRentals: number;
  completedRentals: number;
  activeRentals: number;
  totalEarnings: number;
  monthlyEarnings: { month: string; earnings: number }[];
};

/* ────────────────────────────────────────────────────────────
   Admin Dashboard Types
   ──────────────────────────────────────────────────────────── */

/** One row from `GET /api/admin/users` — the Admin "All Users" table. */
export type TAdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
  image?: string | null;
  createdAt: string | Date;
  blocked?: boolean;
  phoneNumber?: string;
  address?: string;
};

/** One row from `GET /api/admin/equipment` — the Admin "All Equipment" table. */
export type TAdminEquipment = {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  availableQuantity: number;
  condition: "New" | "Like New" | "Good" | "Fair";
  brand: string;
  model: string;
  image: string;
  terms: string;
  ownerEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string | Date;
  updatedAt?: string | Date;
  reviewedAt?: string | Date;
};

/** One row from `GET /api/admin/bookings` — the Admin "All Rentals" table. */
export type TAdminBooking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerImage?: string;
  ownerEmail: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  days: number;
  quantity: number;
  amount: number;
  currency: string;
  rentalType?: "Daily" | "Weekly" | "Monthly";
  unitPrice?: number;
  contactNumber: string;
  deliveryAddress: string;
  notes?: string;
  paymentStatus: "paid" | "pending";
  paymentId?: string;
  transactionId?: string;
  bookingStatus?: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  bookingDate?: string | Date;
  createdAt: string | Date;
};

/** Response of `GET /api/admin/analytics` (Challenge 3: Admin Analytics). */
export type TAdminAnalytics = {
  totalUsers: number;
  totalCustomers: number;
  totalOwners: number;
  totalAdmins: number;
  totalEquipment: number;
  pendingApprovals: number;
  totalBookings: number;
  completedRentals: number;
  activeRentals: number;
  totalPayments: number;
  /** Sum of every paid row in the `payments` collection (BDT). */
  totalRevenue: number;
  /** Bookings created per month for the last 6 months. */
  monthlyBookings: { month: string; bookings: number }[];
};
