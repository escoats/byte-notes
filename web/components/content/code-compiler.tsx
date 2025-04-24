// Component that displays the code compiler card

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import sdk from "@stackblitz/sdk";
import React, { useEffect } from "react";
import { createSupabaseComponentClient } from "@/utils/supabase/component";

type CodeCompilerProps = {
  pageId: string;
};

export function CodeCompiler({ pageId }: CodeCompilerProps) {
  const supabase = createSupabaseComponentClient();
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectId() {
      const { data, error } = await supabase
        .from("page")
        .select("stackblitz_project_id")
        .eq("id", pageId)
        .single();

      if (error) {
        console.error("Error fetching projectId:", error);
        return;
      }

      setProjectId(data.stackblitz_project_id);
    }

    fetchProjectId();
  }, [pageId]);

  useEffect(() => {
    if (!projectId) return;

    async function embedProject() {
      const vm = await sdk.embedProjectId("embed", projectId!, {
        clickToLoad: false,
        openFile: "index.ts",
      });

      const deps = await vm.getDependencies();
      await vm.applyFsDiff({
        create: {
          "hello.txt": "Hello, this is a new file!",
          "deps.txt": JSON.stringify(deps, null, 2),
        },
        destroy: [],
      });
    }

    embedProject();
  }, [projectId]);

  return (
    <div className="w-[50%] px-6 py-4">
      <Card className="w-full max-w-5xl mx-auto h-[80.5%]">
        <div id="embed" className="h-full w-full" />
      </Card>
    </div>
  );
}
