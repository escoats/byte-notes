// Component that displays the code compiler card

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import sdk from "@stackblitz/sdk";
import React, { useEffect } from "react";

type CodeCompilerProps = {
  pageId: string;
};

export function CodeCompiler({ pageId }: CodeCompilerProps) {
  useEffect(() => {
    async function start() {
      // Embed the project once the component is mounted and DOM is ready
      // TODO: 'css-custom-prop-color-values' should be pageId variable that can be passed in for the associated StackBlitz editor
      const vm = await sdk.embedProjectId(
        "embed",
        "css-custom-prop-color-values",
        {
          clickToLoad: false,
          openFile: "index.ts",
        }
      );
      // Optional: modify the virtual file system
      const deps = await vm.getDependencies();
      await vm.applyFsDiff({
        create: {
          "hello.txt": "Hello, this is a new file!",
          "deps.txt": JSON.stringify(deps, null, 2),
        },
        destroy: [],
      });
    }

    start();
  }, [pageId]);

  return (
    <div className="w-[50%] px-6 py-4">
      <Card className="w-full max-w-5xl mx-auto h-[80.5%]">
        <div id="embed" className="h-full w-full" />
      </Card>
    </div>
  );
}
