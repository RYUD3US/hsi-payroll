"use client";

import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "../settings-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Sheet, SheetContent, SheetTrigger, SheetHeader, 
  SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { navItems } from "./desktop-nav"; // Reuse the nav array

export function MobileNav({ pathname }: { pathname: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
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
            <SheetDescription>Access dashboard sections</SheetDescription>
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

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 cursor-pointer">
              <SettingsMenu /> 
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-200">Theme Settings</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-12"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs font-medium">Logout</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}