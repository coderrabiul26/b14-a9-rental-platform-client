"use client";

import { CalendarIcon, HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TOwnerEquipment } from "@/types";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/toast";
const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

/**
 * The two interactive bits of the equipment details page:
 * the "Book Equipment" button and the favourite (heart) icon.
 *
 * It has to be a CLIENT component — Server Components cannot have `onClick`.
 * The page fetches the data and passes one item down here.
 *
 * Both handlers below are intentionally EMPTY: implement them yourself.
 * Each one has a suggested flow written as comments.
 */
export function EquipmentActions({
  equipment,
}: {
  equipment: TOwnerEquipment;
}) {
  const router= useRouter()
  const [favourite, setFavourite] = useState(false)
  const {data: session}= authClient.useSession()
  const user= session?.user
  const customerEmail= user?.email
  console.log(customerEmail);

  // A unit is rentable only when at least one is in stock.
  const isAvailable = equipment.availableQuantity > 0;

  /** Runs when "Book Equipment" is pressed. */
  const handleBook = async() => {
    // TODO (you): implement booking. A typical flow —
    //
    //   1. Make sure someone is logged in (this is a client component, so
    //      authClient / useRouter / toast all work here once imported):
           const { data } = await authClient.getSession()
           if (!user) return router.push("/signin")
    //
    //   2. Tell your API about the booking:
    //        await fetch(`${BASE_URL}/api/bookings`, {
    //          method: "POST",
    //          headers: { "Content-Type": "application/json" },
    //          body: JSON.stringify({
    //            equipmentId: equipment._id,  // ← WHICH item
    //            customerEmail: data.user.email,
    //            quantity: 1,                 // ← or from a quantity input
    //          }),
    //        })
    //
    //   3. Confirm + navigate:
    //        toast.add({ title: "Booking requested", type: "success" })
    //        router.push("/dashboard/customer/my-rental")
  };

  /** Runs when the heart icon is pressed. */
  const handleFavourite = async() => {

    // TODO (you): implement favourites. A typical flow —
    
           if (!user){
            return router.push(`/signin?redirectTo=/all-equipment/${equipment._id}`)
           }
    //
    //   1. Keep a local on/off flag so the heart can fill in:
          //  const [favourite, setFavourite] = useState(false)
    //      (add `useState` to the react import at the top)
       
    //   2. Tell your API:
           const res= await fetch(`${BASE_URL}/api/addFavourite`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ equipmentId: equipment._id, customerEmail }),
           })
           const data= await res.json()
           console.log(data);
    //
    //   3. Flip the flag + confirm:
           setFavourite(!favourite)
           toast.add({ title: favourite ? "Removed from favourites" : "Added to favourites" })
    //
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
          <HeartIcon className="size-4" />
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
    </div>
  );
}

export default EquipmentActions;
