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
import { Home, List, RefreshCcw,Users } from "lucide-react";
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
      title: "IHUB User Details",
      url: "/dashboard/ihubuserdetails",
      icon: Users,
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
    <SidebarContent className="bg-[var(--card)] text-[var(--card-foreground)] border-r border-[var(--border)] shadow-xl rounded-b-2xl">
      <SidebarGroup>
        <SidebarGroupLabel className="text-[var(--primary)] font-bold tracking-wide">
          Dashboard
        </SidebarGroupLabel>
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
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg duration-200 transition
                        ${
                          isActive
                            ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] shadow font-bold"
                            : "hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                        }
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-[var(--primary-foreground)]"
                            : "text-[var(--muted-foreground)]"
                        }`}
                      />
                      <span
                        className={`${
                          isActive
                            ? "text-[var(--primary-foreground)] font-bold"
                            : "text-[var(--muted-foreground)]"
                        }`}
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
