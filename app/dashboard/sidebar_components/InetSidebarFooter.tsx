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
        // console.log('response', response);
        // console.log('response.data', response?.data);
        // console.log('response.data.user', response?.data?.user);
        setUser(response?.data?.user)
        // console.log(user);

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
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          {user &&
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <p>{ }</p>

                <DropdownMenuItem>
                  <span> {user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span> {user?.role}</span>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          }
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
