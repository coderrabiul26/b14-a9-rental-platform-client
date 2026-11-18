import Link from "next/link";
import { cn } from "@/lib/utils";

/** The official website name — change it here and it updates everywhere. */
export const SITE_NAME = "GearGo";

/** Initial letters of the site name, used inside the logo mark. */
export const SITE_INITIALS = "GG";

/** The name is split so the accent part gets the brand color ("Gear" + "Go"). */
export const SITE_NAME_MAIN = "Gear";
export const SITE_NAME_ACCENT = "Go";

type LogoProps = {
  /** Extra classes for the outer link container. */
  className?: string;
  /** Set to false to render only the logo mark without the site name text. */
  showName?: boolean;
  /** Extra classes for the site name text. */
  nameClassName?: string;
};

/**
 * Reusable logo mark: "GG" initials inside a solid brand-colored square,
 * followed by the site name with a brand-colored accent. Used in the header,
 * footer, dashboards and menus.
 */
export const Logo = ({
  className,
  showName = true,
  nameClassName,
}: LogoProps) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-extrabold tracking-tight text-primary-foreground shadow-sm">
        {SITE_INITIALS}
      </span>
      {showName && (
        <span
          className={cn(
            "text-lg font-extrabold tracking-tight text-foreground",
            nameClassName
          )}
        >
          {SITE_NAME_MAIN}
          <span className="text-primary">{SITE_NAME_ACCENT}</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
