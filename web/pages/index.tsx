import { Button } from "@/components/ui/button";
import { GetServerSidePropsContext } from "next";
import { createSupabaseServerClient } from "@/utils/supabase/server-props";
import { createSupabaseComponentClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotebookTreeByUser,
  getProfileData,
} from "@/utils/supabase/queries";
import { Globe, Save, Send } from "lucide-react";
import Layout from "./layout";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SupabaseClient } from "@supabase/supabase-js";
import { MarkdownEditor } from "@/components/content/markdown-editor";
import { NoActivePage } from "@/components/content/no-active-page";
import { getPageHierarchyById } from "@/utils/find-page-hierarchy";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/theme/theme-toggle";
import Profile from "@/components/profile";
import { CodeCompiler } from "@/components/content/code-compiler";
import { ProjectFiles, VM } from "@stackblitz/sdk";

export default function HomePage() {
  // Create necessary hooks for clients and providers.
  const supabase = createSupabaseComponentClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Handle opening a page from the sidebar
  const [activePageId, setActivePageId] = useState("");

  // Update header whenever the active page changes
  const [headerPath, setHeaderPath] = useState("");

  // Copies link to clipboard and displays toast when user clicks Send button
  function sendLink(): void {
    if (activePageId !== "") {
      navigator.clipboard.writeText(
        `${window.location.origin}/${activePageId}`
      );
      toast("Link copied to clipboard!");
    } else {
      toast("Please select the page you'd like to send using the sidebar!");
    }
  }

  // Clicking this button navigates the user to view-only published note page
  function handlePublish(): void {
    if (activePageId !== "") {
      router.push(`/${activePageId}`, undefined, { shallow: true });
    } else {
      toast("Please select the page you'd like to publish using the sidebar!");
    }
  }

  // Placeholder files for code editor state variable before files are fetched from supabase
  const starterFiles = {
    "index.ts": 'console.log("Welcome to your new project!")',
    "index.html": "<h1>Welcome</h1>",
  };
  const [files, setFiles] = useState<ProjectFiles>(starterFiles);
  const vmRef = useRef<any>(null);

  async function handleSave(): Promise<void> {
    const { error: updateError } = await supabase
      .from("page")
      .update({ markdown: markdownEditorValue })
      .eq("id", activePageId);

    if (!updateError) {
      toast("Page saved successfully!");
    } else {
      toast("Failed to save: " + updateError.message);
    }

    if (vmRef.current) {
      const snapshot = await vmRef.current.getFsSnapshot();
      if (snapshot) setFiles(snapshot);

      const { error: codeSaveError } = await supabase
        .from("page")
        .update({ code_content: files })
        .eq("id", activePageId);

      if (!codeSaveError) {
        toast("Code saved successfully!");
      } else {
        toast("Failed to save code content: " + codeSaveError.message);
      }
    }
  }

  useEffect(() => {
    if (activePageId !== "" && notebookTree !== undefined) {
      const pageInfo = getPageHierarchyById({
        notebookTree: notebookTree,
        pageId: activePageId,
      });
      setHeaderPath(
        `${pageInfo?.notebook.name} / ${pageInfo?.chapter.name} / ${pageInfo?.page.name}`
      );
    }
  }, [activePageId]);

  // useState for markdown editor data
  const [markdownEditorValue, setMarkdownEditorValue] = useState("");

  // Log markdown editor value for testing/dev purposes - delete later!
  useEffect(() => {
    console.log(markdownEditorValue);
  }, [markdownEditorValue]);

  // Fetch markdown text
  const fetchMarkdownText = async () => {
    const { data, error } = await supabase
      .from("page")
      .select("markdown")
      .eq("id", activePageId)
      .single();

    if (!error && data?.markdown) {
      setMarkdownEditorValue(data.markdown);
    } else if (!error) {
      setMarkdownEditorValue("");
    }
  };

  // Fetch new markdown text when active page changes
  useEffect(() => {
    if (activePageId !== "") {
      fetchMarkdownText();
    } else {
      setMarkdownEditorValue("");
    }
  }, [activePageId]);

  // UseState for active code editor files - these are passed into the CodeCompiler

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
        {/* Header */}
        <header className="flex items-center h-[115px] px-6 border-b border-border bg-sidebar justify-between">
          {/* Logo */}
          <div className="flex justify-center mr-2.5 -mt-0.5">
            <Button
              variant="ghost"
              className="p-0 m-0 hover:bg-transparent"
              onClick={() => setActivePageId("")}
            >
              <img
                src="/ByteNotesLogo.png"
                alt="Byte Notes"
                className="w-[186px] h-[181px]"
              />
            </Button>
          </div>
          <div className="flex flex-row items-center gap-x-3">
            {/* Theme Toggle */}
            <ThemeToggle theme={theme} setTheme={setTheme} />
            {/* Profile */}
            <Profile
              profileData={profileData}
              supabase={supabase}
              onSignOut={handleSignOut}
              onProfileUpdate={async () =>
                await queryClient.refetchQueries({ queryKey: ["userprofile"] })
              }
            />
          </div>
        </header>

        {/* Subheader */}
        {activePageId !== "" && (
          <div className="relative flex items-center h-[60px] px-6 border-b border-border bg-sidebar">
            {/* Centered text */}
            <p className="text-sm absolute left-1/2 -translate-x-1/2 text-center">
              {headerPath}
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
        )}

        {/* Content Layout */}
        <Layout activePageId={activePageId} setActivePageId={setActivePageId}>
          {activePageId !== "" ? (
            <>
              {activePageId !== "" ? (
                <>
                  {
                    <MarkdownEditor
                      value={markdownEditorValue}
                      setValue={setMarkdownEditorValue}
                    />
                  }
                  <CodeCompiler
                    key={resolvedTheme}
                    pageId={activePageId}
                    theme={theme}
                    files={files}
                    setFiles={setFiles}
                    vmRef={vmRef}
                  />
                </>
              ) : (
                <NoActivePage />
              )}
            </>
          ) : (
            <NoActivePage />
          )}
        </Layout>
      </div>
    </ThemeProvider>
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
