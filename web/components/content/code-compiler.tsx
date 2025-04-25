// Component that displays the code compiler card
import { Dispatch } from "react";
import { Card } from "../ui/card";
import sdk, { ProjectFiles, VM } from "@stackblitz/sdk";
import React, { useEffect } from "react";
import { createSupabaseComponentClient } from "@/utils/supabase/component";

type CodeCompilerProps = {
  pageId: string;
  theme: string | undefined;
  files: ProjectFiles;
  setFiles: Dispatch<ProjectFiles>;
  vmRef: React.RefObject<VM>;
};

// export function CodeCompiler({ pageId, theme }: CodeCompilerProps) {
//   useEffect(() => {
//     const container = document.getElementById("embed");
//     if (container) container.innerHTML = "";

//     sdk.embedProjectId("embed", pageId, {
//       clickToLoad: false,
//       openFile: "index.ts",
//       theme: `${theme}`,
//     });
//   }, [pageId, theme]);

export function CodeCompiler({
  pageId,
  theme,
  files,
  setFiles,
  vmRef,
}: CodeCompilerProps) {
  const supabase = createSupabaseComponentClient();
  // const vmRef = useRef<VM>(null);
  // const [files, setFiles] = useState<Record<string, string> | null>(null);

  const starterFiles = {
    "index.ts": 'console.log("Welcome to your new project!")',
    "index.html": "<h1>Welcome</h1>",
  };
  useEffect(() => {
    const container = document.getElementById("embed");
    if (container) container.innerHTML = "";

    async function fetchFiles() {
      const { data, error } = await supabase
        .from("page")
        .select("code_content")
        .eq("id", pageId)
        .single();

      if (error) {
        console.error("Error fetching code_content:", error);
        return;
      }

      // TODO: if there's no content from supabase, i just manually set the starter files. this is probably
      // not the best thing to do? might cause some issues. but i am not very familiar with stackblitz so
      // hopefully someone else can check on this?
      if (!data?.code_content) {
        console.log("No code content");
        setFiles(starterFiles);
        return;
      }
      console.log("setting files!");
      setFiles(data.code_content);
    }

    fetchFiles();
  }, [pageId, theme]);

  useEffect(() => {
    if (!files || !theme) return;

    async function init() {
      const vm = await sdk.embedProject(
        "embed",
        {
          title: "ByteNotes Project",
          description: "Auto-created per page",
          template: "typescript",
          files,
        },
        {
          clickToLoad: false,
          openFile: "index.ts",
          theme: `${theme === "dark" ? "dark" : "light"}`,
        }
      );

      vmRef.current = vm;
    }
    init();
  }, [pageId, files, theme]);

  return (
    <div className="w-[50%] px-6 py-4">
      <Card className="w-full max-w-5xl mx-auto h-[80.5%]">
        <div id="embed" className="h-full w-full" />
      </Card>
    </div>
  );
}
