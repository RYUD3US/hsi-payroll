"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { DesktopNav } from "./desktop-nav";
import { UserProfileMenu } from "./user-profile-menu";

export function AppHeader({ employees = [] }: { employees?: any[] }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Simple placeholder for hydration
  if (!mounted) return <header className="h-14 w-full border-b border-zinc-800 bg-zinc-950" />;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80">
      {/* INNER CONTAINER: 
          - max-w-7xl mx-auto: Aligns content with the dashboard table
          - px-4 md:px-6 lg:px-8: Responsive padding to match your DarkThemeLayout
      */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex h-14 items-center justify-between">
        
        <div className="flex items-center gap-4">
          <MobileNav pathname={pathname} />

          {/* LOGO */}
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-zinc-50 mr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 font-bold">LOGO</div>
            <span className="text-lg tracking-tight hidden sm:inline-block">HSI Payroll</span>
          </Link>

          <DesktopNav pathname={pathname} employees={employees} />
        </div>

        <UserProfileMenu />
      </div>
    </header>
  );
}