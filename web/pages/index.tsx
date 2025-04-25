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
import { SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SupabaseClient } from "@supabase/supabase-js";
import { MarkdownEditor } from "@/components/content/markdown-editor";
import { NoActivePage } from "@/components/content/no-active-page";
import Link from "next/link";
import { getPageHierarchyById } from "@/utils/find-page-hierarchy";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/theme/theme-toggle";
import Profile from "@/components/profile";
import { CodeCompiler } from "@/components/content/code-compiler";

export default function HomePage() {
  // Create necessary hooks for clients and providers.
  const supabase = createSupabaseComponentClient();
  const router = useRouter();

  // Fetch user profile data to display in the header
  const { data: profileData } = useQuery({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data) return null;
      return await getProfileData(supabase, data.user!.id);
    },
  });

  // Get user's notebook + chapter + page tree
  const { data: notebookTree } = useQuery({
    queryKey: ["notebook_tree"],
    enabled: !!profileData?.id,
    queryFn: async () => await getNotebookTreeByUser(supabase, profileData!.id),
  });

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

  // TODO: Implement save for Stackblitz editor
  async function handleSave(): Promise<void> {
    const { error: updateMarkdownError } = await supabase
      .from("page")
      .update({ markdown: markdownEditorValue })
      .eq("id", activePageId);

    if (!updateMarkdownError) {
      toast("Page saved successfully!");
    } else {
      toast("Failed to save: " + updateMarkdownError.message);
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
            <ThemeToggle />
            {/* Profile */}
            <Profile
              profileData={profileData}
              supabase={supabase}
              onSignOut={handleSignOut}
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
              {
                <MarkdownEditor
                  value={markdownEditorValue}
                  setValue={setMarkdownEditorValue}
                />
              }
              {CodeCompiler(activePageId)}
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
