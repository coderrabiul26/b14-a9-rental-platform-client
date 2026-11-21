"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, ImageIcon, MapPinIcon, ShieldCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TOwnerEquipment } from "@/types";

interface FeaturedEquipmentProps {
  equipments: TOwnerEquipment[];
  isLoggedIn: boolean;
}

export default function FeaturedEquipment({
  equipments,
  isLoggedIn,
}: FeaturedEquipmentProps) {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheckIcon className="size-3.5" />
              <span>Verified Listings</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Featured Equipment
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Hand-picked, high-demand equipment ready for immediate booking.
            </p>
          </div>

          <Button
            nativeButton={false}
            variant="outline"
            className="gap-1.5 rounded-xl"
            render={<Link href="/all-equipment" />}
          >
            Explore All Listings
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        {/* 6-Card Grid with Framer Motion Stagger */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipments.slice(0, 6).map((item, index) => {
            const isAvailable = item.availableQuantity > 0;
            // PDF requirement: If not logged in -> redirect to login, else -> details page
            const viewDetailsHref = isLoggedIn
              ? `/all-equipment/${item._id}`
              : `/signin?callbackUrl=/all-equipment/${item._id}`;

            return (
              <motion.article
                key={item._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition hover:shadow-md"
              >
                {/* Equipment Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
                      <ImageIcon className="size-8" />
                      <span className="text-xs">No preview available</span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-transparent font-medium shadow-xs",
                        isAvailable
                          ? "bg-emerald-500 text-white hover:bg-emerald-500"
                          : "bg-red-500/90 text-white hover:bg-red-500/90"
                      )}
                    >
                      {isAvailable ? "Available" : "Out of Stock"}
                    </Badge>

                    <Badge variant="secondary" className="bg-card/90 backdrop-blur-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="line-clamp-2 mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {/* Price and Rate */}
                  <div className="flex items-baseline justify-between">
                    <p className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight text-primary">
                        ৳{item.rentalPrice}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / {item.rentalType.toLowerCase()}
                      </span>
                    </p>

                    <span className="text-xs text-muted-foreground">
                      Cond: <span className="font-medium text-foreground">{item.condition}</span>
                    </span>
                  </div>

                  {/* Location */}
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPinIcon className="size-3.5 shrink-0 text-primary" />
                    <span className="line-clamp-1">{item.location}</span>
                  </p>

                  {/* Footer CTA */}
                  <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isAvailable ? "text-emerald-600" : "text-destructive"
                      )}
                    >
                      {isAvailable
                        ? `${item.availableQuantity} unit(s) ready`
                        : "Out of stock"}
                    </span>

                    <Button
                      nativeButton={false}
                      size="sm"
                      className="rounded-lg font-medium"
                      render={<Link href={viewDetailsHref} />}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
