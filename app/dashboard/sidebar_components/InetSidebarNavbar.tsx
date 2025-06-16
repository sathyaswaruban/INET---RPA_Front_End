"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { LogOut } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the clock with no SSR
const Clock = dynamic(
  () => import('react-live-clock'),
  {
    ssr: false,
    loading: () => <span className="text-secondary">--:--:-- --</span>
  }
);

export default function InetSidebarNavbar() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      if (response.data.success) {
        toast.success("Logged out successfully");
      }
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="sticky top-0 z-50 bg-background border-b border-border/40 p-4 flex items-center justify-between">
      <SidebarTrigger />

      <div className="flex justify-between gap-2 items-center">
        <div className="flex mr-3 items-center gap-2 text-sm font-medium">
          <span className="text-primary">{greeting} 👋</span>
          {isMounted ? (
            <Clock
              format={'hh:mm:ss a'}
              ticking={true}
              timezone={'Asia/Kolkata'}
            />
          ) : (
            <span className="text-secondary">--:--:-- --</span>
          )}
        </div>
        <Button className="mr-3" variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
        <Button className="mr-5" variant="destructive" size="icon" onClick={handleLogout}>
          <LogOut />
        </Button>
      </div>
    </div>
  );
}