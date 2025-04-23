// Component that displays the code compiler card

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { createSupabaseComponentClient } from "@/utils/supabase/component";

const supabase = createSupabaseComponentClient();

type CodeCompilerProps = {
  activePageId: string;
  defaultLanguage?: string;
};

const languages = [
  "c",
  "c#",
  "go",
  "html",
  "java",
  "javascript",
  "kotlin",
  "python",
  "r",
  "ruby",
  "rust",
  "sql",
  "swift",
  "typescript",
];

export function CodeCompiler({
  activePageId,
  defaultLanguage = "python",
}: CodeCompilerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [language, setLanguage] = useState(defaultLanguage);
  const [initialCode, setInitialCode] = useState<string>("");
  const [currentCode, setCurrentCode] = useState<string>("");

  // TODO: fetch page's code from supabase

  // TODO: populate code compiler with code from supabase

  // TODO: update current code on editor changes (not saved to supabase yet)
  // TODO: could this be used as realtime?

  return (
    <div className="w-[50%] p-4">
      <Card>
        {/* TODO: format so header takes up less of code compiler card */}
        <CardHeader className="text-center">Code Compiler</CardHeader>
        {/* https://onecompiler.com/apis/embed-editor */}
        <iframe
          id="oc-editor"
          ref={iframeRef}
          frameBorder="0"
          height="500px"
          width="100%"
          src={`https://onecompiler.com/embed/${language}?listenToEvents=true&codeChangeEvent=true`}
        ></iframe>
      </Card>
    </div>
  );
}
