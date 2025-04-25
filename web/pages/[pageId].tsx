import { CodeCompiler } from "@/components/content/code-compiler";
import { MarkdownEditor } from "@/components/content/markdown-editor";
import { NoActivePage } from "@/components/content/no-active-page";
import Profile from "@/components/profile";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { createSupabaseComponentClient } from "@/utils/supabase/component";
import { getProfileData } from "@/utils/supabase/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import router from "next/router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function PublishedPage() {
  const pathname = usePathname();
  const pageId = pathname?.slice(1);
  const supabase = createSupabaseComponentClient();
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
            <ThemeToggle />
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
        {/* Content Layout */}
        <Layout>
          {pageId !== "" ? (
            <>
              {/* WIP Markdown Editor - Not View Only */}
              {
                <MarkdownEditor
                  value={markdownEditorValue}
                  setValue={setMarkdownEditorValue}
                />
              }
              {CodeCompiler(pageId)}
            </>
          ) : (
            <NoActivePage />
          )}
        </Layout>
      </div>
    </ThemeProvider>
  );
}

/* 
<p>This is a published page!</p>
{pathname && <p>page path: {pathname}</p>}
{pageId && <p>page id: {pageId}</p>}
*/
