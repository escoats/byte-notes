// Component that displays the markdown editor card

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import Editor from "./rich-text/editor";

export function MarkdownEditor({
  pageId,
  setValue,
  value,
}: {
  pageId: string;
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
}) {
  // TODO: fetch page contents data

  /**
   * TODO: seems like React requires the same # of hooks to be generated on each re-render.
   * The problem here is that this component is rendered conditionally based on whether or not a page is selected,
   * so any hooks inside this component, or any other components rendered conditionally,
   * will cause this error: "Error: Rendered more hooks than during the previous render"
   * Looking into a workaround, but for now this component is pretty non-functional since it would rely on
   * tracking which view (edit vs. preview) is open, and that needs extra useState handlers.
   */
  return (
    <div className="w-[50%] p-4">
      <Card>
        <CardContent>
          <Editor
            content={value}
            onChange={setValue}
            placeholder="Write your post here..."
            // readOnly={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}