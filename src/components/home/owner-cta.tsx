"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUpIcon,
  ShieldCheckIcon,
  CoinsIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OwnerCta() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-8 shadow-sm sm:p-12 lg:p-16"
        >
          {/* Subtle decorative background blur */}
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                <CoinsIcon className="size-3.5" />
                <span>Monetize Your Assets</span>
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Have Equipment Sitting Idle? <br />
                <span className="text-primary">Start Earning Today.</span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Join hundreds of equipment owners listing cameras, generators, excavators,
                and event audio systems on GearGo. Set your own rental terms, approve verified
                renters, and receive secure payouts directly to your account.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-primary shrink-0" />
                  <span>Verified Renter Identities</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUpIcon className="size-4 text-primary shrink-0" />
                  <span>Keep 90%+ Of Your Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CoinsIcon className="size-4 text-primary shrink-0" />
                  <span>Automated Stripe Payouts</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
              <Button
                nativeButton={false}
                size="lg"
                className="w-full sm:w-auto lg:w-full gap-2 rounded-xl text-sm font-semibold shadow-sm"
                render={<Link href="/dashboard/owner/add-equipment" />}
              >
                List Your Equipment Now
                <ArrowRightIcon className="size-4" />
              </Button>

              <Button
                nativeButton={false}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto lg:w-full rounded-xl text-sm font-semibold"
                render={<Link href="/all-equipment" />}
              >
                Browse Marketplace
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
