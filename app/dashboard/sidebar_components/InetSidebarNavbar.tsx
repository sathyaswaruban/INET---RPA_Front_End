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
import LiveClock from "@/components/LiveClock";

export default function InetSidebarNavbar() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";
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
    <div className="sticky top-0 z-50 bg-[var(--card)] border-b border-[var(--border)] p-4 flex flex-wrap items-center justify-between rounded-b-2xl shadow-xl gap-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="flex-1 text-center">
        <span className="font-bold text-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent drop-shadow dark:from-[var(--primary-foreground)] dark:to-[var(--secondary)]">
          I-NET Report Reconciliation
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-[var(--primary)] dark:text-[var(--secondary)]">{greeting} 👋</span>
          {isMounted ? (
            <LiveClock />
          ) : (
            <span className="text-[var(--secondary)]">--:--:-- --</span>
          )}
        </div>
        <Button
          className="border-[var(--primary)] text-[var(--primary)] bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition"
          variant="outline"
          size="icon"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
        <Button
          className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] hover:from-[var(--secondary)] hover:to-[var(--primary)] transition"
          variant="destructive"
          size="icon"
          onClick={handleLogout}
        >
          <LogOut />
        </Button>
      </div>
    </div>
  );
}