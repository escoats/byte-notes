import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/component";
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
    <div className="flex  min-h-[calc(100svh-164px)] flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="fixed top-2 left-4 w-[186px] h-[81px]">
                  <img
                    src="/ByteNotesLogo.png"
                    className="w-full h-full object-contain"
                  />
                </div>
              </a>
              <h1 className="text-xl font-bold">Log in to Byte Notes</h1>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up here!
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" onClick={logIn}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
