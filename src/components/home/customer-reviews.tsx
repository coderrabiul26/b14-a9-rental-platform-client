"use client";

import { motion } from "framer-motion";
import { StarIcon, CheckCircle2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const REVIEWS = [
  {
    name: "Tanvir Ahmed",
    role: "Indie Filmmaker",
    rating: 5,
    comment:
      "Rented a Sony FX3 cinema package and GM lenses for a 4-day commercial shoot. Equipment was in flawless condition, and the owner was super accommodating with early pickup.",
    avatarFallback: "TA",
    equipmentRented: "Sony Cinema Package",
    verified: true,
  },
  {
    name: "Farhana Yasmin",
    role: "Event Coordinator",
    rating: 5,
    comment:
      "GearGo made managing high-grade PA audio systems and staging effortless for our corporate expo. The Stripe payment flow was instant and transparent.",
    avatarFallback: "FY",
    equipmentRented: "JBL Line Array System",
    verified: true,
  },
  {
    name: "Kamrul Hasan",
    role: "Civil Contractor",
    rating: 5,
    comment:
      "Saved our project timeline by renting a mini-excavator right when our machine broke down. Delivered to site within 4 hours. Highly recommended for site managers.",
    avatarFallback: "KH",
    equipmentRented: "CAT 305 Excavator",
    verified: true,
  },
  {
    name: "Shafin Chowdhury",
    role: "Agro Farm Manager",
    rating: 5,
    comment:
      "We rented heavy rototillers during peak harvest season. Flexible weekly rates helped us keep overhead low without taking out equipment loans.",
    avatarFallback: "SC",
    equipmentRented: "Mahindra 475 DI Tractor",
    verified: true,
  },
];

export default function CustomerReviews() {
  return (
    <section id="reviews" className="py-16 sm:py-24 bg-muted/30 border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            Real Stories
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Trusted by Creators & Contractors
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Read how professionals rely on GearGo to power their projects with reliable equipment.
          </p>
        </div>

        {/* 4 Reviews Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition hover:shadow-md"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border bg-primary/10 text-primary font-bold">
                    <AvatarFallback>{review.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <h4 className="truncate text-sm font-semibold text-foreground">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <CheckCircle2Icon className="size-3.5 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {review.role}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-md bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                  Rented: <span className="font-medium text-foreground">{review.equipmentRented}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
