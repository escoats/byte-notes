import {
  Dialog,
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
    }
  })
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between h-[115px] px-6 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <img
            src="/ByteNotesLogo.png"
            alt="Byte Notes"
            className="w-[186px] h-[81px]"
          />
        </div>
        {/* Profile */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-3 rounded-md px-3 py-1.5 h-14 w-40">
              <div className="text-right leading-tight">
                <p className="text-sm font-medium">{profileData && profileData.display_name}</p>{" "}
                {/* TODO: update to be dynamic */}
                <p className="text-xs text-muted-foreground">{profileData && profileData.email}</p>{" "}
                {/* TODO: update to be dynamic */}
              </div>
              <Avatar className="h-9 w-9">
                <AvatarImage src="/ajay.png" alt="@ajay" />{" "}
                {/* TODO: update to be dynamic */}
                <AvatarFallback>{profileData && profileData.display_name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
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
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-400 align-content-start">
                Sign out
              </Button>
              <Button type="submit" className="bg-blue-400">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
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
