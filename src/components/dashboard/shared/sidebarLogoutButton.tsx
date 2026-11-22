"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

/**
 * Sidebar logout button — signs the user out via BetterAuth,
 * shows a toast, and redirects to the signin page.
 */
const SidebarLogoutButton = () => {
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
      variant="ghost"
      size="icon-sm"
      className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      aria-label="Log out"
      onClick={handleLogout}
    >
      <LogOutIcon />
    </Button>
  );
};

export default SidebarLogoutButton;