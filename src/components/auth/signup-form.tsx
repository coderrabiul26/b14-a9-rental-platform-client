"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageIcon, Loader2Icon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/shared/google-icon";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { TUser } from "@/types";

/**
 * Sign up form.
 *
 * Flow: validate password (uppercase + lowercase + 6+ chars) with an error
 * toast, then create the account through BetterAuth inside try/catch and
 * show a success toast on registration.
 */
const SignUpForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user = Object.fromEntries(formData.entries()) as TUser;

    // Password validation: must have an uppercase letter, a lowercase letter,
    // and a length of at least 6 characters.
    const missing: string[] = [];
    if (!/[A-Z]/.test(user.password)) missing.push("an uppercase letter");
    if (!/[a-z]/.test(user.password)) missing.push("a lowercase letter");
    if (user.password.length < 6) missing.push("at least 6 characters");

    if (missing.length > 0) {
      toast.add({
        title: "Invalid password",
        description: `Your password must contain ${missing.join(", ")}.`,
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.image || undefined,
      });

      if (error) {
        toast.add({
          title: "Registration failed",
          description: error.message ?? "Something went wrong. Please try again.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: `Hello! ${user.name}`,
        description: "Your account has been created successfully.",
        type: "success",
      });
      console.log(data);

      // TODO: adjust the destination if you prefer /signin or a dashboard.
      router.push("/");
    } catch {
      toast.add({
        title: "Something went wrong",
        description: "Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log('');

  const handleGoogle = async() => {
    const resData = await authClient.signIn.social({
    provider: "google",
  });
    console.log("Continue with Google", resData);
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
        <span className="text-xs text-muted-foreground">or register with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Registration fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="h-10 pl-9"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
        </div>

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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="photo">Photo URL</Label>
          <div className="relative">
            <ImageIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="photo"
              name="image"
              type="url"
              placeholder="https://i.ibb.co/your-photo.jpg"
              className="h-10 pl-9"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Direct image link or imgbb upload.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              className="h-10 pl-9"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Must contain an uppercase letter, a lowercase letter, and be at
            least 6 characters long.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-10 w-full rounded-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
