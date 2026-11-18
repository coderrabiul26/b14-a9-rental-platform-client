import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/auth-shell";
import SignUpForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | GearGo",
  description: "Create a GearGo account to rent equipment or list your own.",
};

const SignupPage = () => {
  return (
    <AuthShell
      title="Create your account"
      description="Join GearGo to rent equipment in minutes."
      footer={
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
};

export default SignupPage;
