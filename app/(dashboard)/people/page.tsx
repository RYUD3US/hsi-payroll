"use client";

import { useEffect, useState, useCallback, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { StatsSection } from "@/components/dashboard/people/stats-section";
import { EmployeeTable } from "@/components/dashboard/people/employee-table";
import { PaginationControls } from "@/components/dashboard/people/pagination-controls";
import { EmployeeFormModal } from "@/components/dashboard/people/CRUD/employee-form-modal";

export default function PeoplePage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading People...</div>}>
      <PeoplePageContent />
    </Suspense>
  );
}

function PeoplePageContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); 
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEmployees = useCallback(async (full = false) => {
    full ? setLoading(true) : setIsRefreshing(true);
    const { data } = await supabase.from("employees").select("*").is("deleted_at", null).order("first_name");
    if (data) setEmployees(data);
    setLoading(false);
    setIsRefreshing(false);
  }, [supabase]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") {
      setSelectedId(null);
      setIsModalOpen(true);
      router.replace("/people", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchEmployees(true);
    pollingRef.current = setInterval(() => { 
      if (document.visibilityState === 'visible') fetchEmployees(); 
    }, 60000);
    return () => clearInterval(pollingRef.current!);
  }, [fetchEmployees]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeFilter, statusFilter, deptFilter, pageSize]);

  const { displayEmployees, totalFound, totalPages } = useMemo(() => {
    const filtered = employees.filter(e => {
      const matchSearch = `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) || e.role?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = activeFilter === "All" || e.employment_type === activeFilter;
      const matchStatus = statusFilter === "All" || e.status === statusFilter;
      const matchDept = deptFilter === "All" || e.department === deptFilter;
      return matchSearch && matchType && matchStatus && matchDept;
    });
    return {
      displayEmployees: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
      totalFound: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize)
    };
  }, [employees, searchQuery, activeFilter, statusFilter, deptFilter, pageSize, currentPage]);

  return (
    <div className="space-y-6 p-4">
      {/* RESPONSIVE HEADER: Stacks on mobile, row on desktop */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-zinc-50">People</h1>
            {isRefreshing && <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Showing: <b className="text-blue-400">{activeFilter}</b> • <b className="text-emerald-400">{statusFilter}</b>
          </p>
        </div>

        {/* RESPONSIVE ACTIONS: Stacks search and button on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-9 bg-zinc-900 border-zinc-800 w-full h-9" 
            />
          </div>
          <Button 
            onClick={() => { setSelectedId(null); setIsModalOpen(true); }} 
            className="bg-blue-600 hover:bg-blue-700 h-9 text-xs w-full sm:w-auto px-4"
          >
            <UserPlus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
        </div>
      </header>

      <StatsSection 
        employees={employees} 
        activeFilter={activeFilter} 
        statusFilter={statusFilter} 
        deptFilter={deptFilter} 
        onFilterChange={setActiveFilter} 
        onStatusChange={setStatusFilter} 
        onDeptChange={setDeptFilter} 
      />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <EmployeeTable 
          employees={displayEmployees} 
          loading={loading} 
          onRowClick={(id) => { setSelectedId(id); setIsModalOpen(true); }} 
        />
        <PaginationControls 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalFound={totalFound} 
          pageSize={pageSize} 
          onPageChange={setCurrentPage} 
          onPageSizeChange={setPageSize} 
        />
      </div>

      <EmployeeFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchEmployees(); }} 
        employeeId={selectedId} 
      />
    </div>
  );
}