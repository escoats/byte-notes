// Component that displays the markdown editor card

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import Editor from "./rich-text/editor";
import { SupabaseClient } from "@supabase/supabase-js";

export function MarkdownEditor({
  setValue,
  value,
}: {
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
}) {
  return (
    <div className="w-[50%] h-[78%] p-4">
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 overflow-hidden">
          <Editor
            content={value}
            onChange={(updatedContent) => setValue(updatedContent)}
            placeholder="Write your notes here..."
            // readOnly={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
