"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Car,
  ChevronLeft,
  CreditCard,
  Home,
  ImageIcon,
  LayoutDashboard,
  Menu,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen bg-white transition-all duration-300 z-10 border-r",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          {isOpen && (
            <span className="text-lg font-bold text-diplomat-green">
              Diplomat Corner
            </span>
          )}
        </Link>
        <Button variant="ghost" size="icon" onClick={toggle}>
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="space-y-1 py-4 overflow-y-auto h-[calc(100vh-4rem)]">
        <NavItem
          href="/admin/dashboard"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isActive={pathname === "/admin/dashboard"}
          isOpen={isOpen}
        />
        <NavItem
          href="/admin/products"
          icon={<Package className="h-5 w-5" />}
          label="Products"
          isActive={pathname.startsWith("/admin/products")}
          isOpen={isOpen}
        />
        <NavItem
          href="/admin/products/houses"
          icon={<Home className="h-5 w-5" />}
          label="Houses"
          isActive={pathname === "/admin/products/houses"}
          isOpen={isOpen}
          indent
        />
        <NavItem
          href="/admin/products/cars"
          icon={<Car className="h-5 w-5" />}
          label="Cars"
          isActive={pathname === "/admin/products/cars"}
          isOpen={isOpen}
          indent
        />
        <NavItem
          href="/admin/advertisements"
          icon={<ImageIcon className="h-5 w-5" />}
          label="Advertisements"
          isActive={pathname.startsWith("/admin/advertisements")}
          isOpen={isOpen}
        />
        <NavItem
          href="/admin/payments"
          icon={<CreditCard className="h-5 w-5" />}
          label="Payments"
          isActive={pathname === "/admin/payments"}
          isOpen={isOpen}
        />
        <NavItem
          href="/admin/statistics"
          icon={<BarChart3 className="h-5 w-5" />}
          label="Statistics"
          isActive={pathname === "/admin/statistics"}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  indent?: boolean;
}

function NavItem({
  href,
  icon,
  label,
  isActive,
  isOpen,
  indent = false,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 transition-colors",
        isActive
          ? "bg-diplomat-lightGreen text-diplomat-green font-medium"
          : "text-gray-600 hover:bg-gray-100",
        indent && isOpen && "pl-8",
        !isOpen && "justify-center"
      )}
    >
      <span>{icon}</span>
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
