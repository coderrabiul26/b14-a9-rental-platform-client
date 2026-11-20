"use client";

import { EyeIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TOwnerEquipment } from "@/types";
import { DeleteEquipmentDialogue } from "./deleteEquipment";

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
  /* ──────────────────────────────────────────────────────────
     ▸ VIEW DETAILS  (read one row)
     ────────────────────────────────────────────────────────── */
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
    // TODO (you): open your edit page / form.
    //
    //   const router = useRouter();   // ← import from "next/navigation"
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

      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5"
        onClick={() => handleUpdate(item)}
      >
        <PencilIcon />
        Update
      </Button>

      {/* Already a Client Component — just pass the data */}
      <DeleteEquipmentDialogue item={item} />
    </div>
  );
}
