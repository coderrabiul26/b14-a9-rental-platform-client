import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/api/user";
import ProfileForm from "@/components/dashboard/shared/profile-form";
import type { TUserProfile } from "@/types";

export default async function CustomerProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  let profileData: TUserProfile = {
    name: user?.name || "Customer User",
    email: user?.email || "customer@geargo.com",
    image: user?.image || null,
    role: "customer",
    phoneNumber: "+880 1700-000000",
    address: "Gulshan-2, Dhaka 1212, Bangladesh",
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
          Customer Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          View and update your personal details, contact information, and delivery address.
        </p>
      </div>

      <ProfileForm initialUser={profileData} roleTitle="Customer" />
    </div>
  );
}
