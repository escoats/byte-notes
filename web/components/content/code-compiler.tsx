// Component that displays the code compiler card
import { Dispatch, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import sdk, { ProjectFiles, VM } from "@stackblitz/sdk";
import React, { useEffect } from "react";
import { createSupabaseComponentClient } from "@/utils/supabase/component";

type CodeCompilerProps = {
  pageId: string;
  theme: "dark" | "light";
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

      if (!data?.code_content) {
        console.log("No code content");
        // setFiles(null);
        return;
      }
      console.log("setting files!");
      setFiles(data.code_content);
    }

    fetchFiles();
  }, [pageId, theme]);

  useEffect(() => {
    // console.log("FILES?");
    // console.log(files);
    // if (!files) return;

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
          theme: `${theme}`,
        }
      );

      vmRef.current = vm;

      // 👇 listen for file changes inside the VM
    }
    init();
  }, [files]);

  return (
    <div className="w-[50%] px-6 py-4">
      <Card className="w-full max-w-5xl mx-auto h-[80.5%]">
        <div id="embed" className="h-full w-full" />
      </Card>
    </div>
  );
}
