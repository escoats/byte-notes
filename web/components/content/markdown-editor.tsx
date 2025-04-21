// Component that displays the markdown editor card

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

export function MarkdownEditor(pageId: string) {
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
        <CardHeader>
          <div className="flex justify-">
            <Button variant="ghost">Edit</Button>
            <Button variant="ghost">Preview</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            This is a placeholder Markdown editor view for the page with ID{" "}
            {pageId}!
          </p>
          <p>Editing functionality & styling coming in Sprint 2!</p>
        </CardContent>
      </Card>
    </div>
  );
}
