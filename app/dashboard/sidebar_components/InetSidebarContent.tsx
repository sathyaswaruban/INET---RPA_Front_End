"use client";

import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { Home, List, RefreshCcw} from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";

export default function InetSidebarContent() {
  const pathname = usePathname();
  //   console.log(pathname, "pathname");
  // Menu items.
  const dashboardItems = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Auto Reconciliation",
      url: "/dashboard/filterFormUpload",
      icon: RefreshCcw,
    },
    {
      title: "History Table",
      url: "/dashboard/historyTable",
      icon: List,
    },


  ];

  // const userItems = [

  //   {
  //     title: "Settings",
  //     url: "/dashboard/settings",
  //     icon: Settings,
  //   },
  // ];

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-primary">Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {dashboardItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.url)}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
