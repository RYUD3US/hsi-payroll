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
  Menu,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "./settings-menu";
import { useSettingsStore } from "@/stores/settings-store";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose // Added to close menu when clicking links
} from "@/components/ui/sheet";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* Burger Menu for Tablet & Mobile */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-zinc-400">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-zinc-950 border-zinc-800 flex flex-col p-0 w-[300px]">
                  <div className="p-6 flex flex-col h-full">
                    <SheetHeader className="text-left border-b border-zinc-800 pb-4 mb-4">
                      <SheetTitle className="text-zinc-50 flex items-center gap-2">
                         <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px]">LOGO</div>
                         Salmon Project
                      </SheetTitle>
                    </SheetHeader>
                    
                    <nav className="flex flex-col gap-2 flex-1">
                      {navItems.map(({ href, label, icon: Icon }) => (
                        <SheetClose asChild key={href}>
                          <Link href={href}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-3 text-zinc-400 h-11",
                                pathname.startsWith(href) && "bg-zinc-800 text-zinc-50"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              {label}
                            </Button>
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>

                    {/* REFIXED SETTINGS: Render the actual SettingsMenu component 
                        so it keeps its dropdown/modal logic inside the sidebar */}
                    <div className="border-t border-zinc-800 pt-4 mt-auto">
                       <div className="flex items-center gap-2 px-2 py-4">
                          <SettingsMenu />
                          <span className="text-sm text-zinc-400 font-medium">App Settings</span>
                       </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo Section */}
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-zinc-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
                <span className="text-[10px] text-zinc-400 font-bold">LOGO</span>
              </div>
              <span className="text-lg tracking-tight hidden sm:inline-block">HSI Payroll</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 text-zinc-400 hover:text-zinc-50 transition-all",
                      (pathname === href || (href !== "/dashboard" && pathname.startsWith(href))) && "bg-zinc-800 text-zinc-50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {browserNavButtonsEnabled && (
              <div className="hidden xl:flex items-center gap-1 mr-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 text-zinc-400 hover:text-zinc-50"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => router.forward()} className="h-8 w-8 text-zinc-400 hover:text-zinc-50"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            )}

            {/* Desktop Settings */}
            <div className="hidden lg:block">
              <SettingsMenu />
            </div>
            
            <div className="flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-1.5 hover:bg-zinc-900 transition-colors cursor-pointer group">
              <User className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
              <span className="text-sm text-zinc-400 font-medium hidden lg:inline-block">Admin</span>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}