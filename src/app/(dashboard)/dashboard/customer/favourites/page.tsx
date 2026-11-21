import { headers } from "next/headers";
import Link from "next/link";
import { HeartIcon, PackageIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCustomerFavourites } from "@/lib/api/equipment";
import { Button } from "@/components/ui/button";
import FavouritesTable from "@/components/dashboard/customer/favourites-table";
import type { TCustomerFavourite } from "@/types";

const DEMO_FAVOURITES: TCustomerFavourite[] = [
  {
    _id: "fav-1",
    equipmentId: "demo-fx3",
    customerId: "cust-1",
    customerEmail: "customer@geargo.com",
    equipmentName: "Sony FX3 Cinema Line Full-Frame Camera",
    createdAt: "2026-11-20T12:00:00Z",
  },
  {
    _id: "fav-2",
    equipmentId: "demo-transit",
    customerId: "cust-1",
    customerEmail: "customer@geargo.com",
    equipmentName: "Ford Transit High Roof Cargo Van",
    createdAt: "2026-11-21T09:15:00Z",
  },
];

export default async function CustomerFavouritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  let favourites: TCustomerFavourite[] = [];
  try {
    if (user?.email) {
      const data = await getCustomerFavourites(user.email);
      if (Array.isArray(data)) {
        favourites = data;
      }
    }
  } catch {
    favourites = [];
  }

  // Show live database favourites for the logged-in user
  const displayFavourites = user ? favourites : DEMO_FAVOURITES;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Favorites
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all equipment listings you have saved for future rental projects.
          </p>
        </div>

        <Button
          nativeButton={false}
          className="gap-2 rounded-xl"
          render={<Link href="/all-equipment" />}
        >
          <PackageIcon className="size-4" />
          Explore More Gear
        </Button>
      </div>

      {/* Favorites Table (PDF Spec: table with View Details & Remove Favorite) */}
      <FavouritesTable initialFavourites={displayFavourites} />
    </div>
  );
}
