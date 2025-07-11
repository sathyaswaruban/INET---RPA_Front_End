"use client";
import React from "react";
import { SidebarHeader as Header, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { ROUTES } from "@/constants/enumdata";
import Image from "next/image";

export const SidebarHeaderLogo = () => {
  const { open } = useSidebar(); // Sidebar state

  return (
    <Header className="border-b border-[var(--border)] bg-[var(--card)] h-[58px] flex items-center justify-center rounded-t-2xl shadow-md mb-2 transition-all duration-300">
      <Link href={ROUTES.DASHBOARD} className="block">
        <div className={`transition-all duration-300 ease-in-out flex items-center justify-center ${open ? "w-32" : "w-10"}`}>
          <Image src="/images/inet/inetlogo.png" alt="inetlogo" width={open ? 128 : 40} height={open ? 32 : 32} className="transition-all duration-300 ease-in-out object-contain" />
        </div>
      </Link>
    </Header>
  );
};

export default SidebarHeaderLogo;
