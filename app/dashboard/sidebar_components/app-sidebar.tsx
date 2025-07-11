"use client";

import { Sidebar } from "@/components/ui/sidebar";
import SidebarHeaderLogo from "./SidebarHeaderLogo";
import InetSidebarFooter from "./InetSidebarFooter";
import InetSidebarHeader from "./InetSidebarHeader";
import InetSidebarContent from "./InetSidebarContent";

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-[var(--card)] text-[var(--card-foreground)] border-r border-[var(--border)] shadow-xl rounded-2xl min-h-screen"
    >
      <InetSidebarHeader />
      <InetSidebarContent />
      <InetSidebarFooter />
    </Sidebar>
  );
}
