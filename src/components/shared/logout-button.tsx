"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

/**
 * Signs the user out via BetterAuth, then returns to the homepage.
 * Must be a client component — `signOut` runs in the browser.
 */
const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.add({
        title: "Logout failed",
        description: error.message ?? "Please try again.",
        type: "error",
        timeout: 3000,
      });
      return;
    }

    toast.add({
      title: "Logged out",
      description: "You have been signed out.",
      type: "success",
      timeout: 3000,
    });

    router.push("/signin");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="lg"
      className="gap-1.5 text-muted-foreground hover:text-foreground"
      onClick={handleLogout}
    >
      <LogOutIcon className="size-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
