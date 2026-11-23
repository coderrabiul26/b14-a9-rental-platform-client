
"use client";

import React from "react";
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
import { ImgbbUpload } from "@/components/shared/imgbb-upload";
import { useRouter } from "next/navigation";

const CATEGORY_OPTIONS = [
  "Construction",
  "Power Tools",
  "Lifting & Access",
  "Earthmoving",
  "Gardening",
  "Events & Party",
];

const RENTAL_TYPE_OPTIONS: TRentalType[] = [
  "Daily",
  "Weekly",
  "Monthly",
];

const CONDITION_OPTIONS: TEquipmentCondition[] = [
  "New",
  "Like New",
  "Good",
  "Fair",
];

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  className?: string;
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
    {hint && (
      <p className="text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
);

const AddEquipmentPage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const router = useRouter();

  const [formKey, setFormKey] = React.useState(0);

  // Stores the ImgBB uploaded image URL.
  const [imageUrl, setImageUrl] = React.useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const values = Object.fromEntries(
      formData.entries()
    ) as Record<string, string>;

    // Validate dropdowns.
    if (!values.category || !values.rentalType || !values.condition) {
      toast.add({
        title: "Missing information",
        description:
          "Please choose a category, rental type and condition.",
        type: "error",
        timeout: 3000,
      });
      return;
    }

    // Validate uploaded image.
    if (!imageUrl) {
      toast.add({
        title: "Image required",
        description: "Please upload an equipment photo.",
        type: "error",
        timeout: 3000,
      });
      return;
    }

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
      image: imageUrl,
      terms: values.terms,
      ownerEmail: user?.email ?? "",
      status: "pending",
    };

    const result = await addEquipment(newEquipment);

    console.log("Added equipment:", result);

    toast.add({
      title: "Equipment added",
      description: "Your listing has been sent for approval.",
      type: "success",
      timeout: 3000,
    });

    // Clear image URL and form fields.
    setImageUrl("");
    setFormKey((key) => key + 1);

    router.push("/dashboard/owner/my-equipment");
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
        <SidebarTrigger className="-ml-1" />

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
            <CardTitle className="text-lg">
              Add Equipment
            </CardTitle>

            <CardDescription>
              Fill in the details below. Your listing will be sent for
              approval with the status{" "}
              <span className="font-medium">pending</span>.
            </CardDescription>
          </CardHeader>

          <form key={formKey} onSubmit={handleSubmit}>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <FormField label="Equipment Name" htmlFor="name">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Bosch Hammer Drill"
                  required
                />
              </FormField>

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

              <FormField label="Location" htmlFor="location">
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  required
                />
              </FormField>

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

              <FormField label="Brand" htmlFor="brand">
                <Input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder="e.g. Bosch"
                  required
                />
              </FormField>

              <FormField label="Model" htmlFor="model">
                <Input
                  id="model"
                  name="model"
                  type="text"
                  placeholder="e.g. GSB 16 RE"
                  required
                />
              </FormField>

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

              {/* ImgBB Image Upload */}
              <FormField
                label="Equipment Image"
                className="sm:col-span-2 lg:col-span-3"
                hint="Upload an equipment photo. It will be hosted on ImgBB."
              >
                <ImgbbUpload
                  onUploaded={setImageUrl}
                  currentUrl={imageUrl}
                />
              </FormField>

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
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setImageUrl("");
                  setFormKey((key) => key + 1);
                }}
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
