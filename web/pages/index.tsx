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
import {
  getNotebookTreeByUser,
  getProfileData,
} from "@/utils/supabase/queries";
import { FilePen, Globe, Save, Send } from "lucide-react";
import Layout from "./layout";
import { userAgent } from "next/server";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SupabaseClient } from "@supabase/supabase-js";

export default function HomePage() {
  // Create necessary hooks for clients and providers.
  const supabase = createSupabaseComponentClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch user profile data to display in the header
  const { data: profileData } = useQuery({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data) return null;
      return await getProfileData(supabase, data.user!.id);
    },
  });

  // Sets profile data to be empty initally

  const [displayName, setDisplayName] = useState("");

  // As soon as the profile data loads, pre-fill the inputs and populate isEditingDisplay
  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.display_name || "");
    }
  }, [profileData]);

  // Updates the database when the user changes their display name or avatar
  const handleUpdateProfile = async () => {
    if (!profileData) return;

    let changed = false;

    // Upload avatar if a new file was selected
    if (selectedFile) {
      try {
        await updateProfilePicture(supabase, profileData.id, selectedFile);
        toast.success("Profile photo updated!");
        setSelectedFile(null);
        changed = true;
      } catch (error: any) {
        toast.error(`Failed to update profile photo: ${error.message}`);
      }
    }

    // Update display name if changed
    if (displayName !== profileData.display_name) {
      const { error: profileError } = await supabase
        .from("profile")
        .update({ display_name: displayName })
        .eq("id", profileData.id);

      if (profileError) {
        toast.error(`Error changing display name: ${profileError.message}`);
        return;
      }

      toast.success("Display name successfully changed!");
      changed = true;
    }

    // Refresh profile if something changed
    if (changed) {
      await queryClient.refetchQueries({ queryKey: ["user_profile"] });
    }
  };

  // Get user's notebook + chapter + page tree
  const { data: notebookTree } = useQuery({
    queryKey: ["notebook_tree"],
    enabled: !!profileData?.id,
    queryFn: async () => await getNotebookTreeByUser(supabase, profileData!.id),
  });

  const updateProfilePicture = async (
    supabase: SupabaseClient,
    userId: string,
    file: File | null
  ): Promise<void> => {
    if (!file) {
      const { error } = await supabase
        .from("profile")
        .update({ avatar_url: null })
        .eq("id", userId);
      if (error) throw error;
      return;
    }

    // generate a unique filename for the avatar (to store in supabase)
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    const { data: fileData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
      .data.publicUrl;

    const { error: updateError } = await supabase
      .from("profile")
      .update({ avatar_url: filePath })
      .eq("id", userId);

    if (updateError) throw updateError;
  };

  // Logs the user out and routes back to the login page
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert("Failed to sign out: " + error.message);
    }
    router.push("/login");
  };

  // Copies link to clipboard and displays toast when user clicks Send button
  function sendLink(): void {
    // TODO: @escoats update the link copied to be the published page view
    navigator.clipboard.writeText("https://comp426-25s.github.io");
    toast("Link copied to clipboard!");
  }

  // clicking this button should navigate user to view-only published note page
  function handlePublish(): void {
    // TODO: @escoats
    toast("Publish functionality has not been implemented yet.");
  }

  // TODO: Sprint 2
  function handleSave(): void {
    toast("Save functionality has not been implemented yet.");
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center h-[115px] px-6 border-b border-border bg-card justify-between">
        {/* Logo */}
        <div className="flex justify-center mr-2.5 -mt-0.5">
        <img
          src="/ByteNotesLogo.png"
          alt="Byte Notes"
          className="w-[186px] h-[181px]"
        />
      </div>
        {/* Profile */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-3 rounded-md px-3 py-1.5 h-14 justify-start max-w-full overflow-hidden"
              variant="secondary"
            >
              <div className="flex items-center gap-3 max-w-full overflow-hidden">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage
                    src={
                      profileData?.avatar_url
                        ? supabase.storage
                            .from("avatars")
                            .getPublicUrl(profileData.avatar_url).data.publicUrl
                        : ""
                    }
                  />
                  <AvatarFallback>
                    {profileData?.display_name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start leading-tight truncate">
                  <p className="text-sm font-medium truncate">
                    {profileData?.display_name}
                  </p>
                  <p className="text-xs text-secondary-foreground truncate">
                    {profileData?.email}
                  </p>
                </div>
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
                <Label htmlFor="photo" className="text-left">
                  Upload Photo
                </Label>
                {profileData?.id && (
                  <>
                    <Input
                      className="hidden"
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedFile(
                          (e.target.files ?? []).length > 0
                            ? e.target.files![0]
                            : null
                        )
                      }
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-3xs"
                    >
                      {selectedFile ? "Photo Selected" : "Upload"}
                    </Button>
                  </>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="display-name" className="text-left">
                  Display Name
                </Label>
                <Input
                  id="display-name"
                  className="col-span-3"
                  value={displayName}
                  placeholder={profileData?.display_name}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4"></div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" className="bg-blue-400">
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
              <Button
                type="submit"
                className="bg-blue-400"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      {/* Subheader */}
      <div className="relative flex items-center h-[60px] px-6 border-b border-border bg-background">
        {/* Centered text */}
        <p className="absolute left-1/2 -translate-x-1/2 text-center">
          {/* TODO @escoats: update to be dynamic - nothing should be displayed when no note is selected */}
          {/* {notebookTree?.[0]?.name} / {notebookTree?.[0]?.chapter?.[0]?.name} /
          {notebookTree?.[0]?.chapter?.[0]?.page?.[0]?.name} */}
        </p>

        {/* Right-aligned buttons */}
        <div className="ml-auto flex gap-2">
          <Button
            variant="ghost"
            className="flex flex-row items-center gap-1"
            onClick={() => sendLink()}
          >
            <Send />
            Send
          </Button>
          <Button
            variant="ghost"
            className="flex flex-row items-center gap-1"
            onClick={() => handlePublish()}
          >
            <Globe />
            Publish
          </Button>
          <Button
            variant="ghost"
            className="flex flex-row items-center gap-1"
            onClick={() => handleSave()}
          >
            <Save />
            Save
          </Button>
        </div>
      </div>
      <Layout>
        {/* No Note Selected */}
        <div className="flex flex-col items-center justify-center text-center h-screen w-screen">
          {/* TODO @charlottetsui: fix alignment on no notes text */}
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
  // Create the supabase context that works specifically on the server and pass in the context.
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
