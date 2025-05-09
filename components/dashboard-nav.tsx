"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, LayoutDashboard } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      exact: true,
    },
    {
      href: "/dashboard/events",
      label: "Events",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      exact: false,
    },
  ];

  return (
    <nav className="hidden w-56 flex-col border-r bg-background p-4 md:flex">
      <div className="space-y-1">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                (route.exact
                  ? pathname === route.href
                  : pathname.startsWith(route.href)) && "bg-muted font-medium"
              )}
            >
              {route.icon}
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
