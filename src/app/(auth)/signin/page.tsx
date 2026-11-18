import type { Metadata } from "next";
import Link from "next/link";
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
      <SignInForm />
    </AuthShell>
  );
};

export default SigninPage;
