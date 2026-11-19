import { TEquipmentSubmission } from "@/types"

const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL


export const addEquipment= async(data: TEquipmentSubmission)=>{
    const res= await fetch(`${BASE_URL}/api/addEquipment`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res.json()
}