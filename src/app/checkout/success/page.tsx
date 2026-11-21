import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  CreditCardIcon,
  PackageIcon,
  XCircleIcon,
} from "lucide-react";

import { checkoutVerify } from "@/lib/actions/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** "2026-11-21" → "21 Nov 2026" (same locale everywhere). */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * Payment success page — /checkout/success?session_id=cs_…
 *
 * Stripe redirects here after a successful payment. The page calls
 * POST /payment/checkout-verify, which:
 *   ① re-checks the session with Stripe,
 *   ② writes the transaction details onto the `payments` row,
 *   ③ creates the booking record (the money has arrived by now).
 * Because that endpoint is idempotent, refreshing this page is safe —
 * it shows the same booking again instead of creating a second one.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  // Landed here without a session? Nothing to show.
  if (!session_id) {
    redirect("/all-equipment");
  }

  // Ask the API to verify + save everything (it talks to Stripe itself).
  let result: {
    success?: boolean;
    message?: string;
    bookingId?: string;
    equipmentName?: string;
    startDate?: string;
    endDate?: string;
    days?: number;
    quantity?: number;
    amount?: number;
    currency?: string;
    transactionId?: string;
  } = {};
  try {
    result = await checkoutVerify(session_id);
  } catch {
    result = { success: false, message: "Could not verify the payment." };
  }

  // ── Payment did NOT succeed (canceled, expired, network…) ──
  if (!result?.success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0a0a10] p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#14141c] p-8 text-center">
          <XCircleIcon className="mx-auto size-14 text-red-400" />
          <h1 className="mt-5 text-2xl font-semibold text-white">
            Payment not completed
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {result?.message ??
              "Something went wrong while confirming your payment."}{" "}
            You have not been charged.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button render={<Link href="/all-equipment" />} variant="outline">
              Browse equipment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Payment succeeded — the booking exists now ──
  const currency = (result.currency ?? "bdt").toUpperCase();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0a0a10] p-4 sm:p-8">
      <div className="w-full max-w-md space-y-5">
        {/* Hero card */}
        <div className="rounded-2xl border border-white/10 bg-[#14141c] p-8 text-center">
          {/* Green check */}
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-400/15">
            <CheckIcon className="size-8 text-emerald-400" />
          </span>

          <h1 className="mt-5 text-2xl font-semibold text-white">
            Payment Successful!
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Your rental booking for{" "}
            <span className="text-zinc-200">{result.equipmentName}</span> is
            confirmed.
          </p>

          <Badge className="mt-4 bg-emerald-400/15 text-emerald-400">
            Booking #{result.bookingId?.slice(-8).toUpperCase()}
          </Badge>
        </div>

        {/* Booking summary */}
        <div className="rounded-2xl border border-white/10 bg-[#14141c] p-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-zinc-400">
                <PackageIcon className="size-3.5" /> Equipment
              </span>
              <span className="truncate text-zinc-200">
                {result.equipmentName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-zinc-400">
                <CalendarIcon className="size-3.5" /> Rental period
              </span>
              <span className="text-right text-zinc-200">
                {result.startDate && result.endDate
                  ? `${formatDate(result.startDate)} — ${formatDate(result.endDate)}`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-400">Duration</span>
              <span className="text-zinc-200">{result.days} day(s)</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-400">Quantity</span>
              <span className="text-zinc-200">{result.quantity} unit(s)</span>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between gap-4 font-medium">
              <span className="flex items-center gap-2 text-zinc-300">
                <CreditCardIcon className="size-3.5" /> Amount paid
              </span>
              <span className="text-emerald-400">
                ৳{Number(result.amount ?? 0).toFixed(2)} {currency}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-zinc-400">Transaction ID</span>
              <span className="break-all text-right text-xs text-zinc-500">
                {result.transactionId ?? "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
          nativeButton={false}
            render={<Link href="/dashboard/customer/my-rental" />}
            className="h-11 flex-1"
          >
            View My Rentals
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button
          nativeButton={false}
            render={<Link href="/all-equipment" />}
            variant="outline"
            className="h-11 flex-1"
          >
            Browse More Equipment
          </Button>
        </div>

        <p className="text-center text-xs text-zinc-500">
          The transaction has been saved to your account. A copy of this
          booking is available under My Rentals.
        </p>
      </div>
    </div>
  );
}
