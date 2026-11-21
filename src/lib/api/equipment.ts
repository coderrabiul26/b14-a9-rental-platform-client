const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const getEquipment=async(query: string)=>{
    const res= await fetch(`${BASE_URL}/api/ownerEquipment?${query}`)
    return res.json()
}

export const getEquipmentById=async(id: string)=>{
    const res= await fetch(`${BASE_URL}/api/equipmentDetails/${id}`)
    return res.json()
}

export const getAllEquipment=async(query: string)=>{
    const res= await fetch(`${BASE_URL}/api/AllEquipment?${query}`)
    return res.json()
}


export const getCustomerBookings = async (email: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/customerBookings?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    return res.json();
  } catch {
    return [];
  }
};

export const getCustomerFavourites = async (email: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/customerFavourites?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    return res.json();
  } catch {
    return [];
  }
};

export const removeCustomerFavourite = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/removeFavourite/${id}`, {
      method: "DELETE",
    });
    return res.json();
  } catch {
    return { success: false };
  }
};


export const getOwnerRentals = async (ownerEmail: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/ownerRentals?ownerEmail=${encodeURIComponent(ownerEmail)}`, {
      cache: "no-store",
    });
    return res.json();
  } catch {
    return [];
  }
};

export const getOwnerAnalytics = async (ownerEmail: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/ownerAnalytics?ownerEmail=${encodeURIComponent(ownerEmail)}`, {
      cache: "no-store",
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return { success: false };
  }
};
