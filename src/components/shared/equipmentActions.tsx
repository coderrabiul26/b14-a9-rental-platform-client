"use client";

import { CalendarIcon, HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TOwnerEquipment } from "@/types";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/toast";
import { addFavourite } from "@/lib/actions/equipment";
import BookingModal from "./bookingModal";

/**
 * The two interactive bits of the equipment details page:
 * the "Book Equipment" button and the favourite (heart) icon.
 *
 * It has to be a CLIENT component — Server Components cannot have `onClick`.
 * The page fetches the data and passes one item down here.
 *
 * "Book Equipment" only does the login/role checks here and then opens
 * the booking modal (<BookingModal />) — the modal collects the rental
 * dates, quantity and contact details, checks availability and sends
 * the customer to the payment page.
 */
export function EquipmentActions({
  equipment,
}: {
  equipment: TOwnerEquipment;
}) {
  const router= useRouter()
  const [favourite, setFavourite] = useState(false)
  // Booking modal open/closed (controlled, like the delete dialog).
  const [showBooking, setShowBooking] = useState(false)
  const {data: session}= authClient.useSession()
  const user= session?.user
  console.log(user?.role);

  // A unit is rentable only when at least one is in stock.
  const isAvailable = equipment.availableQuantity > 0;

  /** Runs when "Book Equipment" is pressed. */
  const handleBook = () => {
           // ① Not logged in → sign in first, then come back here.
           if (!user){
             return router.push(`/signin?redirectTo=/all-equipment/${equipment._id}`)
           }
           // ② Only customers are allowed to book.
           if (user.role !== 'customer'){
             toast.add({ title: 'Failed!' ,
                description: 'Your are not a customer'
               })
             return
           }

           // ③ Open the booking modal — everything else (dates, quantity,
           //    availability check, total, payment) happens from there.
           setShowBooking(true)
  };

  /** Runs when the heart icon is pressed. */
  const handleFavourite = async() => {
    
           if (!user){
            return router.push(`/signin?redirectTo=/all-equipment/${equipment._id}`)
           }
           else if(user.role==='customer'){
               const favouriteEquipment={
              equipmentId: equipment._id,
              customerId: user.id,
              customerEmail: user.email,
              equipmentName: equipment.name,
              createdAt: new Date()

            }
            console.log(favouriteEquipment);

           const result= await addFavourite(favouriteEquipment)
           console.log(result);
           if(result.insertedId){
               toast.add({ title: 'Add Favourite!' ,
                description: 'Your equipment added to  successfully'
               })
               // Stay on this page — the heart fills in below, so there
               // is no need to navigate away.
               setFavourite(true)
              }
           }
           else{
             toast.add({ title: 'Failed!' ,
                description: 'Your are not a customer'
               })
           }
          

    //   4. Show it filled, e.g. on the icon:
          //  className={cn("size-4", favourite && "fill-red-500 text-red-500")}
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* ── Book Equipment ─────────────────────────────── */}
        <Button
          className="h-11 flex-1"
          onClick={handleBook}
          disabled={!isAvailable}
        >
          <CalendarIcon className="size-4" />
          Book Equipment
        </Button>

        {/* ── Favourite icon ─────────────────────────────── */}
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={handleFavourite}
          aria-label={`Add ${equipment.name} to favourites`}
        >
          {/* Filled red once the item has been added (see handleFavourite) */}
          <HeartIcon
            className={cn("size-4", favourite && "fill-red-500 text-red-500")}
          />
        </Button>
      </div>

      {/* Stock line — explains why the Book button may be disabled */}
      <p
        className={cn(
          "text-xs",
          isAvailable ? "text-muted-foreground" : "text-destructive"
        )}
      >
        {isAvailable
          ? `${equipment.availableQuantity} unit(s) ready to rent`
          : "Currently out of stock — booking is unavailable"}
      </p>

      {/* ── Booking modal (opened by handleBook) ──────────── */}
      <BookingModal
        equipment={equipment}
        open={showBooking}
        onOpenChange={setShowBooking}
      />
    </div>
  );
}

export default EquipmentActions;
