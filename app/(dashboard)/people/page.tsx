"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Briefcase, Clock, Zap, Loader2 } from "lucide-react";

// Fixed Import Path
import { EmployeeFormModal } from "@/components/dashboard/people/employee-form-modal";

export default function PeoplePage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Memoized fetch to avoid unnecessary re-renders
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("employees")
      .select("*")
      .is("deleted_at", null)
      .order("first_name", { ascending: true });
    
    if (data) setEmployees(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const toggleModal = (id: string | null = null) => {
    setSelectedId(id);
    setIsModalOpen(!isModalOpen);
  };

  // Stats Data for cleaner rendering
  const stats = [
    { title: "Total Employees", value: employees.length, icon: <Users />, sub: "Active directory" },
    { title: "Currently Active", value: employees.filter(e => e.is_active).length, icon: <Zap />, sub: "Working now" },
    { title: "Interns", value: employees.filter(e => e.employment_type === 'Internship').length, icon: <Clock />, sub: "Internship track" },
    { title: "Monthly Obligation", value: formatCurrency(employees.filter(e => e.pay_type === 'Monthly').reduce((sum, e) => sum + Number(e.pay_rate), 0)), icon: <Briefcase />, sub: "Base payroll" },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">People</h1>
          <p className="text-zinc-400 text-sm">Employee directory and data management.</p>
        </div>
        <Button onClick={() => toggleModal()} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Optimized Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

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
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-zinc-500"><Loader2 className="animate-spin inline mr-2 h-4 w-4" /> Loading...</TableCell></TableRow>
            ) : employees.map((emp) => (
              <TableRow 
                key={emp.id} 
                className="border-zinc-800 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                onClick={() => toggleModal(emp.id)}
              >
                <TableCell className="font-medium text-zinc-50">{emp.full_name || `${emp.first_name} ${emp.last_name}`}</TableCell>
                <TableCell>
                  <div className="text-zinc-50 text-sm">{emp.role || "No Role"}</div>
                  <div className="text-zinc-500 text-xs">{emp.department}</div>
                </TableCell>
                <TableCell><Badge variant="outline" className="border-zinc-700 text-zinc-400 font-normal">{emp.employment_type || "Staff"}</Badge></TableCell>
                <TableCell className="text-right text-zinc-50">
                  {formatCurrency(emp.pay_rate)}
                  <span className="text-zinc-500 text-[10px] ml-1">/{emp.pay_type === "Monthly" ? "mo" : "hr"}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={emp.is_active ? "success" : "secondary"} className={emp.is_active ? "bg-green-500/10 text-green-500 border-none" : ""}>
                    {emp.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EmployeeFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchEmployees(); }} 
        employeeId={selectedId} 
      />
    </div>
  );
}

// Internal reusable component to keep the file clean
function StatCard({ title, value, icon, sub }: { title: string, value: string | number, icon: any, sub: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between text-zinc-500 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
        <div className="h-4 w-4 text-zinc-400">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-zinc-50">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{sub}</div>
    </div>
  );
}