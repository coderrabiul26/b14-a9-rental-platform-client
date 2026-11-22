import Link from "next/link";
import { CompassIcon, HomeIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Friendly, reusable 404 fallback UI.
 *
 * Server Component by design (it is loaded on every route via the root
 * `not-found.tsx`), so it only uses `<Link>` and presentational markup.
 */
const NotFoundState = () => {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CompassIcon className="size-8" />
      </div>

      <div className="space-y-2">
        <p className="text-5xl font-extrabold tracking-tight text-primary">404</p>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Page not found
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL, or head back to a safe place below.
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Button
          nativeButton={false}
          className="gap-2 rounded-xl"
          render={<Link href="/" />}
        >
          <HomeIcon className="size-4" />
          Back to home
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          className="gap-2 rounded-xl"
          render={<Link href="/all-equipment" />}
        >
          <SearchIcon className="size-4" />
          Browse equipment
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;