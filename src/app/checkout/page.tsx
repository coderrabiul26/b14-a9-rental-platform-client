import {
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPaymentById } from "@/lib/api/payment"

/** "2026-11-21" → "21 Nov 2026" (same locale everywhere). */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

/**
 * Payment page — /checkout?paymentId=…
 *
 * Reached from the booking modal ("Confirm Booking" → availability +
 * total calculated by the API → redirect here). It shows the booking
 * summary that Stripe is about to charge, and the "Pay with Stripe"
 * button POSTs to /api/checkout_sessions, which creates the Stripe
 * Checkout Session with THAT amount and sends the customer to Stripe.
 *
 * After paying, Stripe brings the customer to /checkout/success, which
 * saves the transaction + creates the booking record.
 */
const PaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ paymentId?: string; canceled?: string; error?: string }>
}) => {
  const { paymentId, canceled, error } = await searchParams

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const user = session?.user

  // ── Nothing to pay for (old bookmarks, direct visit, …) ──
  if (!paymentId) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0a0a10] p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#14141c] p-8 text-center">
          <PackageIcon className="mx-auto size-10 text-zinc-500" />
          <h1 className="mt-4 text-xl font-semibold text-white">
            Nothing to pay for
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Open an equipment page and press{" "}
            <span className="text-zinc-200">Book Equipment</span> to start a
            rental booking.
          </p>
          <Button render={<Link href="/all-equipment" />} className="mt-6">
            Browse equipment
          </Button>
        </div>
      </div>
    )
  }

  // The pending payment row the booking modal created.
  const payment = await getPaymentById(paymentId)

  // ── Unknown / expired paymentId ──
  if (!payment) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0a0a10] p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#14141c] p-8 text-center">
          <h1 className="text-xl font-semibold text-white">Payment not found</h1>
          <p className="mt-2 text-sm text-zinc-400">
            This payment session doesn&apos;t exist or has expired. Please
            start the booking again.
          </p>
          <Button render={<Link href="/all-equipment" />} className="mt-6">
            Back to equipment
          </Button>
        </div>
      </div>
    )
  }

  // ── Already paid → don't charge twice, offer the receipt instead ──
  if (payment.payment_status === "paid") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0a0a10] p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#14141c] p-8 text-center">
          <Badge className="bg-emerald-400/15 text-emerald-400">Paid</Badge>
          <h1 className="mt-4 text-xl font-semibold text-white">
            This booking is already paid
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {payment.equipmentName} · ৳{payment.amount.toFixed(2)}
          </p>
          <Button
            render={
              <Link
                href={`/checkout/success?session_id=${encodeURIComponent(payment.sessionId ?? "")}`}
              />
            }
            className="mt-6"
          >
            View booking confirmation
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0a0a10] p-4 sm:p-8">
      <div className="w-full max-w-md space-y-5">
        {canceled && (
          <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-400">
            Payment canceled — you can check out again whenever you&apos;re
            ready.
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Booking card */}
        <div className="rounded-2xl border border-white/10 bg-[#14141c] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge className="bg-[#7b80f8]/15 text-[#7b80f8]">
                Rental Booking
              </Badge>
              <h1 className="mt-3 text-2xl font-semibold text-white">
                {payment.equipmentName}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
                <CalendarIcon className="size-3.5" />
                {formatDate(payment.startDate)} — {formatDate(payment.endDate)}
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7b80f8]/15">
                <CalendarIcon className="size-3 text-[#7b80f8]" />
              </span>
              {payment.days} day(s) · {payment.units} × {payment.rentalType.toLowerCase()} unit
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7b80f8]/15">
                <PackageIcon className="size-3 text-[#7b80f8]" />
              </span>
              {payment.quantity} unit(s) × ৳{payment.unitPrice} rate
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7b80f8]/15">
                <MapPinIcon className="size-3 text-[#7b80f8]" />
              </span>
              <span className="truncate">{payment.deliveryAddress}</span>
            </li>
          </ul>
        </div>

        {/* Payment summary + pay button */}
        <div className="rounded-2xl border border-white/10 bg-[#14141c] p-6">
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Booking</span>
              <span className="max-w-[60%] truncate text-zinc-200">
                {payment.equipmentName}
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Account</span>
              <span className="max-w-[60%] truncate text-zinc-200">
                {user?.email ?? "Not signed in"}
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Contact</span>
              <span className="text-zinc-200">{payment.contactNumber}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between font-medium">
              <span className="text-zinc-300">Due today</span>
              <span className="text-white">
                ৳{payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Stripe Checkout: POST creates a session server-side (with
              THIS payment's amount) and redirects to Stripe's hosted
              checkout page. */}
          <form action="/api/checkout_sessions" method="POST">
            <input type="hidden" name="paymentId" value={paymentId} />
            <Button
              type="submit"
              disabled={!user}
              className="mt-6 h-11 w-full bg-white text-base text-zinc-900 hover:bg-zinc-200"
            >
              <CreditCardIcon data-icon="inline-start" />
              Pay with Stripe
            </Button>
          </form>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <ShieldCheckIcon className="size-3.5" />
            Secure checkout — you&apos;ll be redirected to Stripe to complete
            your payment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
