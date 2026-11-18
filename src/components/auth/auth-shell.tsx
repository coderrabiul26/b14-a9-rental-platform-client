import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";

type AuthShellProps = {
  /** Card heading, e.g. "Welcome back". */
  title: string;
  /** Short text under the heading. */
  description: string;
  /** The form (or any content) rendered inside the card. */
  children: React.ReactNode;
  /** Optional content rendered below the card, e.g. "switch to Sign up" link. */
  footer?: React.ReactNode;
};

/**
 * Shared layout for the auth pages: soft teal decorative background,
 * centered logo and a card that holds the form. Keeps Sign in / Sign up
 * visually consistent.
 */
export const AuthShell = ({ title, description, children, footer }: AuthShellProps) => {
  return (
    <div className="relative flex min-h-[calc(100vh-7rem)] items-center justify-center overflow-hidden bg-muted/30 px-4 py-10">
      {/* Decorative brand blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo above the card */}
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthShell;
