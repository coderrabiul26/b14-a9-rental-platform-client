const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/**
 * Admin Dashboard API layer.
 *
 * Every endpoint lives on the Express server (`/api/admin/...`) and is
 * only ever called from Server Components, so nothing here is exposed
 * to the browser bundle.
 */

/** Challenge 3 — platform-wide numbers for the admin overview page. */
export const getAdminAnalytics = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/analytics`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load admin analytics: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/** Admin — all registered users for the All Users table. */
export const getAdminUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/users`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load admin users: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/** Admin — change a user's role. */
export const updateUserRole = async (userId: string, role: string) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  return res.json();
};

/** Admin — block or unblock a user. */
export const updateUserBlocked = async (userId: string, blocked: boolean) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/block`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocked }),
  });
  return res.json();
};

/** Admin — all equipment listings (with optional status filter). */
export const getAdminEquipment = async (status?: string) => {
  const url = new URL(`${BASE_URL}/api/admin/equipment`);
  if (status) url.searchParams.set("status", status);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load admin equipment: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/** Admin — update equipment status (pending/approved/rejected). */
export const updateEquipmentStatus = async (equipmentId: string, status: string) => {
  const res = await fetch(`${BASE_URL}/api/admin/equipment/${equipmentId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

/** Admin — delete equipment listing. */
export const deleteAdminEquipment = async (equipmentId: string) => {
  const res = await fetch(`${BASE_URL}/api/deleteEquipment/${equipmentId}`, {
    method: "DELETE",
  });
  return res.json();
};

/** Admin — all rental bookings enriched with customer + owner info. */
export const getAdminBookings = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/bookings`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load admin bookings: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/** Admin — update booking status. */
export const updateBookingStatus = async (bookingId: string, bookingStatus: string) => {
  const res = await fetch(`${BASE_URL}/api/admin/bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingStatus }),
  });
  return res.json();
};
