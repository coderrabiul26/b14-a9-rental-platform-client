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