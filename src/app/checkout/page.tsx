import {
  CheckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const PLAN = {
  name: "Unlimited Applications",
  price: 20.00,
  currency: "USD",
  interval: "month",
}

const FEATURES = [
  "Apply to unlimited jobs",
  "Track all applications in your dashboard",
  "Priority visibility to employers",
  "Cancel anytime",
]

const PaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) => {
  const { canceled } = await searchParams

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const user = session?.user

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0a0a10] p-4 sm:p-8">
      <div className="w-full max-w-md space-y-5">
        {canceled && (
          <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-400">
            Payment canceled — you can check out again whenever you&apos;re
            ready.
          </p>
        )}

        {/* Plan card */}
        <div className="rounded-2xl border border-white/10 bg-[#14141c] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge className="bg-[#7b80f8]/15 text-[#7b80f8]">
                Job Seeker Pro
              </Badge>
              <h1 className="mt-3 text-2xl font-semibold text-white">
                {PLAN.name}
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Unlock unlimited job applications.
              </p>
            </div>
          </div>

          <p className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">${PLAN.price}</span>
            <span className="text-sm text-zinc-400">/{PLAN.interval}</span>
          </p>

          <ul className="mt-6 space-y-3">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-sm text-zinc-300"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                  <CheckIcon className="size-3 text-emerald-400" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment summary + pay button */}
        <div className="rounded-2xl border border-white/10 bg-[#14141c] p-6">
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Plan</span>
              <span className="text-zinc-200">{PLAN.name}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Account</span>
              <span className="max-w-[60%] truncate text-zinc-200">
                {user?.email ?? "Not signed in"}
              </span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between font-medium">
              <span className="text-zinc-300">Due today</span>
              <span className="text-white">
                ${PLAN.price.toFixed(2)} {PLAN.currency}
              </span>
            </div>
          </div>

          {/* Stripe Checkout: POST creates a session server-side and
              redirects to Stripe's hosted checkout page. */}
          <form action="/api/checkout_sessions" method="POST">
            <input type="hidden" name="userId" value={user?.id ?? ""} />
            <input type="hidden" name="email" value={user?.email ?? ""} />
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
