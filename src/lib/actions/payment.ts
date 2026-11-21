
const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const checkoutVerify= async(sessionId: string)=>{
    try {
        const response= await fetch(`${BASE_URL}/payment/checkout-verify`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sessionId})
        })
        return await response.json()
    } catch {
        // Never let a network hiccup crash the success page — the page
        // renders its "could not verify" state from this instead.
        return { success: false, message: 'Could not reach the payment server' }
    }
}