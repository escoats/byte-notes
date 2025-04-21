// Component that displays the code compiler card

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

export function CodeCompiler(pageId: string) {
  return (
    <div className="w-[50%] p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-">
            <Button variant="ghost">Edit</Button>
            <Button variant="ghost">Run</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            This is a placeholder Code Compiler view for the page with ID{" "}
            {pageId}!
          </p>
          <p>Editing functionality & styling coming in Sprint 2!</p>
        </CardContent>
      </Card>
    </div>
  );
}
