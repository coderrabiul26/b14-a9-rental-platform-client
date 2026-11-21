import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { getServerSession } from '@/lib/core/server'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

/**
 * POST /api/checkout_sessions — called by the "Pay with Stripe" form
 * on /checkout.
 *
 * Instead of a fixed price (the old plan flow), it now charges the
 * amount of ONE pending payment row: the booking modal created that row
 * via /api/prepareBooking after validating the dates and checking
 * availability. We re-read it server-side here, so the amount can never
 * be tampered with from the browser.
 *
 * Everything is answered with a REDIRECT, because the caller is a plain
 * <form> (Stripe then takes over on its hosted page).
 */
export async function POST(req: Request) {
  const userSession = await getServerSession()

  // Where to send the customer back to when something goes wrong.
  const headersList = await headers()
  const origin = headersList.get('origin') ?? 'http://localhost:3000'

  const formData = await req.formData()
  const paymentId = String(formData.get('paymentId') ?? '')

  const goToCheckout = (message: string) =>
    NextResponse.redirect(
      `${origin}/checkout?paymentId=${encodeURIComponent(paymentId)}&error=${encodeURIComponent(message)}`,
      303
    )

  // Only a signed-in user can pay (the payment row belongs to them).
  if (!userSession?.user) {
    return NextResponse.redirect(
      `${origin}/signin?redirectTo=${encodeURIComponent(`/checkout?paymentId=${paymentId}`)}`,
      303
    )
  }

  if (!paymentId) {
    return goToCheckout('Missing payment id — start the booking again.')
  }

  try {
    // ① Re-read the pending payment from the API (server-side, fresh).
    const paymentRes = await fetch(`${BASE_URL}/api/payment/${paymentId}`, {
      cache: 'no-store',
    })
    const payment = await paymentRes.json().catch(() => null)

    if (!payment?._id) {
      return goToCheckout('Payment not found — start the booking again.')
    }
    if (payment.payment_status !== 'pending') {
      return goToCheckout('This payment has already been completed.')
    }
    // The row must belong to the person clicking Pay.
    if (payment.userId !== userSession.user.id) {
      return goToCheckout('This booking belongs to another account.')
    }

    // ② Create the Stripe Checkout Session with THAT exact amount.
    //    BDT's smallest unit is 1/100 ৳ → unit_amount = taka × 100.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: payment.currency ?? 'bdt',
            unit_amount: Math.round(Number(payment.amount) * 100),
            product_data: {
              name: `Rental: ${payment.equipmentName}`,
              description:
                `${payment.startDate} → ${payment.endDate} · ` +
                `${payment.days} day(s) · ${payment.quantity} unit(s)`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userSession.user.email,
      // The API reads these when the success page verifies the payment:
      // paymentId → saves the transaction + creates the booking record.
      metadata: {
        paymentId,
        userId: userSession.user.id,
        equipmentId: payment.equipmentId,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // Coming back from a canceled payment keeps the summary on screen.
      cancel_url: `${origin}/checkout?paymentId=${paymentId}&canceled=1`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'Gear-Go',
    })

    // 303 → the browser GETs Stripe's hosted checkout page.
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    // Stripe's minimum charge: ৳10 ≈ $0.08 — totals under ~৳63 are
    // rejected by Stripe, so show its own message instead of a 500 page.
    return goToCheckout(error.message)
  }
}
