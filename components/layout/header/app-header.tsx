"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Wallet, Users, FileText, User, 
  ChevronDown, Clock, Menu, ChevronLeft, ChevronRight,
  LogOut, Settings, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "../settings-menu"; 
import { useSettingsStore } from "@/stores/settings-store";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { NavHoverContent } from "./nav-hover-content";
import { createClient } from "@/lib/supabase/client"; // Ensure this path is correct based on your lib structure
import { 
  Sheet, SheetContent, SheetTrigger, SheetHeader, 
  SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader({ employees = [] }: { employees?: any[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { browserNavButtonsEnabled } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  // Prevents Hydration Mismatch Errors
  useEffect(() => { setMounted(true); }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/payroll", label: "Payroll", icon: Wallet },
    { href: "/timesheets", label: "Timesheets", icon: Clock },
    { href: "/people", label: "People", icon: Users },
    { href: "/reports", label: "Reports", icon: FileText },
  ] as const;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!mounted) return <header className="h-14 w-full border-b border-zinc-800 bg-zinc-950" />;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 flex h-14 items-center justify-between">
        
        <div className="flex items-center gap-4">
          {/* MOBILE MENU (Burger) */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-zinc-950 border-zinc-800 p-0 w-72 flex flex-col">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>Access dashboard sections and system settings</SheetDescription>
                </SheetHeader>

                <div className="p-6 border-b border-zinc-800">
                  <span className="font-bold text-zinc-50 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] font-bold">LOGO</div>
                    HSI Payroll
                  </span>
                </div>
                
                <nav className="flex-1 flex flex-col gap-1 p-4">
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}>
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "w-full justify-start gap-3 text-zinc-400", 
                          pathname.startsWith(href) && "bg-zinc-800 text-zinc-50"
                        )}
                      >
                        <Icon className="h-4 w-4" /> {label}
                      </Button>
                    </Link>
                  ))}
                </nav>

                {/* MOBILE SETTINGS SECTION */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 space-y-2">
                  <h4 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">System</h4>
                  
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer group">
                    <div className="flex-shrink-0">
                      <SettingsMenu /> 
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-zinc-200">Theme Settings</span>
                      <span className="text-[10px] text-zinc-500">Toggle dark/light mode</span>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-12"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium">Logout</span>
                      <span className="text-[10px] text-red-500/60">End current session</span>
                    </div>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* LOGO */}
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-zinc-50 mr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 font-bold">LOGO</div>
            <span className="text-lg tracking-tight hidden sm:inline-block">HSI Payroll</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <HoverCard key={href} openDelay={150} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Link href={href}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "gap-2 text-zinc-400 transition-colors duration-200", 
                        pathname.startsWith(href) && "bg-zinc-800 text-zinc-50"
                      )}
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent 
                  align="start" 
                  sideOffset={10} 
                  className="w-auto p-0 bg-zinc-950 border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300"
                >
                  <NavHoverContent label={label} employees={employees} />
                </HoverCardContent>
              </HoverCard>
            ))}
          </nav>
        </div>

        {/* SETTINGS & PROFILE (Desktop) */}
        <div className="flex items-center gap-2">
          {browserNavButtonsEnabled && (
            <div className="hidden xl:flex items-center gap-1 mr-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 text-zinc-400 hover:text-zinc-50 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.forward()} className="h-8 w-8 text-zinc-400 hover:text-zinc-50 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="hidden lg:block">
            <SettingsMenu />
          </div>

          {/* DESKTOP ACCOUNT DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-1.5 hover:bg-zinc-900 cursor-pointer group transition-all">
                <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-zinc-500 transition-colors">
                  <User className="h-3 w-3 text-zinc-400 group-hover:text-zinc-200" />
                </div>
                <span className="text-sm text-zinc-400 font-medium hidden lg:inline-block">Admin</span>
                <ChevronDown className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-y-0.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300 shadow-xl">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Access Level</span>
                <div className="flex items-center gap-1.5 text-zinc-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                  Administrator
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="cursor-pointer focus:bg-zinc-900 focus:text-zinc-50">
                <User className="mr-2 h-4 w-4" /> Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-zinc-900 focus:text-zinc-50">
                <Settings className="mr-2 h-4 w-4" /> Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}