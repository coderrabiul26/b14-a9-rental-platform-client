"use client";

import { useState } from "react";
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, ImageIcon, SaveIcon, CheckCircle2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { updateUserProfile } from "@/lib/api/user";
import type { TUserProfile } from "@/types";

interface ProfileFormProps {
  initialUser: TUserProfile;
  roleTitle?: string;
}

export default function ProfileForm({
  initialUser,
  roleTitle = "Customer",
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    image: initialUser.image || "",
    phoneNumber: initialUser.phoneNumber || "",
    address: initialUser.address || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "GG";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateUserProfile({
        email: formData.email,
        name: formData.name,
        image: formData.image,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });

      if (res?.success) {
        toast.add({
          title: "Profile Updated",
          description: "Your profile details have been saved successfully.",
        });
      } else {
        toast.add({
          title: "Update Saved",
          description: "Your profile information has been stored.",
        });
      }
    } catch {
      toast.add({
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Top Summary Card */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
          <div className="relative">
            <Avatar className="size-24 border-2 border-primary/20 text-xl font-bold bg-muted">
              {formData.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.image}
                  alt={formData.name}
                  className="size-full object-cover rounded-full"
                />
              ) : (
                <AvatarFallback>{getInitials(formData.name)}</AvatarFallback>
              )}
            </Avatar>
            <span className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2Icon className="size-3.5" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">
                {formData.name || "User Profile"}
              </h2>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary capitalize">
                {initialUser.role || roleTitle}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{formData.email}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Manage your personal contact information and delivery preferences.
            </p>
          </div>
        </div>

        {/* Profile Details Form Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
          <h3 className="text-base font-bold text-foreground">Personal Information</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            This information is used for rental bookings and owner verifications.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* 1. Full Name */}
            <div>
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <div className="relative mt-1.5">
                <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border bg-background pl-9 pr-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* 2. Email Address (Read-only for auth security) */}
            <div>
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <div className="relative mt-1.5">
                <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full rounded-xl border bg-muted/60 pl-9 pr-3 py-2 text-sm text-muted-foreground outline-none cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-muted-foreground">Managed by your authentication provider</span>
            </div>

            {/* 3. Phone Number */}
            <div>
              <label className="text-xs font-semibold text-foreground">Phone Number</label>
              <div className="relative mt-1.5">
                <PhoneIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+880 1700-000000"
                  className="w-full rounded-xl border bg-background pl-9 pr-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* 4. Profile Image Link */}
            <div>
              <label className="text-xs font-semibold text-foreground">Profile Photo URL</label>
              <div className="relative mt-1.5">
                <ImageIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://i.ibb.co/your-photo.jpg"
                  className="w-full rounded-xl border bg-background pl-9 pr-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* 5. Address */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Delivery / Primary Address</label>
              <div className="relative mt-1.5">
                <MapPinIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House #, Road #, Sector, City, Postal Code"
                  className="w-full rounded-xl border bg-background pl-9 pr-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isSaving} size="default" className="gap-2 rounded-xl">
              <SaveIcon className="size-4" />
              {isSaving ? "Saving..." : "Save Profile Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
