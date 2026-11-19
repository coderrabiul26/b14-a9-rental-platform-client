"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { EyeIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import type { TEquipmentStatus, TOwnerEquipment } from "@/types";
import { authClient } from "@/lib/auth-client";
import { getEquipment } from "@/lib/api/equipment";

/* ────────────────────────────────────────────────────────────
   ① DEMO DATA — replace this with the answer of YOUR API call.
      Same shape as `TEquipmentSubmission` (from the Add Equipment
      form) + `_id` which the server generates for every document.
   ──────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────
   ② Colours for the Status badge (pending / approved / rejected).
   ──────────────────────────────────────────────────────────── */
const STATUS_STYLES: Record<TEquipmentStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 ring-amber-500/30",
  approved: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30",
  rejected: "bg-red-500/10 text-red-600 ring-red-500/30",
};

/**
 * Owner → My Equipment.
 *
 * UI only: the 3 action buttons call the handlers at the bottom,
 * each one filled with a step-by-step TODO for you.
 */
const MyEquipmentPage = () => {
  const {data: session}=authClient.useSession()
  const user= session?.user
  
 const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!user?.email) return;

      const data = await getEquipment(`ownerEmail=${user.email}`);

      setEquipmentData(data);
    };

    fetchEquipment();
  }, [user?.email]);



  const handleViewDetails = (item: TOwnerEquipment) => {
    // TODO (you): show the full equipment info.
    //
    // Option A — separate page (simplest):
    //   router.push(`/dashboard/owner/my-equipment/${item._id}`);
    //   → creates a page that reads `params.id` and fetches that one item.
    //
    // Option B — open a dialog/modal on this page and pass `item` to it.
    //   (you already have <AlertDialog> / <Dialog> in components/ui)
    //
    // The `_id` is how the server knows WHICH row you clicked.
    console.log("View details:", item._id);
  };

  /* ──────────────────────────────────────────────────────────
     ▸ UPDATE  (edit one row)
     ────────────────────────────────────────────────────────── */
  const handleUpdate = (item: TOwnerEquipment) => {
    // TODO (you): open your edit page / form (router is set up above).
    //
    //   router.push(`/dashboard/owner/update-equipment/${item._id}`);
    //
    // Tip: your update form can be a copy of the Add Equipment form —
    // pre-fill it with `item` (defaultValue={item.name} …) and on submit
    // send PUT / PATCH instead of POST:
    //
    //   await fetch(`/api/equipment/${item._id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(updatedEquipment),
    //   });
    console.log("Update:", item._id);
  };

  /* ──────────────────────────────────────────────────────────
     ▸ DELETE  (remove one row)
     ────────────────────────────────────────────────────────── */
  const handleDelete = async (item: TOwnerEquipment) => {
    // STEP 1 — always ask the user first.
    // if (!window.confirm(`Delete "${item.name}"?`)) return;
    // (nicer version: use <AlertDialog> from components/ui/alert-dialog)

    // STEP 2 — TODO (you): call your API and delete by _id.
    // const res = await fetch(`/api/equipment/${item._id}`, {
    //   method: "DELETE",
    // });
    // if (!res.ok) {
    //   toast.add({ title: "Delete failed", type: "error" });
    //   return;
    // }

    // STEP 3 — remove it from the table so the UI updates right away.
    // setEquipment((previous) => previous.filter((row) => row._id !== item._id));

    toast.add({
      title: "Demo only",
      description: "Connect this button to your DELETE API.",
      type: "info",
      timeout: 3000,
    });
    console.log("Delete:", item._id);
  };

  /* ──────────────────────────────────────────────────────────
     HOW TO LOAD REAL DATA (when you are ready)
     ──────────────────────────────────────────────────────────
     1. Change the state above to start empty:

          const [equipment, setEquipment] = useState<TOwnerEquipment[]>([]);
          const [loading, setLoading] = useState(true);

     2. Fetch inside useEffect (client side) — the owner email comes
        from your session:

          useEffect(() => {
            const load = async () => {
              const res = await fetch(`/api/equipment?ownerEmail=${email}`);
              const data = await res.json();
              setEquipment(data);      // your API should return TOwnerEquipment[]
              setLoading(false);
            };
            load();
          }, [email]);

     3. While `loading` is true, show a spinner / skeleton instead of the table,
        and if `equipment.length === 0` show the empty state below.
     ────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Page header (same style as the other dashboard pages) */}
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-5" />
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Dashboard</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Owner</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">My Equipment</span>
        </nav>

        {/* Shortcut to the Add Equipment form */}
        <Button
          nativeButton={false}
          size="sm"
          className="ml-auto gap-1.5 rounded-full"
          render={
            <Link href="/dashboard/owner/add-equipment" aria-label="Add equipment" />
          }
        >
          <PlusIcon />
          Add Equipment
        </Button>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Equipment</CardTitle>
            <CardDescription>
              Everything you have added. New listings start as{" "}
              <span className="font-medium text-foreground">pending</span> until
              an admin approves them.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Empty state — show this when the API returns 0 rows */}
            {equipmentData.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t added any equipment yet.
                </p>
                <Button
                  nativeButton={false}
                  variant="outline"
                  render={<Link href="/dashboard/owner/add-equipment" />}
                >
                  Add your first equipment
                </Button>
              </div>
            ) : (
              /* ── The table ── */
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rental Price</TableHead>
                    <TableHead>Available Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {equipmentData.map((item:TOwnerEquipment) => (
                    <TableRow key={item._id}>
                      {/* Name — brand + model underneath as a small hint */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.brand} {item.model}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {item.category}
                      </TableCell>

                      {/* ৳ = Bangladeshi Taka */}
                      <TableCell>৳{item.rentalPrice}</TableCell>

                      <TableCell>
                        {/* Red-ish when nothing is left to rent */}
                        <span
                          className={
                            item.availableQuantity === 0
                              ? "font-medium text-destructive"
                              : undefined
                          }
                        >
                          {item.availableQuantity}
                        </span>
                      </TableCell>

                      {/* Status badge — colour comes from STATUS_STYLES */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={STATUS_STYLES[item.status]}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>

                      {/* The 3 actions — just UI, handlers are above */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-muted-foreground"
                            onClick={() => handleViewDetails(item)}
                          >
                            <EyeIcon />
                            View Details
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handleUpdate(item)}
                          >
                            <PencilIcon />
                            Update
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2Icon />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MyEquipmentPage;
