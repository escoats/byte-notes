// Component that displays 

import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function MarkdownEditor(pageId: string) {
    // fetch data

    
    return (
        <div>
            <div className="flex flex-row">
                <Button>Edit</Button>
            </div>
            <Card>
                <p>This is a sample notes page!</p>
                <p>Editing functionality coming soon!</p>

            </Card>
        </div>
    )
}