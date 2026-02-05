"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface EmployeeTableProps {
  employees: any[];
  loading: boolean;
  onRowClick: (id: string) => void;
}

export function EmployeeTable({ employees, loading, onRowClick }: EmployeeTableProps) {
  const getStatusBadge = (emp: any) => {
    // If status is "Exited", show red regardless of is_active
    if (emp.status === "Exited") {
      return (
        <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-none">
          Exited
        </Badge>
      );
    }
    
    // Otherwise, toggle between Active and Inactive
    return (
      <Badge 
        variant={emp.is_active ? "success" : "secondary"} 
        className={emp.is_active ? "bg-green-500/10 text-green-500 border-none" : "bg-zinc-800 text-zinc-500 border-none"}
      >
        {emp.is_active ? "Active" : "Inactive"}
      </Badge>
    );
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            {["Employee", "Role & Dept", "Type", "Pay Rate", "Status"].map((head) => (
              <TableHead key={head} className={head === "Pay Rate" ? "text-right" : ""}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                <Loader2 className="animate-spin inline mr-2 h-4 w-4" /> Loading...
              </TableCell>
            </TableRow>
          ) : employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-zinc-500">No employees found.</TableCell>
            </TableRow>
          ) : (
            employees.map((emp) => (
              <TableRow 
                key={emp.id} 
                className="border-zinc-800 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                onClick={() => onRowClick(emp.id)}
              >
                <TableCell className="font-medium text-zinc-50">
                  {emp.full_name || `${emp.first_name} ${emp.last_name}`}
                </TableCell>
                <TableCell>
                  <div className="text-zinc-50 text-sm">{emp.role || "No Role"}</div>
                  <div className="text-zinc-500 text-xs">{emp.department}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-normal">
                    {emp.employment_type || "Staff"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-zinc-50">
                  {formatCurrency(emp.pay_rate)}
                  <span className="text-zinc-500 text-[10px] ml-1">
                    /{emp.pay_type === "Monthly" ? "mo" : emp.pay_type === "Hourly" ? "hr" : "day"}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(emp)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}