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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onClose?: () => void;
}

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
    label: "Calender",
    icon: MessageSquare,
    href: "/dashboard/calender",
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

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col bg-card">
      <div className="flex items-center justify-between p-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <Layout className="h-6 w-6" />
          <span>TempusBook</span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1 px-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                pathname === route.href 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}