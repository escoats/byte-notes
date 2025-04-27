import { CodeCompiler } from "@/components/content/code-compiler";
import { MarkdownEditor } from "@/components/content/markdown-editor";
import Viewer from "@/components/content/rich-text/viewer";
import Profile from "@/components/profile";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { getPageHierarchyById } from "@/utils/find-page-hierarchy";
import { createSupabaseComponentClient } from "@/utils/supabase/component";
import {
  getNotebookTreeByUser,
  getProfileData,
} from "@/utils/supabase/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import router from "next/router";
import { useState, useEffect, SetStateAction } from "react";

export default function PublishedPage() {
  const pathname = usePathname();
  const pageId = pathname?.slice(1);
  const supabase = createSupabaseComponentClient();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  // PROFILE
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

  // Logs the user out and routes back to the login page
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert("Failed to sign out: " + error.message);
    }
    router.push("/login");
  };

  // PAGE FILE PATH
  // get page's notebook and chapter hierarchy
  const { data: notebookTree } = useQuery({
    queryKey: ["notebook_tree"],
    enabled: !!profileData?.id,
    queryFn: async () => await getNotebookTreeByUser(supabase, profileData!.id),
  });
  console.log(notebookTree);

  // fetch header path for published page
  const [headerPath, setHeaderPath] = useState("");
  useEffect(() => {
    if (pageId !== "" && notebookTree !== undefined) {
      const pageInfo = getPageHierarchyById({
        notebookTree: notebookTree,
        pageId: pageId,
      });
      setHeaderPath(`${pageInfo?.page.name} (Published)`);
      console.log(pageInfo);
    }
    console.log(headerPath);
  }, [pageId]);

  // MARKDOWN EDITOR (NON-EDITABLE)
  // useState for markdown editor data
  const [markdownEditorValue, setMarkdownEditorValue] = useState("");

  // Fetch markdown text
  const fetchMarkdownText = async () => {
    const { data, error } = await supabase
      .from("page")
      .select("markdown")
      .eq("id", pageId)
      .single();

    if (!error && data?.markdown) {
      setMarkdownEditorValue(data.markdown);
    } else if (!error) {
      setMarkdownEditorValue("");
    }
  };

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
            <Button variant="ghost" className="p-0 m-0 hover:bg-transparent">
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
                await queryClient.refetchQueries({
                  queryKey: ["userprofile"],
                })
              }
            />
          </div>
        </header>
        {/* Subheader */}
        {pageId && markdownEditorValue !== "" && (
          <div className="relative flex items-center h-[60px] px-6 border-b border-border bg-sidebar">
            {/* Centered text */}
            <p className="text-sm absolute left-1/2 -translate-x-1/2 text-center">
              {headerPath}
            </p>
          </div>
        )}
        {/* Content Layout */}
        <Layout>
          {pageId !== "" ? (
            <>
              {/* WIP Markdown Editor - Not View Only Yet */}
              <Viewer content={markdownEditorValue} style="prose" />
              {/* <CodeCompiler /> */}
            </>
          ) : (
            <p>This is a published page!</p>
          )}
        </Layout>
      </div>
    </ThemeProvider>
  );
}
