// Component that displays the code compiler card
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import sdk from "@stackblitz/sdk";
import React, { useEffect } from "react";
import { createSupabaseComponentClient } from "@/utils/supabase/component";

type CodeCompilerProps = {
  pageId: string;
  theme: "dark" | "light";
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

export function CodeCompiler({ pageId, theme }: CodeCompilerProps) {
  const supabase = createSupabaseComponentClient();
  const [files, setFiles] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const container = document.getElementById("embed");
    if (container) container.innerHTML = "";

    async function fetchFiles() {
      const { data, error } = await supabase
        .from("page")
        .select("code_content")
        .eq("id", pageId)
        .single();

      if (error || !data?.code_content) {
        console.error("Error fetching code_content:", error);
        return;
      }

      setFiles(data.code_content);
    }

    fetchFiles();
  }, [pageId, theme]);

  useEffect(() => {
    if (!files) return;

    sdk.embedProject(
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
  }, [files]);

  return (
    <div className="w-[50%] px-6 py-4">
      <Card className="w-full max-w-5xl mx-auto h-[80.5%]">
        <div id="embed" className="h-full w-full" />
      </Card>
    </div>
  );
}
