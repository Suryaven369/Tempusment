"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  BarChart2,
  Settings,
  MessageSquare,
  CreditCard,
  Layout,
  Scissors,
  UserCog,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: Layout,
    href: "/dashboard",
  },
  {
    label: "Clients",
    icon: Users,
    href: "/dashboard/clients",
  },
  {
    label: "Services",
    icon: Scissors,
    href: "/dashboard/services",
  },
  {
    label: "Staff",
    icon: UserCog,
    href: "/dashboard/staff",
  },
  {
    label: "Analytics",
    icon: BarChart2,
    href: "/dashboard/analytics",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/dashboard/messages",
  },
  {
    label: "Payments",
    icon: CreditCard,
    href: "/dashboard/payments",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col bg-card">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <Layout className="h-6 w-6" />
          <span>TempusBook</span>
        </Link>
      </div>
      <div className="flex-1 flex flex-col gap-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
              pathname === route.href ? "bg-accent" : "transparent"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}