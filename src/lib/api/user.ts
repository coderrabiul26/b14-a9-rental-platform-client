const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const getUserPremiumById= async(userId: string)=>{
    const response= await fetch(`${BASE_URL}/api/user/${userId}/premium`)
    // Never let a bad answer crash the caller: an empty / non-JSON body
    // used to throw "Unexpected end of JSON input" inside the Book handler.
    // Treat anything unparseable as "not premium yet".
    try {
        return await response.json()
    } catch {
        return { premium: false }
    }
}


export const getUserProfile = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/profile?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    return await response.json();
  } catch {
    return null;
  }
};

export const updateUserProfile = async (profileData: {
  email: string;
  name?: string;
  image?: string;
  phoneNumber?: string;
  address?: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });
    return await response.json();
  } catch {
    return { success: false };
  }
};
