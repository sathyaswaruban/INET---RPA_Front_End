"use client";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import React from "react";
import SidebarHeaderLogo from "./SidebarHeaderLogo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function InetSidebarHeader() {
  const { open } = useSidebar(); // Sidebar state

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarHeaderLogo></SidebarHeaderLogo>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
