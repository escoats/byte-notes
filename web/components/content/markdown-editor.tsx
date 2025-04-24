// Component that displays the markdown editor card

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import Editor from "./rich-text/editor";
import { SupabaseClient } from "@supabase/supabase-js";

export function MarkdownEditor({
  supabase,
  pageId,
  setValue,
  value,
}: {
  supabase: SupabaseClient;
  pageId: string;
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
}) {

  // TODO: configure editor to update with data from supabase
  // Right now the data is fetched & passed in from index.html, but it doesn't seem to be updating to show in the editor
  // Not sure why yet
  return (
    <div className="w-[50%] p-4">
      <Card>
        <CardContent>
          <Editor
            content={value}
            onChange={setValue}
            placeholder="Write your notes here..."
            // readOnly={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
