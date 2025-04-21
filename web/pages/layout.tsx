import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Dispatch, SetStateAction } from "react";

export default function Layout({
  children,
  setActivePageId,
}: {
  children: React.ReactNode;
  setActivePageId: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex h-[calc(100vh-175px)]">
      <SidebarProvider>
        <AppSidebar setActivePageId={setActivePageId} />
        <main className="flex-1 flex">{children}</main>
        <Toaster />
      </SidebarProvider>
    </div>
  );
}
