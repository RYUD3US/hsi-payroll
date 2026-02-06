"use client";

import { Users, Zap, Briefcase, ChevronDown, Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatsProps {
  employees: any[];
  activeFilter: string;
  statusFilter: string;
  deptFilter: string;
  onFilterChange: (filter: string) => void;
  onStatusChange: (status: string) => void;
  onDeptChange: (dept: string) => void;
}

export function StatsSection({ 
  employees, 
  activeFilter, 
  statusFilter, 
  deptFilter,
  onFilterChange, 
  onStatusChange,
  onDeptChange 
}: StatsProps) {
  
  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

  const typeFiltered = activeFilter === "All" ? employees : employees.filter(e => e.employment_type === activeFilter);
  const statusFiltered = statusFilter === "All" ? typeFiltered : typeFiltered.filter(e => e.status === statusFilter);
  const finalFiltered = deptFilter === "All" ? statusFiltered : statusFiltered.filter(e => e.department === deptFilter);

  const calculateMonthlyObligation = () => {
    return finalFiltered
      .filter((e) => e.status === "Active")
      .reduce((sum, e) => {
        const rate = Number(e.pay_rate) || 0;
        let monthlyEstimate = 0;
        switch (e.pay_type) {
          case "Monthly": monthlyEstimate = rate; break;
          case "Daily": monthlyEstimate = rate * 22; break;
          case "Hourly": monthlyEstimate = rate * 176; break;
          default: monthlyEstimate = rate;
        }
        return sum + monthlyEstimate;
      }, 0);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* CARD 1: TYPE */}
      <div className={cn("rounded-xl border p-4 transition-all", activeFilter !== "All" ? "border-blue-500 bg-blue-500/10" : "border-zinc-800 bg-zinc-900/50")}>
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest outline-none hover:text-zinc-300">
              {activeFilter === "All" ? "Total Employees" : `Total ${activeFilter}`} <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-zinc-950 border-zinc-800 text-zinc-300">
              <DropdownMenuItem onClick={() => onFilterChange("All")}>Everything</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("Full-time")}>Full-time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("Contract")}>Contract</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("Internship")}>Internship</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Users className="h-4 w-4" />
        </div>
        <div className="text-2xl font-bold text-zinc-50">{typeFiltered.length}</div>
        <div className="text-[10px] text-zinc-500 mt-1">Filtered by type</div>
      </div>

      {/* CARD 2: STATUS */}
      <div className={cn("rounded-xl border p-4 transition-all", statusFilter !== "All" ? "border-emerald-500/50 bg-emerald-500/5" : "border-zinc-800 bg-zinc-900/50")}>
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest outline-none hover:text-zinc-300">
              {statusFilter === "All" ? "All Status" : statusFilter} <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-zinc-950 border-zinc-800 text-zinc-300">
              <DropdownMenuItem onClick={() => onStatusChange("All")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("Active")}>Active Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("Inactive")}>Inactive Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("Exited")}>Exited Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Zap className="h-4 w-4" />
        </div>
        <div className="text-2xl font-bold text-zinc-50">{statusFiltered.length}</div>
        <div className="text-[10px] text-zinc-500 mt-1">Filtered by status</div>
      </div>

      {/* CARD 3: DEPARTMENT */}
      <div className={cn("rounded-xl border p-4 transition-all", deptFilter !== "All" ? "border-orange-500/50 bg-orange-500/5" : "border-zinc-800 bg-zinc-900/50")}>
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest outline-none hover:text-zinc-300">
              {deptFilter === "All" ? "Departments" : deptFilter} <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-zinc-950 border-zinc-800 text-zinc-300 max-h-60 overflow-y-auto">
              <DropdownMenuItem onClick={() => onDeptChange("All")}>All Departments</DropdownMenuItem>
              {departments.map(dept => (
                <DropdownMenuItem key={dept} onClick={() => onDeptChange(dept)}>{dept}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Building2 className="h-4 w-4" />
        </div>
        <div className="text-2xl font-bold text-zinc-50">{finalFiltered.length}</div>
        <div className="text-[10px] text-zinc-500 mt-1">Assigned to team</div>
      </div>

      {/* CARD 4: FINANCIALS */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest">Monthly Obligation</span>
          <Briefcase className="h-4 w-4" />
        </div>
        <div className="text-2xl font-bold text-zinc-50 truncate">
          {formatCurrency(calculateMonthlyObligation())}
        </div>
        <div className="text-[10px] text-zinc-500 mt-1">Total based on filters</div>
      </div>
    </div>
  );
}