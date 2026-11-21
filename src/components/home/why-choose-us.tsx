"use client";

import { motion } from "framer-motion";
import {
  BanknoteIcon,
  ShieldCheckIcon,
  CalendarClockIcon,
  CreditCardIcon,
  SparklesIcon,
} from "lucide-react";

const BENEFITS = [
  {
    icon: BanknoteIcon,
    title: "Affordable Rental Prices",
    description:
      "Save up to 70% compared to purchasing brand new gear. Access top-tier professional equipment on project-friendly budgets.",
    badge: "Cost Efficient",
  },
  {
    icon: ShieldCheckIcon,
    title: "Verified Equipment Owners",
    description:
      "Every owner profile is identity-checked and every piece of listed gear is pre-screened to ensure operational safety.",
    badge: "100% Verified",
  },
  {
    icon: CalendarClockIcon,
    title: "Flexible Rental Periods",
    description:
      "Rent by the day, week, or month. Extend your booking anytime or schedule recurring rentals with automatic status updates.",
    badge: "Custom Duration",
  },
  {
    icon: CreditCardIcon,
    title: "Secure Payments via Stripe",
    description:
      "Funds are safely held until pickup verification. Enjoy end-to-end encryption with transparent instant billing.",
    badge: "PCI Protected",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <SparklesIcon className="size-3.5" />
            <span>The GearGo Advantage</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Why Choose Us?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            We simplify gear rental with a transparent marketplace, reliable equipment, and guaranteed protection.
          </p>
        </div>

        {/* 4 Benefit Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-6 h-1 w-8 rounded-full bg-primary/40" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
