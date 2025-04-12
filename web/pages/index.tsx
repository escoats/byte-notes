import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Laugh } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Laugh />
      <SidebarProvider>
        <Sidebar>
          <SidebarContent />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
