// Component that displays the code compiler card

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import sdk from "@stackblitz/sdk";
import React, { useEffect } from "react";

type CodeCompilerProps = {
  pageId: string;
  theme: "dark" | "light";
};

export function CodeCompiler({ pageId, theme }: CodeCompilerProps) {
  useEffect(() => {
    const container = document.getElementById("embed");
    if (container) container.innerHTML = "";

    sdk.embedProjectId("embed", pageId, {
      clickToLoad: false,
      openFile: "index.ts",
      theme: `${theme}`,
    });
  }, [pageId, theme]);

  return (
    <div className="w-[50%] px-6 py-4">
      <Card className="w-full max-w-5xl mx-auto h-[80.5%]">
        <div id="embed" className="h-full w-full" />
      </Card>
    </div>
  );
}
