'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import axios from "axios";
import { ChevronUp, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

export default function InetSidebarFooter() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUser(response?.data?.user)
      } catch (error) {
        toast.error("Failed to fetch user data");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return (
    <SidebarFooter className="bg-[var(--card)] border-t border-[var(--border)] rounded-b-2xl shadow-md">
      <SidebarMenu>
        <SidebarMenuItem>
          {user &&
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] font-bold hover:from-[var(--secondary)] hover:to-[var(--primary)] transition">
                  <User2 className="w-5 h-5" /> {user?.name}
                  <ChevronUp className="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg text-[var(--card-foreground)]">
                <DropdownMenuItem className="text-xs font-medium text-[var(--primary)]">
                  <span>{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-medium text-[var(--secondary)]">
                  <span>{user?.role}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
