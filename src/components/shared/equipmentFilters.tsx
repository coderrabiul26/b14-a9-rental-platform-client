"use client";

import React from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TRentalType } from "@/types";
import { useRouter } from "next/navigation";

/* ────────────────────────────────────────────────────────────
   Demo options — edit these lists whenever you like.
   (CATEGORY_OPTIONS below is only a FALLBACK: the page sends the real
   categories found in the data through the `categories` prop.)
   ──────────────────────────────────────────────────────────── */
const SEARCH_BY_OPTIONS = [
  { value: "name", label: "Equipment Name" },
  { value: "location", label: "Location" },
];

const CATEGORY_OPTIONS = [
  "Construction",
  "Power Tools",
  "Lifting & Access",
  "Earthmoving",
  "Gardening",
  "Events & Party",
];

const RENTAL_TYPE_OPTIONS: { value: TRentalType | "any"; label: string }[] = [
  { value: "any", label: "Any rental type" },
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
];

const PRICE_RANGE_OPTIONS = [
  { value: "any", label: "Any price" },
  { value: "0-500", label: "Under ৳500" },
  { value: "500-1000", label: "৳500 – ৳1,000" },
  { value: "1000-", label: "Above ৳1,000" },
];

const AVAILABILITY_OPTIONS = [
  { value: "any", label: "Any availability" },
  { value: "available", label: "Available" },
  { value: "out-of-stock", label: "Out of stock" },
];

const SORT_OPTIONS = [
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "recently-added", label: "Recently Added" },
];

/* ────────────────────────────────────────────────────────────
   Tiny presentational helpers (no logic, just markup)
   ──────────────────────────────────────────────────────────── */
const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2.5">
    <h3 className="text-sm font-semibold">{title}</h3>
    {children}
  </div>
);

/**
 * One radio + its text.
 * The <label> WRAPS the control, so clicking the text selects the radio —
 * no htmlFor/id pairing needed (Base UI keeps a hidden <input> next to the
 * visual <span>, so id linking is unreliable here).
 */
const RadioRow = ({ value, label }: { value: string; label: string }) => (
  <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
    <RadioGroupItem value={value} />
    {label}
  </label>
);

/**
 * Search + Filters + Sorting panel for the All Equipment page.
 *
 * This component does NOT decide what is shown — it only writes the chosen
 * values into the URL (?search=…&category=…&sort=…). The page reads them
 * back from `searchParams` and applies them to the list.
 */
export function EquipmentFilters({
  categories,
}: {
  /** Real categories found in the data (the page passes these in). */
  categories?: string[];
}) {
  // Fallback: if the page sends nothing, use the static demo list.
  const categoryOptions =
    categories && categories.length > 0 ? categories : CATEGORY_OPTIONS;

  const router = useRouter();

  // ── Refresh = fresh start ───────────────────────────────────
  // A refresh (F5 / Ctrl+R) re-reads the URL, so any filter saved in it
  // would come straight back. Requirement: after a refresh the page must
  // look exactly like the FIRST render — every filter cleared and ALL
  // equipment shown. So once on mount, if the URL carries a query string,
  // we replace it with the clean path and the page re-renders unfiltered.
  //
  // This runs ONLY when the page is actually (re)loaded: clicking a filter
  // re-renders this same component, so it does NOT reset your choices.
  React.useEffect(() => {
    if (window.location.search) {
      router.replace(window.location.pathname);
    }
  }, [router]);

  /** SEARCH — runs when the search form is submitted (Enter / Search button). */
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Start from the filters ALREADY in the URL — building a fresh
    // URLSearchParams() here would silently wipe category / price / sort.
    const params = new URLSearchParams(window.location.search);

    const query = String(formData.get("search") ?? "").trim();
    const searchBy = String(formData.get("searchBy") ?? "name");

    if (query) {
      params.set("search", query);
    } else {
      params.delete("search"); // empty box = clear the search
    }
    params.set("searchBy", searchBy);

    const qs = params.toString();
    router.push(qs ? `/all-equipment?${qs}` : "/all-equipment");
  };

  const handleFilterChange = (name: string, value: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set(name, value);  
      router.push(`/all-equipment?${params.toString()}`);
  };

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">Search & Filters</CardTitle>
        <CardDescription>Narrow down the equipment list.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* ── Search ───────────────────────────────────────── */}
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          <FilterSection title="Search">
            {/* Search by: Equipment Name / Location (radio, not checkbox) */}
            <RadioGroup
              name="searchBy"
              defaultValue="name"
              onValueChange={(value) => handleFilterChange("searchBy", String(value))}
              className="gap-1.5"
            >
              {SEARCH_BY_OPTIONS.map((option) => (
                <RadioRow
                  key={option.value}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </RadioGroup>

            <div className="flex gap-2">
              <Input
                name="search"
                type="search"
                placeholder="Type to search…"
                aria-label="Search equipment"
                className="h-9"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0"
                aria-label="Search"
              >
                <SearchIcon />
              </Button>
            </div>
          </FilterSection>
        </form>

        {/* ── Filter: Equipment Category ───────────────────── */}
        <FilterSection title="Equipment Category">
          <RadioGroup
            name="category"
            defaultValue="all"
            onValueChange={(value) => handleFilterChange("category", String(value))}
            className="gap-1.5"
          >
            <RadioRow value="all" label="All categories" />
            {categoryOptions.map((category) => (
              <RadioRow key={category} value={category} label={category} />
            ))}
          </RadioGroup>
        </FilterSection>

        {/* ── Filter: Rental Type ──────────────────────────── */}
        <FilterSection title="Rental Type">
          <RadioGroup
            name="rentalType"
            defaultValue="any"
            onValueChange={(value) => handleFilterChange("rentalType", String(value))}
            className="gap-1.5"
          >
            {RENTAL_TYPE_OPTIONS.map((option) => (
              <RadioRow key={option.value} value={option.value} label={option.label} />
            ))}
          </RadioGroup>
        </FilterSection>

        {/* ── Filter: Price Range ──────────────────────────── */}
        <FilterSection title="Price Range">
          <RadioGroup
            name="rentalPrice"
            defaultValue="any"
            onValueChange={(value) => handleFilterChange("rentalPrice", String(value))}
            className="gap-1.5"
          >
            {PRICE_RANGE_OPTIONS.map((option) => (
              <RadioRow key={option.value} value={option.value} label={option.label} />
            ))}
          </RadioGroup>
        </FilterSection>

        {/* ── Filter: Availability ─────────────────────────── */}
        <FilterSection title="Availability">
          <RadioGroup
            name="availableQuantity"
            defaultValue="any"
            onValueChange={(value) => handleFilterChange("availableQuantity", String(value))}
            className="gap-1.5"
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <RadioRow key={option.value} value={option.value} label={option.label} />
            ))}
          </RadioGroup>
        </FilterSection>

        {/* ── Sorting ──────────────────────────────────────── */}
        <FilterSection title="Sort By">
          <RadioGroup
            name="sort"
            defaultValue="recently-added"
            onValueChange={(value) => handleFilterChange("sort", String(value))}
            className="gap-1.5"
          >
            {SORT_OPTIONS.map((option) => (
              <RadioRow key={option.value} value={option.value} label={option.label} />
            ))}
          </RadioGroup>
        </FilterSection>
      </CardContent>
    </Card>
  );
}

export default EquipmentFilters;
