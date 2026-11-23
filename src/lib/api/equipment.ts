const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

import { serverAuthHeaders } from "@/lib/auth-token.server";

/**
 * Reads the owner's own listings for the Owner → My Equipment page.
 *
 * `/api/ownerEquipment` is protected (`verifyToken` + `verifyOwner`), so the
 * request carries the JWT access token — without it the API answers 401 with
 * a JSON *object* (`{ message }`), which used to reach `.map()` and crash the
 * page with "equipmentData.map is not a function".
 *
 * `!res.ok` now throws (the dashboard error boundary shows a retry state) and
 * the success path is normalised to a real array.
 */
export const getEquipment=async(query: string)=>{
    const res= await fetch(`${BASE_URL}/api/ownerEquipment?${query}`, {
        cache: "no-store",
        headers: await serverAuthHeaders(),
    })
    if (!res.ok) {
        throw new Error(`Failed to load your equipment: ${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
}

export const getEquipmentById=async(id: string)=>{
    const res= await fetch(`${BASE_URL}/api/equipmentDetails/${id}`)
    return res.json()
}

export const getAllEquipment=async(query: string)=>{
    const res= await fetch(`${BASE_URL}/api/AllEquipment?${query}`)
    const data = await res.json()
    // Always hand callers an array: every consumer renders it with `.map()`.
    return Array.isArray(data) ? data : []
}


export const getCustomerBookings = async (email: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/customerBookings?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
      headers: await serverAuthHeaders(),
    });
    const data = await res.json();
    // 401/403 answer with `{ message }` — never let that reach `.map()`.
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const getCustomerFavourites = async (email: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/customerFavourites?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
      headers: await serverAuthHeaders(),
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const removeCustomerFavourite = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/removeFavourite/${id}`, {
      method: "DELETE",
      headers: await serverAuthHeaders(),
    });
    return res.json();
  } catch {
    return { success: false };
  }
};


export const getOwnerRentals = async (ownerEmail: string) => {
  const res = await fetch(`${BASE_URL}/api/ownerRentals?ownerEmail=${encodeURIComponent(ownerEmail)}`, {
    cache: "no-store",
    headers: await serverAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to load owner rentals: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const getOwnerAnalytics = async (ownerEmail: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/ownerAnalytics?ownerEmail=${encodeURIComponent(ownerEmail)}`, {
      cache: "no-store",
      headers: await serverAuthHeaders(),
    });
    return res.json();
  } catch {
    return null;
  }
};

export const updateEquipmentListing = async (id: string, data: Record<string, unknown>) => {
  try {
    const res = await fetch(`${BASE_URL}/api/updateEquipment/${id}`, {
      method: "PUT",
      headers: await serverAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return { success: false };
  }
};
