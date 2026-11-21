import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/api/user";
import ProfileForm from "@/components/dashboard/shared/profile-form";
import type { TUserProfile } from "@/types";

export default async function OwnerProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  let profileData: TUserProfile = {
    name: user?.name || "Equipment Owner",
    email: user?.email || "owner@geargo.com",
    image: user?.image || null,
    role: "owner",
    phoneNumber: "+880 1800-112233",
    address: "Banani Commercial Area, Dhaka 1213, Bangladesh",
  };

  try {
    if (user?.email) {
      const serverProfile = await getUserProfile(user.email);
      if (serverProfile && serverProfile.email) {
        profileData = {
          ...profileData,
          ...serverProfile,
        };
      }
    }
  } catch {
    // Keep fallback initial profile
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Owner Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Update your business information, contact phone number, and pickup warehouse address.
        </p>
      </div>

      <ProfileForm initialUser={profileData} roleTitle="Owner" />
    </div>
  );
}
