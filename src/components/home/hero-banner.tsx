"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  SearchIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircle2Icon,
  LayersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/all-equipment?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/all-equipment");
    }
  };

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
      {/* Background decorative glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Heading, description, search bar, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left"
          >
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <SparklesIcon className="size-3.5" />
              <span>Smart Equipment Rental Marketplace</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Rent Pro Gear <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                Without the High Cost
              </span>
            </h1>

            {/* Platform description */}
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Connecting contractors, creators, and builders with verified equipment
              owners. From heavy machinery and cameras to event gear—book securely
              with flexible rental terms.
            </p>

            {/* Quick Search Form */}
            <form
              onSubmit={handleSearch}
              className="mt-6 flex w-full max-w-lg items-center gap-2 rounded-2xl border bg-card p-1.5 shadow-sm ring-1 ring-foreground/5 focus-within:ring-2 focus-within:ring-primary"
            >
              <div className="flex flex-1 items-center gap-2 pl-3">
                <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search cameras, tractors, sound gear..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" size="default" className="rounded-xl font-medium">
                Find Gear
              </Button>
            </form>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                nativeButton={false}
                size="lg"
                className="gap-2 rounded-xl shadow-xs"
                render={<Link href="/all-equipment" />}
              >
                Browse All Equipment
                <ArrowRightIcon className="size-4" />
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                size="lg"
                className="gap-2 rounded-xl"
                render={<Link href="/dashboard/owner/add-equipment" />}
              >
                List Your Gear
              </Button>
            </div>

            {/* Trust points */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground lg:justify-start">
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-primary" />
                <span>Verified Equipment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon className="size-4 text-primary" />
                <span>Stripe Protected Payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LayersIcon className="size-4 text-primary" />
                <span>Flexible Daily / Weekly / Monthly</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero High-Quality Banner Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative lg:col-span-5"
          >
            <div className="relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl border bg-muted shadow-xl lg:max-w-none">
              {/* High-quality banner image representing modern equipment */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                alt="Modern professional equipment for rent"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Stat Card 1 */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-background/90 p-3.5 backdrop-blur-md shadow-lg sm:left-6 sm:right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Heavy & Media Gear Available Now
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Instant reservation with insured owners
                    </p>
                  </div>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <SparklesIcon className="size-4" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
