"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchEmployees = useCallback(async () => {
    // Fetches all employees not marked as deleted
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .is("deleted_at", null)
      .order("first_name", { ascending: true });

    if (error) {
      console.error("Error fetching employees:", error);
    } else if (data) {
      setEmployees(data);
    }
    setLoading(false);
  }, [supabase]);

  // Initial fetch on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { 
    employees, 
    loading, 
    refresh: fetchEmployees,
    // Helper to get active count for your header
    activeCount: employees.filter(e => e.status === "Active").length 
  };
}