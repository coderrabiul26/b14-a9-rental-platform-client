"use client";

import { CalendarIcon, HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TOwnerEquipment } from "@/types";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/toast";
import { addBooking, addFavourite } from "@/lib/actions/equipment";
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
  const customerId= user?.id
  // console.log(customerEmail);
  console.log(user?.role);

  // A unit is rentable only when at least one is in stock.
  const isAvailable = equipment.availableQuantity > 0;

  /** Runs when "Book Equipment" is pressed. */
  const handleBook = async() => {
    // TODO (you): implement booking. A typical flow —
    //
    //   1. Make sure someone is logged in (this is a client component, so
    //      authClient / useRouter / toast all work here once imported):
           if (!user){
             return router.push(`/signin?redirectTo=/all-equipment/${equipment._id}`)
           } 
           else if(user.role==='customer'){
            router.push('/checkout')

            const bookingEquipment={
              equipmentId: equipment._id,
              customerId: user.id,
              customerEmail: user.email,
              equipmentName: equipment.name,
              createdAt: new Date()

            }
            // console.log(bookingEquipment);
            const result= await addBooking(bookingEquipment)
            // console.log(result);
            if(result.insertedId){
               toast.add({ title: 'Booking Successfull!' ,
                description: 'Your equipment booked successfully'
               })
               router.push('/all-equipment')
              
              }
           }
           else{
            toast.add({ title: 'Failed!' ,
                description: 'Your are not a customer'
               })
           }
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
               router.push('/all-equipment')
              
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
