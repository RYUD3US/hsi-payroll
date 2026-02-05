"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Users,
  FileText,
  User,
  ChevronDown,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "./settings-menu";
import { useSettingsStore } from "@/stores/settings-store";
import { useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payroll", label: "Payroll", icon: Wallet },
  { href: "/timesheets", label: "Timesheets", icon: Clock },
  { href: "/people", label: "People", icon: Users },
  { href: "/reports", label: "Reports", icon: FileText },
] as const;

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { browserNavButtonsEnabled } = useSettingsStore();

  const handleBack = () => {
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-6">
          {/* Browser Navigation Buttons */}
          {browserNavButtonsEnabled && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8 text-zinc-400 hover:text-zinc-50"
                aria-label="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleForward}
                className="h-8 w-8 text-zinc-400 hover:text-zinc-50"
                aria-label="Go forward"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

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

          {/* Right: Settings + user */}
          <div className="flex items-center gap-2">
            <SettingsMenu />
            <div className="flex items-center gap-2 rounded-md border border-zinc-800 px-2 py-1.5">
              <User className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-400">Admin</span>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
