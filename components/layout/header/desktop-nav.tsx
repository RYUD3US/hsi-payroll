import Link from "next/link";
import { LayoutDashboard, Wallet, Clock, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { NavHoverContent } from "./nav-hover-content";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payroll", label: "Payroll", icon: Wallet },
  { href: "/timesheets", label: "Timesheets", icon: Clock },
  { href: "/people", label: "People", icon: Users },
  { href: "/reports", label: "Reports", icon: FileText },
] as const;

export function DesktopNav({ pathname, employees }: { pathname: string, employees: any[] }) {
  return (
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
          <HoverCardContent align="start" sideOffset={10} className="w-auto p-0 bg-zinc-950 border-zinc-800 shadow-2xl">
            <NavHoverContent label={label} employees={employees} />
          </HoverCardContent>
        </HoverCard>
      ))}
    </nav>
  );
}