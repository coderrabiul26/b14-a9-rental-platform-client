const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

/**
 * One row of the `payments` collection (pending or paid) — the payment
 * page uses it to render the booking summary before the customer pays.
 *
 * Returns `null` instead of throwing so the page can show a friendly
 * "not found" state for a bad/expired paymentId.
 */
export const getPaymentById= async(id: string)=>{
    try {
        // no-store: the status changes from "pending" to "paid" and the
        // page must always see the current row.
        const res= await fetch(`${BASE_URL}/api/payment/${id}`, { cache: 'no-store' })
        if(!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}
