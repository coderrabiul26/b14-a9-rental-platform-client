import { getAllEquipment } from "@/lib/api/equipment";
import EquipmentCard from "@/components/owner/equipmentCard";
import EquipmentFilters from "@/components/shared/equipmentFilters";
import type { TOwnerEquipment } from "@/types";

/**
 * All Equipment — server-side search / filter / sort.
 *
 * Every search, filter, and sort choice lives in the URL (?search=…&
 * category=…&rentalType=…&rentalPrice=…&availableQuantity=…&sort=…), so the
 * page is shareable and the DB does the work. We read those params, forward
 * them to GET /api/allEquipment, and render whatever the API returns — there
 * is NO in-browser filtering or sorting here anymore.
 */

/** Pull one value out of `searchParams` as a plain string ("" if missing). */
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
  const search = await searchParams;

  // ── Build the API query string from the URL params ───────────────
  // Only approved listings are public. "all"/"any" are the UI's reset
  // values and mean "do not filter on this field".
  const params = new URLSearchParams();
  params.set("status", "approved");

  const query = getParam(search, "search").trim();
  if (query) {
    params.set("search", query);
    params.set("searchBy", getParam(search, "searchBy") === "location" ? "location" : "name");
  }

  const category = getParam(search, "category");
  if (category && category !== "all") params.set("category", category);

  const rentalType = getParam(search, "rentalType");
  if (rentalType && rentalType !== "any") params.set("rentalType", rentalType);

  const rentalPrice = getParam(search, "rentalPrice");
  if (rentalPrice && rentalPrice !== "any") params.set("rentalPrice", rentalPrice);

  const availableQuantity = getParam(search, "availableQuantity");
  if (availableQuantity && availableQuantity !== "any") {
    params.set("availableQuantity", availableQuantity);
  }

  // Default sort mirrors the sidebar's default radio ("Recently Added").
  const sort = getParam(search, "sort") || "recently-added";
  params.set("sort", sort);

  // ── Ask the database (two calls in parallel) ─────────────────────
  // ① the filtered/sorted results for the current URL, and
  // ② the full approved list used ONLY to build the category radio options
  //    (so the sidebar doesn't shrink while you filter).
  const [resultsData, allData] = await Promise.all([
    getAllEquipment(params.toString()),
    getAllEquipment("status=approved"),
  ]);

  const equipments: TOwnerEquipment[] = Array.isArray(resultsData) ? resultsData : [];
  const allApproved: TOwnerEquipment[] = Array.isArray(allData) ? allData : [];

  // Categories that exist in the full approved catalogue.
  const categories = [...new Set(allApproved.map((item) => item.category))].sort();

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
          {/* `categories` = the real categories found in the approved data */}
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