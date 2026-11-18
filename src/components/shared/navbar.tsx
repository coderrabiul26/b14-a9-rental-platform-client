"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxesIcon,
  HomeIcon,
  MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

/** Public navigation links (optional menu items are intentionally excluded). */
const NAV_LINKS = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "All Equipment", href: "/all-equipment", icon: BoxesIcon },
];

const baseLinkClasses =
  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

const activeLinkClasses = "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary";

/**
 * Bottom row of the site header: navigation links on desktop,
 * and a slide-in menu on mobile.
 */
const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Desktop links */}
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                baseLinkClasses,
                pathname === href && activeLinkClasses
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                aria-label="Open menu"
              />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>

          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Logo nameClassName="text-base" />
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    baseLinkClasses,
                    pathname === href && activeLinkClasses
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Mobile auth actions — TODO: swap for Dashboard/Logout when auth exists */}
            <div className="mt-auto flex flex-col gap-2 p-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                render={<Link href="/signin" />}
              >
                Login
              </Button>
              <Button size="lg" className="w-full" render={<Link href="/signup" />}>
                Register
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
