import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { createClient } from "@/utils/supabase/component";
import { useQueryClient } from "@tanstack/react-query";
import { AtSign, Link } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProfilePage() {
  // Create necessary hooks for clients and providers.
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();
  // Create states for each field in the form.
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const editProfile = async () => {};

  return (
    <div className="flex min-h-[calc(100svh-164px)] flex-col items-center justify-center bg-background p-6 md:p-10">
      {/* Fixed Logo */}
      <div className="fixed top-2 left-4 w-[186px] h-[81px]">
        <img
          src="/ByteNotesLogo.png"
          className="w-full h-full object-contain"
          alt="Byte Notes Logo"
        />
      </div>

      {/* Centered Sign-Up Card */}
      <Card className="w-full max-w-md rounded-lg border border-border bg-card/80 backdrop-blur-md p-6 shadow-lg">
        <div className="mb-4 space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and email preferences
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ajay Gandecha"
              required
            />
          </div>

          {/* Username / Handle */}
          <div className="grid gap-2">
            <Label htmlFor="handle">Username</Label>
            <div className="relative">
              <AtSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="handle"
                className="pl-8"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ajay"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ajay@cs.unc.edu"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Repeat password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Repeat your password"
              required
            />
          </div>

          <Button className="w-full bg-blue-400" onClick={editProfile}>
            Sign up
          </Button>
        </div>
      </Card>
    </div>
  );
  ``;
}
