import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar_components/app-sidebar";
import { cookies } from "next/headers";
import InetSidebarNavbar from "./sidebar_components/InetSidebarNavbar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex bg-background h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content area */}
        <div className="flex flex-col  flex-1 h-full overflow-hidden">
          {/* Sticky Navbar */}
          <div className="sticky top-0 z-50">
            <InetSidebarNavbar />
          </div>

          {/* Scrollable content + footer */}
          <div className="flex-1  overflow-y-auto p-4 flex flex-col">
            <div className="flex-1 container mx-auto">{children}</div>

            {/* Regular Footer (scrolls with content) */}
          </div>
          <footer className="border-t border-border/40  p-4 text-center text-sm text-muted-foreground bg-background">© INET SecureLabs @{new Date().getFullYear()}</footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
