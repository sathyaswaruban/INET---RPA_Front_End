"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ROUTES } from "@/constants/enumdata";
import { useEffect, useState } from "react";
import { FALLBACK_NAV_ITEMS } from "@/constants/Fallback";
import { NavData, NavigationItem } from "@/types/navigation";
import { getNavigationItems } from "@/lib/api/navigation";
import { cacheNavItems, getCachedNavItems } from "@/utils/navcache";

interface NavigationProps {
  pathname: string;
  items: NavigationItem[];
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [navData, setNavData] = useState<NavData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavData = async () => {
      setLoading(true);
      try {
        const cached = getCachedNavItems();
        if (cached) {
          setNavData(cached);
          return;
        }

        const response = await getNavigationItems();
        const navItems = response?.data;

        if (navItems && navItems.length > 0) {
          setNavData(navItems);
          cacheNavItems(navItems);
        } else {
          setNavData(FALLBACK_NAV_ITEMS);
        }
      } catch (err) {
        console.error("Error fetching navigation:", err);
        setNavData(FALLBACK_NAV_ITEMS);
      } finally {
        setLoading(false);
      }
    };

    fetchNavData();
  }, []);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-2 mx-auto flex h-16 items-center justify-between">
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-2 mx-auto flex h-16 items-center justify-between">
        {/* Mobile Nav Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <MobileNav pathname={pathname} items={navData!} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="inline-block font-bold text-lg md:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">INET</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <DesktopNav pathname={pathname} items={navData!} />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="secondary" asChild>
            <Link href={ROUTES.LOGIN}>Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ✅ Mobile Navigation
const MobileNav = ({ pathname, items }: NavigationProps) => {
  const mainNavItems = items?.filter((item) => !item.parentId);

  const childItemsMap = items.reduce((acc, item) => {
    if (item.parentId) {
      if (!acc[item.parentId]) acc[item.parentId] = [];
      acc[item.parentId].push(item);
    }
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <nav className="flex flex-col gap-4 pt-6">
      {mainNavItems.map((item) => (
        <div key={item.id}>
          <Link href={item.href} className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
            {item.title}
          </Link>

          {childItemsMap[item.id] && (
            <div className="ml-4 mt-2 space-y-2">
              {childItemsMap[item.id].map((child) => (
                <Link key={child.id} href={child.href} className={`block px-4 py-1 text-sm transition-colors hover:text-primary ${pathname === child.href ? "text-primary" : "text-muted-foreground"}`}>
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

// ✅ Desktop Navigation
const DesktopNav = ({ pathname, items }: NavigationProps) => {
  // Get main navigation items (no parentId or type is DROPDOWN)
  const mainNavItems = items.filter((item) => !item.parentId || item.type === "DROPDOWN");

  // Group child items by parent
  const childItemsMap = items.reduce((acc, item) => {
    if (item.parentId && item.type === "MAIN") {
      if (!acc[item.parentId]) acc[item.parentId] = [];
      acc[item.parentId].push(item);
    }
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {mainNavItems.map((item) => {
          const hasChildren = childItemsMap[item.id]?.length > 0;
          const isDropdownParent = item.type === "DROPDOWN";

          return isDropdownParent ? (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuTrigger className="bg-transparent hover:bg-accent">{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-card">
                <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                  {childItemsMap[item.id]?.map((child) => (
                    <li key={child.id}>
                      <Link href={child.href} passHref>
                        <NavigationMenuLink
                          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
                            pathname === child.href ? "bg-accent" : ""
                          }`}
                        >
                          <div className="text-sm font-medium">{child.title}</div>
                          {child.description && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{child.description}</p>}
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.id}>
              <Link href={item.href} passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-accent ${pathname === item.href ? "text-primary" : ""}`}>{item.title}</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
