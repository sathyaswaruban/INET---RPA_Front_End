// types/navigation.ts
export type Role = "ADMIN" | "USER" | "HR" | "MARKETING";
export type NavType = "MAIN" | "DROPDOWN" | "FOOTER" | "SOCIAL" | "UTILITY";

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  description?: string;
  type: NavType;
  parentId?: string | null;
  order: number;
  isActive: boolean;
  isExternal: boolean;
  icon?: string;
  roles: Role[];
  createdAt?: Date;
  updatedAt?: Date;
  createdById?: number;
  updatedById?: number | null;
}

export type NavData = NavigationItem[];
