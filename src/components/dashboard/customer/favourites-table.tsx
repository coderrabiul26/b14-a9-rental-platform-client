"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartIcon,
  Trash2Icon,
  ExternalLinkIcon,
  PackageIcon,
  SearchIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { removeCustomerFavourite } from "@/lib/api/equipment";
import type { TCustomerFavourite } from "@/types";

interface FavouritesTableProps {
  initialFavourites: TCustomerFavourite[];
}

export default function FavouritesTable({ initialFavourites }: FavouritesTableProps) {
  const [favourites, setFavourites] = useState<TCustomerFavourite[]>(initialFavourites);
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filtered = favourites.filter((item) =>
    item.equipmentName.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async (id: string, name: string) => {
    setRemovingId(id);
    try {
      await removeCustomerFavourite(id);
      setFavourites((prev) => prev.filter((item) => item._id !== id && item.equipmentId !== id));
      toast.add({
        title: "Removed from Favorites",
        description: `${name} has been removed from your wishlist.`,
      });
    } catch {
      toast.add({
        title: "Error",
        description: "Failed to remove favorite item.",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (val?: string | Date) => {
    if (!val) return "N/A";
    const str = typeof val === "string" ? val : val.toISOString();
    try {
      return new Date(str).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return str;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-card pl-9 pr-4 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> saved item(s)
        </p>
      </div>

      {/* Table Required by PDF: Table format with View Details and Remove Favorite actions */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Equipment Name</TableHead>
              <TableHead className="font-bold">Equipment ID</TableHead>
              <TableHead className="font-bold">Added On</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <HeartIcon className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Your favorites list is empty</p>
                    <p className="text-xs">Save equipment items by clicking the heart icon on any listing.</p>
                    <Button
                      nativeButton={false}
                      size="sm"
                      className="mt-2 rounded-xl"
                      render={<Link href="/all-equipment" />}
                    >
                      Browse Equipment
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item._id} className="hover:bg-muted/40 transition">
                  {/* Equipment Name */}
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <PackageIcon className="size-4" />
                      </div>
                      <span className="font-semibold">{item.equipmentName}</span>
                    </div>
                  </TableCell>

                  {/* Equipment ID */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.equipmentId}
                  </TableCell>

                  {/* Added Date */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt || (item as unknown as { bookingDate?: string }).bookingDate)}
                  </TableCell>

                  {/* Actions: View Details & Remove Favorite */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 rounded-lg text-xs"
                        render={<Link href={`/all-equipment/${item.equipmentId}`} />}
                      >
                        <ExternalLinkIcon className="size-3" />
                        View Details
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={removingId === item._id}
                        onClick={() => handleRemove(item._id || item.equipmentId, item.equipmentName)}
                        className="h-8 gap-1 rounded-lg text-xs"
                      >
                        <Trash2Icon className="size-3" />
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
