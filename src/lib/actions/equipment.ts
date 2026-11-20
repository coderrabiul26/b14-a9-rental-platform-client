import { TEquipmentSubmission, TOwnerEquipment } from "@/types"
import { auth } from "../auth"

const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'


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


export const deleteEquipment= async(id:string)=>{
    const res = await fetch(`${BASE_URL}/api/deleteEquipment/${id}`, {
      method: "DELETE",
    });
    return res.json()
}