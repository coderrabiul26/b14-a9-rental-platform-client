"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HardHatIcon,
  CameraIcon,
  TruckIcon,
  TractorIcon,
  CpuIcon,
  PartyPopperIcon,
  ArrowUpRightIcon,
} from "lucide-react";

/**
 * 6 Required Categories from the Assignment PDF.
 */
const POPULAR_CATEGORIES = [
  {
    name: "Construction Equipment",
    query: "Construction Equipment",
    description: "Excavators, cement mixers, scaffolding & heavy tools",
    icon: HardHatIcon,
    count: "120+ Listings",
    gradient: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-500",
  },
  {
    name: "Photography Equipment",
    query: "Photography Equipment",
    description: "Cinema cameras, prime lenses, gimbals & studio strobes",
    icon: CameraIcon,
    count: "240+ Listings",
    gradient: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-blue-500",
  },
  {
    name: "Vehicles & Transportation",
    query: "Vehicles & Transportation",
    description: "Utility trailers, cargo vans, pickup trucks & forklifts",
    icon: TruckIcon,
    count: "85+ Listings",
    gradient: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-500",
  },
  {
    name: "Agriculture Equipment",
    query: "Agriculture Equipment",
    description: "Tractors, rototillers, harvesters & irrigation units",
    icon: TractorIcon,
    count: "60+ Listings",
    gradient: "from-lime-500/20 to-green-500/5",
    iconColor: "text-lime-500",
  },
  {
    name: "Electronics",
    query: "Electronics",
    description: "Sound rigs, high-lumen projectors, generators & monitors",
    icon: CpuIcon,
    count: "150+ Listings",
    gradient: "from-purple-500/20 to-indigo-500/5",
    iconColor: "text-purple-500",
  },
  {
    name: "Event Equipment",
    query: "Event Equipment",
    description: "Canopy tents, modular staging, DJ systems & lighting",
    icon: PartyPopperIcon,
    count: "110+ Listings",
    gradient: "from-rose-500/20 to-pink-500/5",
    iconColor: "text-rose-500",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/40 border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            Browse By Industry
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Popular Equipment Categories
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Find the exact tools, machinery, and production equipment tailored for your project.
          </p>
        </div>

        {/* 6 Category Tiles */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_CATEGORIES.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link
                  href={`/all-equipment?category=${encodeURIComponent(category.query)}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-40 transition group-hover:opacity-100`}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-background shadow-xs ring-1 ring-border">
                        <Icon className={`size-6 ${category.iconColor}`} />
                      </div>
                      <span className="flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition group-hover:opacity-100 group-hover:text-primary">
                        <ArrowUpRightIcon className="size-4" />
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 border-t pt-3 text-xs font-semibold text-primary">
                    {category.count}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
