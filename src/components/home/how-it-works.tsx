"use client";

import { motion } from "framer-motion";
import {
  SearchIcon,
  CalendarCheckIcon,
  CreditCardIcon,
  TruckIcon,
  SparklesIcon,
} from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: SearchIcon,
    title: "Browse & Find Gear",
    description:
      "Search through hundreds of verified machinery, camera kits, and tools by category or location.",
  },
  {
    step: "02",
    icon: CalendarCheckIcon,
    title: "Select Dates & Book",
    description:
      "Pick your exact rental start and end dates. Total rental pricing is calculated instantly with no hidden fees.",
  },
  {
    step: "03",
    icon: CreditCardIcon,
    title: "Secure Stripe Payment",
    description:
      "Pay with bank cards or Stripe Checkout. Your funds remain secured until you receive the equipment.",
  },
  {
    step: "04",
    icon: TruckIcon,
    title: "Pick Up & Return",
    description:
      "Collect the gear from the verified owner or request delivery. Simply return it when your job is done.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <SparklesIcon className="size-3.5" />
            <span>Effortless Process</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            How GearGo Works
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Renting professional gear has never been this simple. Four easy steps to get the equipment you need.
          </p>
        </div>

        {/* 4 Steps Visual Timeline */}
        <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((stepItem, index) => {
            const Icon = stepItem.icon;
            return (
              <motion.div
                key={stepItem.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center rounded-2xl border bg-card p-6 shadow-xs transition hover:shadow-md"
              >
                {/* Step Number Badge */}
                <span className="absolute top-4 right-4 text-2xl font-black text-muted-foreground/30">
                  {stepItem.step}
                </span>

                {/* Icon Circle */}
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <Icon className="size-7" />
                </div>

                <h3 className="mt-5 text-base font-bold text-foreground">
                  {stepItem.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {stepItem.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
