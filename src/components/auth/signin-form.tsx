"use client";

import { LockIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/shared/google-icon";
import { authClient } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Sign in form — UI only.
 *
 * TODO (BetterAuth):
 * - Email/password: call `signIn.email({ email, password })` in handleSubmit,
 *   then redirect (e.g. router.push("/") or back to the previous page).
 * - Google: call `signIn.social({ provider: "google" })` in handleGoogle.
 */
const SignInForm = () => {
   const searchParams= useSearchParams()
    const redirectTo= searchParams.get('redirectTo')?? '/'
    console.log(redirectTo);

  const router= useRouter()

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
     const formData = new FormData(event.currentTarget)
    const user = Object.fromEntries(formData.entries()) as {
        email: string
        password: string
    }

         const {data, error}=await authClient.signIn.email({
        ...user,
        rememberMe: true,
        callbackURL: redirectTo
    })
    console.log(data, error);
    if (data) {
    toast.add({
        title: "Login successful!",
        description: "Welcome back!",
        type: "success",
        timeout: 3000,
    })

    // Go back to where they came from — e.g. the equipment details page
    // they tried to book (that is where ?redirectTo=… came from).
    router.push(redirectTo)
}

if (error) {
    toast.add({
        title: "Login failed",
        description: error.message ?? "Invalid email or password.",
        type: "error",
        timeout: 3000,
    })
}
console.log(data);

  };

  const handleGoogle = () => {
    console.log("Continue with Google");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Google social login */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-10 w-full"
        onClick={handleGoogle}
      >
        <GoogleIcon className="mr-1" />
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Email + password */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="h-10 pl-9"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="h-10 pl-9"
              required
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="h-10 w-full rounded-full">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default SignInForm;
