import { FilePen } from "lucide-react";

export function NoActivePage() {
    return (
        <div className="flex flex-col items-center justify-center text-center h-screen w-screen">
            {/* TODO @charlottetsui: fix alignment on no notes text */}
                <FilePen strokeWidth={1.5} className="h-[90px] w-[90px] m-4" />
                <h1 className="font-bold text-lg mb-1 text-center">
                    No Note Selected
                </h1>
                <h2 className="font-bold text-gray-400 text-md max-w-[380px] text-center">
                    Select a note from the sidebar or create a new one to get started.
                </h2>
        </div>
    )
}