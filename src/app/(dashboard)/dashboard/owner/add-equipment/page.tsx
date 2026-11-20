"use client";

import React from "react";
import { ImagePlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type {
  TEquipmentCondition,
  TEquipmentSubmission,
  TRentalType,
} from "@/types";
import { authClient } from "@/lib/auth-client";
import { addEquipment } from "@/lib/actions/equipment";
import { useRouter } from "next/navigation";

/* ────────────────────────────────────────────────────────────
   Demo dropdown options — edit these whenever you like.
   ──────────────────────────────────────────────────────────── */
const CATEGORY_OPTIONS = [
  "Construction",
  "Power Tools",
  "Lifting & Access",
  "Earthmoving",
  "Gardening",
  "Events & Party",
];

const RENTAL_TYPE_OPTIONS: TRentalType[] = ["Daily", "Weekly", "Monthly"];

const CONDITION_OPTIONS: TEquipmentCondition[] = [
  "New",
  "Like New",
  "Good",
  "Fair",
];

/* ────────────────────────────────────────────────────────────
   Tiny helper: a label + input cell used by every field.
   ──────────────────────────────────────────────────────────── */
type FormFieldProps = {
  label: string;
  htmlFor?: string;
  /** Extra classes for the grid cell (e.g. make it span the full row). */
  className?: string;
  /** Small helper text below the input. */
  hint?: string;
  children: React.ReactNode;
};

const FormField = ({
  label,
  htmlFor,
  className,
  hint,
  children,
}: FormFieldProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

/**
 * Owner → Add Equipment.
 *
 * Everything the user types lives in the <form> itself, so on submit we can
 * read it all with `new FormData(form)` — no state needed for the text fields.
 */
const AddEquipmentPage = () => {
  const {data: session}= authClient.useSession()
  const user= session?.user

  const router= useRouter()

  // Changing this key remounts the <form>, which empties EVERY field —
  // including the dropdowns (a plain form.reset() does NOT clear them,
  // because Base UI <Select> keeps its own state).
  const [formKey, setFormKey] = React.useState(0);
  /**
   * Runs when the "Add Equipment" button is clicked.
   *
   * It only READS the form and builds the payload —
   * the actual API call is left as a TODO for you.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Stop the browser from reloading the page.
    event.preventDefault();

    // Keep our own reference to the form: React sets `event.currentTarget`
    // back to null as soon as this handler finishes — and it finishes while
    // we are still awaiting the API call below.
    const form = event.currentTarget;

    // ① Collect every named field from the form as { name: value } pairs.
    const formData = new FormData(form);
    const values = Object.fromEntries(
      formData.entries()
    ) as Record<string, string>;

    // The image comes as a File, so we handle it separately (it goes to ImgBB).
    const imageFile = formData.get("image") as File | null;
    formData.delete("image");

    // Now everything left is a plain string.

    // ② A quick safety check for the dropdowns.
    if (!values.category || !values.rentalType || !values.condition) {
      toast.add({
        title: "Missing information",
        description: "Please choose a category, rental type and condition.",
        type: "error",
        timeout: 3000,
      });
      return;
    }

    if (!imageFile || imageFile.size === 0) {
      toast.add({
        title: "Image required",
        description: "Please choose an equipment photo.",
        type: "error",
        timeout: 3000,
      });
      return;
    }

    // ③ Upload the photo to ImgBB and use the link it gives back.
    //
    //    TODO (you): this is the only API call inside this function.
    //    const imageUrl = await uploadImageToImgbb(imageFile);
    const imageUrl = "";

    // ④ Build the object that will be posted to your server.
    //    NOTE: form values arrive as strings, so numbers are converted
    //    with Number() before they are sent.
    const newEquipment: TEquipmentSubmission = {
      name: values.name,
      description: values.description,
      category: values.category,
      location: values.location,
      rentalPrice: Number(values.rentalPrice),
      rentalType: values.rentalType as TRentalType,
      availableQuantity: Number(values.availableQuantity),
      condition: values.condition as TEquipmentCondition,
      brand: values.brand,
      model: values.model,
      image: imageUrl, // ← ImgBB link from step ③
      terms: values.terms,
      ownerEmail: user?.email ?? "", 
      status: "pending"
    };

    const result= await addEquipment(newEquipment)

    console.log('added equipment', result);

    console.log("New equipment ready to submit:", newEquipment);

    toast.add({
      title: "Equipment added",
      description: "Your listing has been sent for approval.",
      type: "success",
      timeout: 3000,
    });

    // ⑤ Clear the form for the next listing.
    //    A new key makes React remount the <form> from scratch, so text
    //    inputs, the file picker AND the three dropdowns all start empty.
    setFormKey((key) => key + 1);

    // ⑥ Redirect to "My Equipment" — that page is a Server Component, so
    //    Next.js fetches the list again and your new item shows up.
    router.push("/dashboard/owner/my-equipment");
  };

  return (
    <>
      {/* Page header (same style as the dashboard page) */}
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
        <SidebarTrigger className="-ml-1" />
        {/* <Separator orientation="vertical" className="mr-2 h-5" /> */}
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Dashboard</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Owner</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Add Equipment</span>
        </nav>
      </header>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-lg">Add Equipment</CardTitle>
            <CardDescription>
              Fill in the details below. Your listing will be sent for approval
              with the status <span className="font-medium">pending</span>.
            </CardDescription>
          </CardHeader>

          <form key={formKey} onSubmit={handleSubmit}>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Equipment Name */}
              <FormField label="Equipment Name" htmlFor="name">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Bosch Hammer Drill"
                  required
                />
              </FormField>

              {/* Category (dropdown) */}
              <FormField label="Category">
                <Select name="category">
                  <SelectTrigger className="w-full" aria-label="Category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              {/* Location */}
              <FormField label="Location" htmlFor="location">
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  required
                />
              </FormField>

              {/* Description */}
              <FormField
                label="Description"
                htmlFor="description"
                className="sm:col-span-2 lg:col-span-3"
              >
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the equipment, what it is used for, what is included…"
                  className="min-h-24"
                  required
                />
              </FormField>

              {/* Brand */}
              <FormField label="Brand" htmlFor="brand">
                <Input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder="e.g. Bosch"
                  required
                />
              </FormField>

              {/* Model */}
              <FormField label="Model" htmlFor="model">
                <Input
                  id="model"
                  name="model"
                  type="text"
                  placeholder="e.g. GSB 16 RE"
                  required
                />
              </FormField>

              {/* Equipment Condition (dropdown) */}
              <FormField label="Equipment Condition">
                <Select name="condition">
                  <SelectTrigger className="w-full" aria-label="Equipment Condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              {/* Rental Price */}
              <FormField label="Rental Price (৳)" htmlFor="rentalPrice">
                <Input
                  id="rentalPrice"
                  name="rentalPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="e.g. 500"
                  required
                />
              </FormField>

              {/* Rental Type (dropdown) */}
              <FormField label="Rental Type">
                <Select name="rentalType">
                  <SelectTrigger className="w-full" aria-label="Rental Type">
                    <SelectValue placeholder="Select rental type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RENTAL_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              {/* Available Quantity */}
              <FormField label="Available Quantity" htmlFor="availableQuantity">
                <Input
                  id="availableQuantity"
                  name="availableQuantity"
                  type="number"
                  min={1}
                  placeholder="e.g. 5"
                  required
                />
              </FormField>

              {/* Equipment Image */}
              <FormField
                label="Equipment Image"
                htmlFor="image"
                className="sm:col-span-2 lg:col-span-3"
                hint="JPG or PNG. The photo is uploaded to ImgBB when you submit."
              >
                <div className="flex items-center gap-3">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="max-w-sm"
                    required
                  />
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    <ImagePlusIcon className="size-4" />
                  </span>
                </div>
              </FormField>

              {/* Rental Terms and Conditions */}
              <FormField
                label="Rental Terms and Conditions"
                htmlFor="terms"
                className="sm:col-span-2 lg:col-span-3"
                hint="Deposit, damage policy, delivery rules…"
              >
                <Textarea
                  id="terms"
                  name="terms"
                  placeholder="e.g. Security deposit required. Equipment must be returned cleaned…"
                  className="min-h-24"
                  required
                />
              </FormField>
            </CardContent>

            <CardFooter className="justify-end gap-2">
              {/* Resets every field back to empty. */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={(event) => event.currentTarget.form?.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                size="lg"
                className="rounded-full px-6"
              >
                Add Equipment
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddEquipmentPage;
