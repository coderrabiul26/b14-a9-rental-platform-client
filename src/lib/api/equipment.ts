const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const getEquipment=async(query: string)=>{
    const res= await fetch(`${BASE_URL}/api/ownerEquipment?${query}`)
    return res.json()
}

export const getAllEquipment=async(query: string)=>{
    const res= await fetch(`${BASE_URL}/api/AllEquipment?${query}`)
    return res.json()
}