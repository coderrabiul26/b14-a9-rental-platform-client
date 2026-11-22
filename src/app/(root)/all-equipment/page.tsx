import { getAllEquipment } from "@/lib/api/equipment";
import EquipmentCard from "@/components/owner/equipmentCard";
import EquipmentFilters from "@/components/shared/equipmentFilters";
import type { TOwnerEquipment } from "@/types";

/**
 * Read one ?key=… value out of `searchParams` as a plain string.
 *
 * Next.js hands you `string | string[] | undefined` — we only ever want
 * the first value, and "" when the key is not in the URL at all.
 */
const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
): string => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

const AllEquipmentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // ① Everything in the URL (?search=…&category=…&sort=…) as an object.
  const search = await searchParams;

  // ② Fetch the WHOLE list — deliberately with an empty query string.
  //    Why not let the API filter for us? Because it treats the "reset"
  //    values as real values: ?category=all, ?rentalType=any, ?rentalPrice=any
  //    and ?availableQuantity=any each come back with 0 rows — and it
  //    ignores ?sort= completely. So search, filter and sort all happen
  //    below, right here, where we control the behaviour.
  const data = await getAllEquipment("");


  // Only these listings show up on the public page.
  // (Your original spec says approved listings only — this currently
  // filters for "pending", probably to preview your own submissions.
  // Change "pending" → "approved" when you're done testing.)
  let equipments: TOwnerEquipment[] = Array.isArray(data)
    ? data.filter((item: TOwnerEquipment) => item.status === "approved")
    : [];
    

  // Categories that actually exist in the data — these become the radio
  // options in the sidebar, so every category you can see you can filter by.
  // Taken BEFORE searching/filtering so the option list never shrinks
  // while you type in the search box.
  const categories = [
    ...new Set(equipments.map((item) => item.category)),
  ].sort();

  // ③ Search — ?search=text&searchBy=name|location
  //    "searchBy" missing or "name" → search names; "location" → search places.
  const query = getParam(search, "search").trim().toLowerCase();
  const searchBy =
    getParam(search, "searchBy") === "location" ? "location" : "name";

  if (query) {
    equipments = equipments.filter((item) => {
      const haystack = searchBy === "location" ? item.location : item.name;
      return haystack.toLowerCase().includes(query);
    });
  }

  // ④ Category — ?category=…
  //    "all" (the "All categories" radio) means: do NOT filter.
  const category = getParam(search, "category");
  if (category && category !== "all") {
    equipments = equipments.filter((item) => item.category === category);
  }

  // ⑤ Rental type — ?rentalType=…
  //    "any" (the "Any rental type" radio) means: do NOT filter.
  const rentalType = getParam(search, "rentalType");
  if (rentalType && rentalType !== "any") {
    equipments = equipments.filter((item) => item.rentalType === rentalType);
  }

  // ⑥ Price range — ?rentalPrice=0-500 | 500-1000 | 1000-
  //    "any" (the "Any price" radio) means: do NOT filter.
  const priceRange = getParam(search, "rentalPrice");
  if (priceRange && priceRange !== "any") {
    // The values look like "min-max"; a missing max ("1000-") means
    // "no upper limit".
    const [minRaw, maxRaw] = priceRange.split("-");
    const min = Number(minRaw);
    const max = maxRaw ? Number(maxRaw) : Infinity;

    equipments = equipments.filter(
      (item) => item.rentalPrice >= min && item.rentalPrice <= max
    );
  }

  // ⑦ Availability — ?availableQuantity=available | out-of-stock
  //    "any" (the "Any availability" radio) means: do NOT filter.
  const availability = getParam(search, "availableQuantity");
  if (availability === "available") {
    equipments = equipments.filter((item) => item.availableQuantity > 0);
  } else if (availability === "out-of-stock") {
    equipments = equipments.filter((item) => item.availableQuantity <= 0);
  }

  // ⑧ Sorting — ?sort=price-low-high | price-high-low | recently-added
  //    No value in the URL = "recently-added", which is also the default
  //    radio in the sidebar, so the list always matches what's selected.
  const sortBy = getParam(search, "sort") || "recently-added";

  if (sortBy === "price-low-high") {
    equipments.sort((a, b) => a.rentalPrice - b.rentalPrice);
  } else if (sortBy === "price-high-low") {
    equipments.sort((a, b) => b.rentalPrice - a.rentalPrice);
  } else {
    // "recently-added": the data has no createdAt field, but a Mongo _id
    // starts with a timestamp — so comparing the ids newest-first puts
    // the newest listing first.
    equipments.sort((a, b) => b._id.localeCompare(a._id));
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Page heading ─────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Browse Equipment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rent trusted equipment from owners near you — all listings are
          approved before they appear here.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        {/* ── Left: search / filters / sorting ───────────── */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          {/* `categories` = the real categories found in the data */}
          <EquipmentFilters categories={categories} />
        </aside>

        {/* ── Right: results ─────────────────────────────── */}
        <section className="min-w-0">
          <p className="mb-3 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {equipments.length}
            </span>{" "}
            {equipments.length === 1 ? "item" : "items"}
          </p>

          {equipments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-12 text-center">
              <p className="font-medium">No equipment found</p>
              <p className="text-sm text-muted-foreground">
                Try changing your search or clearing the filters.
              </p>
            </div>
          ) : (
            /* 3-column grid of equipment cards (1 col on mobile, 2 on tablet) */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {equipments.map((equipment) => (
                <EquipmentCard key={equipment._id} equipment={equipment} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AllEquipmentPage;
