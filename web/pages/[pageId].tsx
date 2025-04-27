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
import { ProjectFiles } from "@stackblitz/sdk";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "./layout";
import { ThemeProvider, useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import router from "next/router";
import { useState, useEffect, SetStateAction, useRef } from "react";
import { toast } from "sonner";

export default function PublishedPage() {
  const pathname = usePathname();
  const pageId = pathname?.slice(1) ?? "";

  const supabase = createSupabaseComponentClient();
  const queryClient = useQueryClient();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [headerPath, setHeaderPath] = useState("");
  const [markdownEditorValue, setMarkdownEditorValue] = useState("");
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const vmRef = useRef<any>(null);
  const [activePageId, setActivePageId] = useState("");

  const { data: profileData } = useQuery({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data) return null;
      return await getProfileData(supabase, data.user!.id);
    },
  });

  const { data: notebookTree } = useQuery({
    queryKey: ["notebook_tree"],
    enabled: !!profileData?.id,
    queryFn: async () => await getNotebookTreeByUser(supabase, profileData!.id),
  });

  useEffect(() => {
    const fetchPageData = async () => {
      if (!pageId) return;

      const { data, error } = await supabase
        .from("page")
        .select("markdown, code_content")
        .eq("id", pageId)
        .single();

      if (error) {
        console.error("Error fetching page:", error);
        return;
      }

      if (data?.markdown) setMarkdownEditorValue(data.markdown);
      if (data?.code_content) setFiles(data.code_content);
    };

    fetchPageData();
  }, [pageId]);

  useEffect(() => {
    if (pageId && notebookTree) {
      const pageInfo = getPageHierarchyById({ notebookTree, pageId });
      setHeaderPath(`${pageInfo?.page.name} (Published)`);
    }
  }, [pageId, notebookTree]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert("Failed to sign out: " + error.message);
    }
    router.push("/login");
  };

  if (!pageId || !markdownEditorValue || !files) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p>Loading published note...</p>
      </div>
    );
  }

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
                await queryClient.refetchQueries({
                  queryKey: ["user_profile"],
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
        <Layout
          activePageId={activePageId}
          setActivePageId={setActivePageId}
          showSidebar={false}
        >
          <Viewer content={markdownEditorValue} style="prose" />
          <CodeCompiler
            key={resolvedTheme}
            pageId={pageId}
            theme={theme}
            files={files}
            setFiles={setFiles}
            vmRef={vmRef}
          />
        </Layout>
      </div>
    </ThemeProvider>
  );
}
