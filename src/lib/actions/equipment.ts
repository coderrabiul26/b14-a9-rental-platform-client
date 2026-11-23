import { TBookingEquipment, TBookingRequest, TEquipmentSubmission, TOwnerEquipment } from "@/types"
import { authHeaders } from "@/lib/auth-token"

const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'


export const addEquipment= async(data: TEquipmentSubmission)=>{
    const res= await fetch(`${BASE_URL}/api/addEquipment`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(data)
    })
    return res.json()
}

export const addBooking= async(data: TBookingEquipment)=>{
    const res= await fetch(`${BASE_URL}/api/addBooking`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(data)
    })
    return res.json()
}

/**
 * Step 1 of paying for a rental: the booking modal calls this with its
 * 6 fields. The API validates everything, checks availability for those
 * dates, calculates the total and stores a PENDING payment row.
 *
 * On success it answers `{ success: true, paymentId, amount, … }` — the
 * client then goes to `/checkout?paymentId=…`.
 * On failure it answers `{ success: false, message }` (400/409…).
 */
export const prepareBooking= async(data: TBookingRequest)=>{
    const res= await fetch(`${BASE_URL}/api/prepareBooking`, {
        method: 'POST',
        // Protected by `verifyToken` + `verifyRenter` on the API side — a
        // request without `Authorization` is rejected with 401 before the
        // booking is ever validated.
        headers: await authHeaders(),
        body: JSON.stringify(data)
    })
    return res.json()
}


export const addFavourite= async(data: TBookingEquipment)=>{
    const res= await fetch(`${BASE_URL}/api/addFavourite`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(data)
    })
    return res.json()
}

export const deleteEquipment= async(id:string)=>{
    const res = await fetch(`${BASE_URL}/api/deleteEquipment/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    return res.json()
}