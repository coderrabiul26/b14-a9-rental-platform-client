import Link from "next/link";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  HeadphonesIcon,
  AwardIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";

/**
 * Modern SVG icon for the "X" (formerly Twitter) platform.
 * Fulfills the requirement to use the rebranded X logo.
 */
const XIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GitHubIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const FOOTER_CATEGORIES = [
  { name: "Construction Equipment", href: "/all-equipment?category=Construction+Equipment" },
  { name: "Photography Equipment", href: "/all-equipment?category=Photography+Equipment" },
  { name: "Vehicles & Transportation", href: "/all-equipment?category=Vehicles+%26+Transportation" },
  { name: "Agriculture Equipment", href: "/all-equipment?category=Agriculture+Equipment" },
  { name: "Electronics", href: "/all-equipment?category=Electronics" },
  { name: "Event Equipment", href: "/all-equipment?category=Event+Equipment" },
];

const FOOTER_QUICK_LINKS = [
  { name: "Browse All Equipment", href: "/all-equipment" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Why Choose GearGo", href: "/#why-choose-us" },
  { name: "Customer Reviews", href: "/#reviews" },
  { name: "List Your Equipment", href: "/dashboard/owner/add-equipment" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      {/* Top Highlights Strip */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheckIcon className="size-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Verified & Insured</p>
              <p className="text-xs text-muted-foreground">
                All equipment is condition-checked and covered by rental protection.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <AwardIcon className="size-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Transparent Pricing</p>
              <p className="text-xs text-muted-foreground">
                No hidden rental fees. Pay flexible daily, weekly, or monthly rates.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HeadphonesIcon className="size-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">24/7 Priority Support</p>
              <p className="text-xs text-muted-foreground">
                Our support team is here to assist owners and renters round the clock.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission Column */}
          <div className="space-y-4 lg:col-span-2">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              GearGo is a premier equipment rental marketplace connecting verified
              owners with professionals, creators, and businesses. Rent high-end
              machinery, cameras, and tools seamlessly.
            </p>

            {/* Social Icons with rebranded X */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on X"
                className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <XIcon className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <LinkedInIcon className="size-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <GitHubIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_CATEGORIES.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Contact & Support
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="size-4 shrink-0 text-primary mt-0.5" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="size-4 shrink-0 text-primary" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="size-4 shrink-0 text-primary" />
                <span>support@geargo.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} GearGo Rental Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">|</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-border">|</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
