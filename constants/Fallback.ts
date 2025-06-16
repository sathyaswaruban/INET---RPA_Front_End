import { NavigationItem } from "@/types/navigation";

export const FALLBACK_NAV_ITEMS: NavigationItem[] = [
  // Main Navigation Items
  {
    id: "nav-home",
    title: "Home",
    href: "/",
    type: "MAIN",
    order: 1,
    isActive: true,
    isExternal: false,
    roles: ["USER"],
  },
  {
    id: "nav-services",
    title: "Upload",
    href: "/services",
    type: "DROPDOWN",
    order: 2,
    isActive: true,
    isExternal: false,
    roles: ["USER"],
  },

  // ... add other subitems following the same pattern
];
