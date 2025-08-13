import { Users, UserCog,  User, Users2, UserCheck2, User2Icon } from "lucide-react"; // Lucide icons

export interface UserCard {
  key: string;        // Card title
  value: string;      // URL slug
  apiUrl: string;     // API endpoint
  icon: React.ElementType; // Lucide icon component
  bgColor: string;    // Tailwind background color class
}

export const userCards: UserCard[] = [
  {
    key: "I-NET TN Users",
    value: "inet-users",
    apiUrl: "/api/users/inet",
    icon: User,
    bgColor: "bg-blue-600"
  },
  {
    key: "I-NET UP Users",
    value: "inet-up-users",
    apiUrl: "/api/users/inet-up",
    icon: UserCog,
    bgColor: "bg-green-600"
  },
  {
    key: "UPe-District Sultanpur PS Users",
    value: "upe-sultanpur-ps-users",
    apiUrl: "/api/users/upe-sultanpur-ps",
    icon: Users,
    bgColor: "bg-yellow-500"
  },
  {
    key: "ITI UP Users",
    value: "iti-up-users",
    apiUrl: "/api/users/iti-up",
    icon: Users2,
    bgColor: "bg-purple-600"
  },
  {
    key: "UPe-District Chitrakoot PS Users",
    value: "upe-chitrakoot-ps-users",
    apiUrl: "/api/users/upe-chitrakoot-ps",
    icon: UserCheck2,
    bgColor: "bg-orange-600"
  },
  {
    key: "I-NET PACCS Users",
    value: "inet-paccs-users",
    apiUrl: "/api/users/inet-paccs",
    icon: User2Icon,
    bgColor: "bg-violet-600"
  }
];
