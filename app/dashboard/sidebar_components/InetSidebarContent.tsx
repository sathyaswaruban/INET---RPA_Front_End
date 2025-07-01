"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, List, RefreshCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// User type
interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

export default function InetSidebarContent() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUser(response.data.user);
      } catch (error) {
        toast.error("Failed to fetch user data");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const dashboardItems = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      roles: ["ADMIN", "USER"],
    },
    {
      title: "Auto Reconciliation",
      url: "/dashboard/filterFormUpload",
      icon: RefreshCcw,
      roles: ["ADMIN", "USER"],
    },
    {
      title: "History Table",
      url: "/dashboard/historyTable",
      icon: List,
      roles: ["ADMIN"], // only for admin
    },
  ];

  // Wait for user to be fetched
  if (isLoading || !user) return null;

  const filteredItems = dashboardItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-primary">Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const isActive =
                item.url === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <a
                      href={item.url}
                      className="flex items-center gap-2 px-2 py-1 rounded-md duration-200"
                    >
                      <item.icon
                        className={isActive ? "text-black" : "text-muted-foreground"}
                      />
                      <span
                        className={
                          isActive
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
