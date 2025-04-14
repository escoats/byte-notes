import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GetServerSidePropsContext } from "next";
import { createSupabaseServerClient } from "@/utils/supabase/server-props";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { createSupabaseComponentClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileData } from "@/utils/supabase/queries";
import { FilePen, Globe, Save, Send } from "lucide-react";
import Layout from "./layout";
import { userAgent } from "next/server";

{
  /* TODO: Need to access user data */
}
export default function HomePage() {
  // Create necessary hooks for clients and providers.
  const supabase = createSupabaseComponentClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch user profile data to display in the header

  const { data: profileData } = useQuery({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data) return null;
      return await getProfileData(supabase, data.user!.id);
    },
  });

  const handleChangeEmail = async () => {};

  // Logs the user out and routes back to the login page
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert("Failed to sign out: " + error.message);
    }
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center h-[115px] px-6 border-b border-border bg-card justify-end">
        {/* Profile */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-3 rounded-md px-3 py-1.5 h-14 w-40 justify-end">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/ajay.png" alt="@ajay" />{" "}
                {/* TODO: update to be dynamic */}
                <AvatarFallback>
                  {profileData && profileData.display_name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start leading-tight">
                <p className="text-sm font-medium">
                  {profileData && profileData.display_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profileData && profileData.email}
                </p>
              </div>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo" className="">
                  Upload photo
                </Label>
                <Input id="photo" type="file" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="display-name" className="text-right">
                  Display Name
                </Label>
                <Input
                  id="display-name"
                  className="col-span-3"
                  value={profileData?.display_name}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={profileData?.email}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="bg-blue-400">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-blue-400 align-content-start"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
              <Button type="submit" className="bg-blue-400">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      {/* Subheader */}
      <div className="relative flex items-center h-[60px] px-6 border-b border-border bg-background">
        {/* Centered text */}
        <p className="absolute left-1/2 -translate-x-1/2 text-center">
          {/* TODO: update to be dynamic */}
          COMP426/Backend/L21-FinalProjects
        </p>

        {/* Right-aligned buttons */}
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" className="flex flex-row items-center gap-1">
            <Send />
            Send
          </Button>
          <Button
            variant="ghost"
            className="flex flex-row items-center gap-1"
            /* onClick={handlePublish(projectId)} */
          >
            <Globe />
            Publish
          </Button>
          <Button variant="ghost" className="flex flex-row items-center gap-1">
            <Save />
            Save
          </Button>
        </div>
      </div>
      <Layout>
        {/* No Note Selected */}
        <div className="flex flex-col items-center justify-center text-center h-screen w-screen">
          {/* TODO: fix alignment on no notes text */}
          <FilePen strokeWidth={1.5} className="h-[90px] w-[90px] m-4" />
          <h1 className="font-bold text-lg mb-1 text-center">
            No Note Selected
          </h1>
          <h2 className="font-bold text-gray-400 text-md max-w-[380px] text-center">
            Select a note from the sidebar or create a new one to get started.
          </h2>
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Create the supabase context that works specifically on the server and
  // pass in the context.
  const supabase = createSupabaseServerClient(context);

  // Attempt to load the user data
  const { data: userData, error: userError } = await supabase.auth.getUser();

  // If the user is not logged in, redirect them to the login page.
  if (userError || !userData) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
