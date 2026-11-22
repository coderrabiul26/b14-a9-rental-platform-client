"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { updateEquipmentListing } from "@/lib/api/equipment";
import type { TOwnerEquipment, TRentalType, TEquipmentCondition } from "@/types";

const CATEGORY_OPTIONS = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
  "Power Tools",
  "Lifting & Access",
  "Earthmoving",
  "Gardening",
];

const RENTAL_TYPES: TRentalType[] = ["Daily", "Weekly", "Monthly"];
const CONDITIONS: TEquipmentCondition[] = ["New", "Like New", "Good", "Fair"];

export function UpdateEquipmentModal({ item }: { item: TOwnerEquipment }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state initialized with the current equipment values
  const [formData, setFormData] = useState({
    name: item.name || "",
    category: item.category || "Construction Equipment",
    location: item.location || "",
    rentalPrice: item.rentalPrice || 0,
    rentalType: item.rentalType || "Daily",
    availableQuantity: item.availableQuantity || 1,
    condition: item.condition || "Good",
    brand: item.brand || "",
    model: item.model || "",
    image: item.image || "",
    description: item.description || "",
    terms: item.terms || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        rentalPrice: Number(formData.rentalPrice),
        availableQuantity: Number(formData.availableQuantity),
      };

      const res = await updateEquipmentListing(item._id, payload);

      if (res?.success || res?.result?.acknowledged) {
        toast.add({
          title: "Equipment Updated",
          description: `${formData.name} details have been updated.`,
        });

        setOpen(false);
        // Refresh the server page so updated row reflects in the table
        router.refresh();
      } else {
        toast.add({
          title: "Update Failed",
          description: res?.message || "Could not update equipment. Please try again.",
        });
      }
    } catch {
      toast.add({
        title: "Error",
        description: "Something went wrong while updating equipment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-foreground hover:bg-muted"
          >
            <PencilIcon className="size-3.5" />
            Update
          </Button>
        }
      />

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Update Equipment</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Modify the listing details for <span className="font-semibold text-foreground">{item.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name" className="text-xs font-semibold">Equipment Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Caterpillar Mini Excavator"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-xs font-semibold">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat} className="bg-popover text-popover-foreground">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Brand and Model */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="brand" className="text-xs font-semibold">Brand / Manufacturer</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony, Caterpillar, John Deere"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="model" className="text-xs font-semibold">Model Number</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. FX3, 305 CR"
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 3: Price, Rental Type, Quantity, Condition */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <Label htmlFor="rentalPrice" className="text-xs font-semibold">Price (৳)</Label>
              <Input
                id="rentalPrice"
                name="rentalPrice"
                type="number"
                min="1"
                required
                value={formData.rentalPrice}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rentalType" className="text-xs font-semibold">Rental Type</Label>
              <select
                id="rentalType"
                name="rentalType"
                value={formData.rentalType}
                onChange={handleChange}
                className="mt-1 flex h-8 w-full rounded-lg border border-input bg-transparent px-2 py-1 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {RENTAL_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-popover text-popover-foreground">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="availableQuantity" className="text-xs font-semibold">Stock Qty</Label>
              <Input
                id="availableQuantity"
                name="availableQuantity"
                type="number"
                min="0"
                required
                value={formData.availableQuantity}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="condition" className="text-xs font-semibold">Condition</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="mt-1 flex h-8 w-full rounded-lg border border-input bg-transparent px-2 py-1 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond} className="bg-popover text-popover-foreground">
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Location & Image */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="location" className="text-xs font-semibold">Pickup Location</Label>
              <Input
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Gulshan-2, Dhaka"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-xs font-semibold">Photo URL (ImgBB / Host)</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 5: Description */}
          <div>
            <Label htmlFor="description" className="text-xs font-semibold">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Features, accessories included, operational state..."
              className="mt-1"
            />
          </div>

          {/* Row 6: Rental Terms */}
          <div>
            <Label htmlFor="terms" className="text-xs font-semibold">Terms & Conditions</Label>
            <Textarea
              id="terms"
              name="terms"
              rows={2}
              value={formData.terms}
              onChange={handleChange}
              placeholder="Security deposit rules, return conditions..."
              className="mt-1"
            />
          </div>

          {/* Footer Action Buttons */}
          <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="size-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
