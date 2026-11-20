
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { deleteEquipment } from "@/lib/actions/equipment";
import { TOwnerEquipment } from "@/types";
import { toast } from "../ui/toast";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteEquipmentDialogue({
  item,
}: {
  item: TOwnerEquipment;
}) {
  const router = useRouter();

  // The dialog is "controlled": open/closed lives in this state, so we can
  // close it ourselves ONLY after the delete has actually finished.
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Called whenever the dialog wants to open/close
  // (Cancel button, Esc key, click outside).
  const handleOpenChange = (nextOpen: boolean) => {
    // Ignore close requests while a delete is running.
    if (loading && !nextOpen) return;
    setOpen(nextOpen);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await deleteEquipment(item._id);

      if (res.deletedCount) {
        toast.add({
          title: "Equipment Deleted",
          description: "Equipment deleted permanently.",
        });

        // ① Re-run the server page so it fetches the equipment list again
        //    → the deleted row disappears from the table.
        router.refresh();

        // ② Close the dialog — only now that the deletion is done.
        setOpen(false);
      } else {
        // Nothing was deleted on the server — keep the dialog open to retry.
        toast.add({
          title: "Delete Failed",
          description: "No equipment was deleted. Please try again.",
        });
      }
    } catch {
      toast.add({
        title: "Delete Failed",
        description: "Something went wrong while deleting equipment.",
      });
      // Dialog stays open so the user can press Continue again.
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2Icon />
            Delete
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently
            delete your equipment from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* Disabled while deleting so the dialog can't be closed early */}
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
