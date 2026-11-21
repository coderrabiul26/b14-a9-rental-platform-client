import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthShell from "@/components/auth/auth-shell";
import SignInForm from "@/components/auth/signin-form";


export const metadata: Metadata = {
  title: "Sign In | GearGo",
  description: "Sign in to your GearGo account to rent and manage equipment.",
};

const SigninPage = () => {
 

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your account to continue renting."
      footer={
        <p className="text-muted-foreground">
          New to GearGo?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      {/* useSearchParams() inside the form needs a Suspense boundary,
          otherwise Next.js cannot prerender this page (build error). */}
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
};

export default SigninPage;
