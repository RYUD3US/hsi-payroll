"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Users,
  FileText,
  User,
  ChevronDown,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payroll", label: "Payroll", icon: Wallet },
  { href: "/timesheets", label: "Timesheets", icon: Clock },
  { href: "/people", label: "People", icon: Users },
  { href: "/reports", label: "Reports", icon: FileText },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="flex h-14 items-center gap-6 px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-zinc-50"
        >
          <span className="text-lg tracking-tight">HSI Payroll</span>
        </Link>

        {/* Main nav — no sidebar, all in header */}
        <nav className="flex flex-1 items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 text-zinc-400 hover:text-zinc-50",
                    isActive && "bg-zinc-800 text-zinc-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right: theme toggle + user */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-2 rounded-md border border-zinc-800 px-2 py-1.5">
            <User className="h-4 w-4 text-zinc-500" />
            <span className="text-sm text-zinc-400">Admin</span>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
