"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SidebarHeaderLogo from "./SidebarHeaderLogo";
import InetSidebarFooter from "./InetSidebarFooter";
import InetSidebarHeader from "./InetSidebarHeader";
import InetSidebarContent from "./InetSidebarContent";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <InetSidebarHeader></InetSidebarHeader>
      <InetSidebarContent></InetSidebarContent>
      <InetSidebarFooter></InetSidebarFooter>
    </Sidebar>
  );
}
