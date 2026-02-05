"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Briefcase, Clock, Zap, RefreshCw } from "lucide-react";
import { EmployeeFormModal } from "@/components/dashboard/people/employee-form-modal";
import { EmployeeTable } from "@/components/dashboard/people/employee-table";

export default function PeoplePage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEmployees = useCallback(async (showFullLoader = false) => {
    if (showFullLoader) setLoading(true);
    else setIsRefreshing(true);

    const { data } = await supabase
      .from("employees")
      .select("*")
      .is("deleted_at", null)
      .order("first_name", { ascending: true });
    
    if (data) setEmployees(data);
    setLoading(false);
    setIsRefreshing(false);
  }, [supabase]);

  useEffect(() => {
    fetchEmployees(true);
    pollingRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') fetchEmployees(false);
    }, 60000);

    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [fetchEmployees]);

  const toggleModal = (id: string | null = null) => {
    setSelectedId(id);
    setIsModalOpen(!isModalOpen);
  };

  // Stats Logic
  const stats = [
    { title: "Total Employees", value: employees.length, icon: <Users />, sub: "Active directory" },
    { title: "Currently Active", value: employees.filter(e => e.status === 'Active').length, icon: <Zap />, sub: "Working now" },
    { 
      title: "Interns", 
      // Counts only if they are 'Internship' AND (Active OR Inactive). Excludes 'Exited'.
      value: employees.filter(e => e.employment_type === 'Internship' && e.status !== 'Exited').length, 
      icon: <Clock />, 
      sub: "Internship track" 
    },
    { 
      title: "Monthly Obligation", 
      value: formatCurrency(employees.filter(e => e.pay_type === 'Monthly' && e.status === 'Active').reduce((sum, e) => sum + Number(e.pay_rate), 0)), 
      icon: <Briefcase />, 
      sub: "Base payroll (Active)" 
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-zinc-50">People</h1>
            {isRefreshing && <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />}
          </div>
          <p className="text-zinc-400 text-sm">Employee directory</p>
        </div>
        <Button onClick={() => toggleModal()} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <EmployeeTable 
        employees={employees} 
        loading={loading} 
        onRowClick={(id) => toggleModal(id)} 
      />

      <EmployeeFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchEmployees(false); }} 
        employeeId={selectedId} 
      />
    </div>
  );
}

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