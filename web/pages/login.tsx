import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/component";
import { Card } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
  // Create necessary hooks for clients and providers.
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();
  // Create states for each field in the form.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    // https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // authentication error
    if (error) {
      console.log("Login error:", error.message);
      alert(error);
      // return;
    }

    // redirect to home page
    router.push("/");

    // given code to reset the user_profile query to refresh header data
    queryClient.resetQueries({ queryKey: ["user_profile"] });
  };

  return (
    <div className="flex flex-col min-h-[calc(100svh)] items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="fixed top-2 left-4 w-[186px] h-[81px]">
        <img
          src="/ByteNotesLogo.png"
          className="w-full h-full object-contain"
        />
      </div>

      <Card className="w-full max-w-md rounded-lg border border-border bg-card/80 backdrop-blur-md p-6 shadow-lg">
        <div className="mb-2 space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your Byte Notes account
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button className="mt-2 w-full bg-blue-400" onClick={logIn}>
            Login
          </Button>
        </div>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
