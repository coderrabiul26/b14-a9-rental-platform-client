import { Suspense } from "react";
import Link from "next/link";
import { LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import LogoutButton from "./logout-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/** Placeholder shown while the session is resolving (roughly the actions' width). */
const HeaderActionsFallback = () => (
  <div className="flex items-center gap-1.5" aria-hidden="true">
    <span className="h-9 w-16 animate-pulse rounded-lg bg-muted" />
    <span className="h-9 w-24 animate-pulse rounded-full bg-muted" />
  </div>
);

/**
 * Session-aware actions — renders Login/Register when signed out,
 * Dashboard/Logout when signed in.
 */
const HeaderActions = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="flex items-center gap-1.5">
        <Button
          nativeButton={false}
          variant="ghost"
          size="lg"
          render={<Link href="/signin" />}
        >
          Login
        </Button>
        <Button
          nativeButton={false}
          size="lg"
          className="rounded-full"
          render={<Link href="/signup" />}
        >
          Register
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        nativeButton={false}
        variant="ghost"
        size="lg"
        className="gap-1.5"
        render={<Link href="/dashboard" />}
      >
        <LayoutDashboardIcon className="size-4" />
        Dashboard
      </Button>
      <LogoutButton />
    </div>
  );
};

/**
 * Top row of the site header: logo + site name on the left,
 * auth actions on the right.
 *
 * The actions read `headers()`, so they stream inside a `<Suspense>`
 * boundary to keep the route prerenderable under Cache Components.
 */
const Header = () => (
  <div className="bg-background">
    <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: logo + website name */}
      <Logo />

      {/* Right: auth actions */}
      <Suspense fallback={<HeaderActionsFallback />}>
        <HeaderActions />
      </Suspense>
    </div>
  </div>
);

export default Header;
