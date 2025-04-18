import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/appsidebar"
import { Toaster } from "@/components/ui/sonner"
import { Dispatch, SetStateAction } from "react"

export default function Layout({ children, setActivePageId }: { children: React.ReactNode, setActivePageId: Dispatch<SetStateAction<string>> }) {
  return (
    <SidebarProvider>
      <AppSidebar setActivePageId={setActivePageId}/>
      <main>
        {children}
      </main>
      <Toaster/>
    </SidebarProvider>
  )
}
