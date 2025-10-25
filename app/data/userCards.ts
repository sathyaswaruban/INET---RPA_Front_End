import { Users, UserCog,  User, Users2, UserCheck2, User2Icon } from "lucide-react"; // Lucide icons

export interface UserCard {
  key: string;        // Card title
  value: string;      // URL slug
  apiUrl: string;     // API endpoint
  icon: React.ElementType; // Lucide icon component
  textColor: string;    // Tailwind background color class
}

export const userCards: UserCard[] = [
  {
    key: "I-NET TN Users",
    value: "inet-users",
    apiUrl: "/api/users/inet",
    icon: User,
    textColor: "text-[#FF375F]"
  },
  {
    key: "I-NET UP Users",
    value: "inet-up-users",
    apiUrl: "/api/users/inet-up",
    icon: UserCog,
    textColor: "text-[#5E5CE6]"
  },
  {
    key: "UPe-District Sultanpur PS Users",
    value: "upe-sultanpur-ps-users",
    apiUrl: "/api/users/upe-sultanpur-ps",
    icon: Users,
    textColor: "text-[#FF6482]"
  },
  {
    key: "ITI UP Users",
    value: "iti-up-users",
    apiUrl: "/api/users/iti-up",
    icon: Users2,
    textColor: "text-[#FF9F0A]"
  },
  {
    key: "UPe-District Chitrakoot PS Users",
    value: "upe-chitrakoot-ps-users",
    apiUrl: "/api/users/upe-chitrakoot-ps",
    icon: UserCheck2,
    textColor: "text-[#BF5AF2]"
  },
  {
    key: "I-NET PACCS Users",
    value: "inet-paccs-users",
    apiUrl: "/api/users/inet-paccs",
    icon: User2Icon,
    textColor: "text-[#279989]"
  }
];
