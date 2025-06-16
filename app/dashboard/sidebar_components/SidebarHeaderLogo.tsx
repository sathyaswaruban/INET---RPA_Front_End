"use client";
import React from "react";
import { SidebarHeader as Header, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { ROUTES } from "@/constants/enumdata";
import Image from "next/image";

export const SidebarHeaderLogo = () => {
  const { open } = useSidebar(); // Sidebar state

  return (
    <Header className="border-b mb-2 border-border/40 h-[58px] flex items-center justify-center transition-all duration-300">
      <Link href={ROUTES.DASHBOARD} className="block">
        <div className={`transition-all duration-300 ease-in-out flex items-center justify-center ${open ? "w-32" : "w-10"}`}>
          <Image src="/images/inet/inetlogo.png" alt="inetlogo" width={open ? 128 : 40} height={open ? 32 : 32} className="transition-all duration-300 ease-in-out object-contain" />
        </div>
      </Link>
    </Header>
  );
};

export default SidebarHeaderLogo;
