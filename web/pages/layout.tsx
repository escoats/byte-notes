import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/appsidebar"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        {children}
      </main>
      <Toaster className=""/>
    </SidebarProvider>
  )
}
