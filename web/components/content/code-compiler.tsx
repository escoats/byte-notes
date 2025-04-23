// Component that displays the code compiler card

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import sdk from "@stackblitz/sdk";

// This opens https://stackblitz.com/edit/css-custom-prop-color-values
// in the current window with the Preview pane
function openProject() {
  sdk.openProjectId("css-custom-prop-color-values", {
    newWindow: false,
    view: "preview",
  });
}

//  This replaces the HTML element with
// the id of "embed" with https://stackblitz.com/edit/css-custom-prop-color-values embedded in an iframe.
function embedProject() {
  sdk.embedProjectId("embed", "css-custom-prop-color-values", {
    openFile: "index.ts",
  });
}

export function CodeCompiler(pageId: string) {
  return (
    <div>
      <nav>
        <div id="app">
          <button id="embed" onClick={(embedProject)}>Embed project</button>
        </div>
      </nav>
    </div>
  );
}
