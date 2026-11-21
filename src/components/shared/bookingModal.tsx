"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, CreditCardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "../ui/toast";
import { authClient } from "@/lib/auth-client";
import { prepareBooking } from "@/lib/actions/equipment";
import type { TOwnerEquipment } from "@/types";

/* ────────────────────────────────────────────────────────────
   Money helpers — the API repeats EXACT this maths, so the
   preview the customer sees is the amount Stripe will charge.
   ──────────────────────────────────────────────────────────── */

/**
 * Inclusive day count: the start day and the end day both count.
 * 21 Nov → 21 Nov = 1 day, 21 Nov → 23 Nov = 3 days.
 * Returns 0 when the dates are missing or the end is before the start.
 */
const calcDays = (startDate: string, endDate: string) => {
  if (!startDate || !endDate || endDate < startDate) return 0;
  const [y1, m1, d1] = startDate.split("-").map(Number);
  const [y2, m2, d2] = endDate.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000) + 1;
};

/**
 * How many RENTAL UNITS those days cover — depends on how the owner
 * listed the item: Daily bills per day, Weekly per started week,
 * Monthly per started month (8 Daily days = 8 units, 8 Weekly days = 2).
 */
const calcUnits = (days: number, rentalType: TOwnerEquipment["rentalType"]) => {
  if (days < 1) return 0;
  if (rentalType === "Weekly") return Math.ceil(days / 7);
  if (rentalType === "Monthly") return Math.ceil(days / 30);
  return days;
};

/**
 * The booking modal — the 6 rental fields + a live total preview.
 *
 * "Confirm Booking" does NOT create the booking. It calls
 * POST /api/prepareBooking, which validates the fields, checks
 * equipment availability for those dates, calculates the total and
 * stores a PENDING payment row — then we redirect to /checkout?paymentId=…
 * The booking record itself is only created after Stripe takes the
 * money (see /payment/checkout-verify in the API).
 *
 * Controlled component: `open` / `onOpenChange` live in the parent
 * (<EquipmentActions />), same pattern as DeleteEquipmentDialogue.
 */
export function BookingModal({
  equipment,
  open,
  onOpenChange,
}: {
  equipment: TOwnerEquipment;
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // ── The 6 modal fields ──
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Disabled state while the API call is in flight (like the delete dialog).
  const [submitting, setSubmitting] = useState(false);

  // ── Live total preview (recomputed on every keystroke) ──
  const days = calcDays(startDate, endDate);
  const units = calcUnits(days, equipment.rentalType);
  const total = equipment.rentalPrice * units * quantity;

  /** Runs when "Confirm Booking" is pressed. */
  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // ── Client-side checks for fast feedback ──
    // (the API repeats ALL of them — never trust the browser alone)
    if (!startDate || !endDate) {
      return toast.add({ title: "Missing dates", description: "Please pick both rental dates." });
    }
    if (endDate < startDate) {
      return toast.add({ title: "Wrong dates", description: "The end date cannot be before the start date." });
    }
    if (quantity < 1 || quantity > equipment.availableQuantity) {
      return toast.add({
        title: "Wrong quantity",
        description: `Quantity must be between 1 and ${equipment.availableQuantity}.`,
      });
    }
    if (!contactNumber.trim() || !deliveryAddress.trim()) {
      return toast.add({
        title: "Missing details",
        description: "Contact number and delivery address are required.",
      });
    }

    setSubmitting(true);
    try {
      // ① Validate + availability check + calculate total on the API,
      //    which parks a PENDING payment row for this booking.
      const result = await prepareBooking({
        equipmentId: equipment._id,
        customerId: user?.id ?? "",
        customerEmail: user?.email ?? "",
        equipmentName: equipment.name,
        startDate,
        endDate,
        quantity,
        contactNumber: contactNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        notes: notes.trim(),
      });

      if (result?.success) {
        // ② Availability passed and the amount is known → go to the
        //    payment page, which shows this summary and charges it.
        toast.add({
          title: "Booking confirmed",
          description: `Total ৳${result.amount} — complete the payment to finish.`,
        });
        onOpenChange(false);
        router.push(`/checkout?paymentId=${result.paymentId}`);
      } else {
        // 409 (not enough units), 400 (bad dates) … all come back here.
        toast.add({
          title: "Cannot book",
          description: result?.message ?? "Something went wrong. Please try again.",
        });
      }
    } catch {
      toast.add({
        title: "Cannot book",
        description: "Could not reach the server. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {equipment.name}</DialogTitle>
          <DialogDescription>
            ৳{equipment.rentalPrice} / {equipment.rentalType.toLowerCase()} ·{" "}
            {equipment.availableQuantity} unit(s) in stock
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="space-y-4">
          {/* ── Rental dates ─────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rental-start">Rental Start Date</Label>
              <Input
                id="rental-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rental-end">Rental End Date</Label>
              <Input
                id="rental-end"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </div>
          </div>

          {/* ── Quantity + contact ────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rental-quantity">Required Quantity</Label>
              <Input
                id="rental-quantity"
                type="number"
                min={1}
                max={equipment.availableQuantity}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rental-contact">Contact Number</Label>
              <Input
                id="rental-contact"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={contactNumber}
                onChange={(event) => setContactNumber(event.target.value)}
                required
              />
            </div>
          </div>

          {/* ── Delivery address ──────────────────────────── */}
          <div className="space-y-1.5">
            <Label htmlFor="rental-address">Delivery Address</Label>
            <Input
              id="rental-address"
              placeholder="Where should the equipment be delivered?"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              required
            />
          </div>

          {/* ── Additional notes (optional) ────────────────── */}
          <div className="space-y-1.5">
            <Label htmlFor="rental-notes">Additional Notes</Label>
            <Textarea
              id="rental-notes"
              rows={3}
              placeholder="Anything the owner should know (optional)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          {/* ── Live total (duration × quantity) ──────────── */}
          <div className="space-y-1.5 rounded-xl bg-muted/50 p-3 text-sm">
            {days > 0 ? (
              <>
                <div className="flex justify-between text-muted-foreground">
                  <span>Duration</span>
                  <span>
                    {days} day(s) · {units} × {equipment.rentalType.toLowerCase()} unit
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Rate</span>
                  <span>
                    ৳{equipment.rentalPrice} × {units} × {quantity} unit(s)
                  </span>
                </div>
                <div className="flex justify-between border-t border-foreground/10 pt-1.5 font-medium">
                  <span>Estimated Total</span>
                  <span className="text-primary">৳{total.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Pick both rental dates to see the total amount.
              </p>
            )}
          </div>

          {/* ── Actions ───────────────────────────────────── */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              <CreditCardIcon className="size-4" />
              {submitting ? "Checking availability..." : "Confirm Booking"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            <CalendarIcon className="mr-1 inline size-3" />
            Availability and the final amount are re-checked on the server
            before you pay.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default BookingModal;
