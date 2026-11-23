"use client";

import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TOwnerEquipment } from "@/types";
import { DeleteEquipmentDialogue } from "./deleteEquipment";
import { UpdateEquipmentModal } from "./updateEquipmentModal";
import { useRouter } from "next/navigation";


/* ────────────────────────────────────────────────────────────
   The 3 Actions of one table row (View Details / Update / Delete).

   WHY THIS FILE EXISTS
   The "My Equipment" page is a *Server Component* (it reads the
   session with headers()). Server Components cannot carry event
   handlers like onClick — so every clickable thing lives here,
   in a Client Component, and only the plain `item` data is passed
   down from the page.
   ──────────────────────────────────────────────────────────── */
export function EquipmentRowActions({ item }: { item: TOwnerEquipment }) {
  const router= useRouter()
  /* ──────────────────────────────────────────────────────────
     ▸ VIEW DETAILS  (read one row)
     ────────────────────────────────────────────────────────── */
  const handleViewDetails = (item: TOwnerEquipment) => {
    // TODO (you): show the full equipment info.
    //
    // Option A — separate page (simplest):
      router.push(`/all-equipment/${item._id}`);
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
     Handled by <UpdateEquipmentModal /> — a client component that
     pre-fills the form with `item` and PUTs the changes to
     /api/updateEquipment/:id, then refreshes the server page.
     ────────────────────────────────────────────────────────── */

  return (
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

      {/* Update opens the edit modal (pre-filled form → PUT → refresh) */}
      <UpdateEquipmentModal item={item} />

      {/* Already a Client Component — just pass the data */}
      <DeleteEquipmentDialogue item={item} />
    </div>
  );
}
