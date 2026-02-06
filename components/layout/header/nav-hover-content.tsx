"use client";

import Link from "next/link";
import { UserPlus, Users, Activity, Wallet, LayoutDashboard } from "lucide-react";

interface NavHoverProps {
  label: string;
  employees: any[];
}

export function NavHoverContent({ label, employees }: NavHoverProps) {
  const isActivePeople = label === "People";
  const activeCount = employees.filter((e) => e.status === "Active").length;

  return (
    <div className="flex w-[360px] overflow-hidden rounded-md bg-zinc-950">
      <div className="flex-1 p-4">
        <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Actions</h4>
        <div className="space-y-1">
          {label === "People" && (
            <>
              {/* This href is the "Trigger" */}
              <HoverItem 
                href="/people?action=add" 
                title="Add Employee" 
                sub="Create new profile" 
                icon={<UserPlus className="text-blue-500 h-4 w-4" />} 
              />
              <HoverItem 
                href="/people" 
                title="Directory" 
                sub="Manage staff" 
                icon={<Users className="text-zinc-400 h-4 w-4" />} 
              />
            </>
          )}
          {label === "Payroll" && (
            <HoverItem 
              href="/payroll" 
              title="Run Payroll" 
              sub="Process month-end" 
              icon={<Wallet className="text-emerald-500 h-4 w-4" />} 
            />
          )}
          {label === "Dashboard" && (
            <HoverItem 
              href="/dashboard" 
              title="Overview" 
              sub="Main view" 
              icon={<LayoutDashboard className="text-purple-500 h-4 w-4" />} 
            />
          )}
        </div>
      </div>

      {isActivePeople && (
        <div className="w-[120px] bg-zinc-900/50 p-4 border-l border-zinc-800 animate-in fade-in duration-500">
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 text-center">Live Stats</h4>
          <div className="text-center">
            <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
              <Activity className="h-3 w-3" /> Active
            </div>
            <div className="text-2xl font-bold text-emerald-500">{activeCount}</div>
            <div className="mt-2 text-[10px] text-zinc-500">Total: {employees.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function HoverItem({ title, sub, icon, href }: { title: string, sub: string, icon: any, href: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900 cursor-pointer transition-colors group"
    >
      <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-md group-hover:border-zinc-700">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-zinc-200">{title}</p>
        <p className="text-[10px] text-zinc-500">{sub}</p>
      </div>
    </Link>
  );
}