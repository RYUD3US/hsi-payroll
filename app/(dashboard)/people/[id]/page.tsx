"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// This is just a logic helper to clean up your main component
export function useEmployeeActions(employeeId?: string | null) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleSave(formData: any, onClose: () => void) {
    setLoading(true);
    
    // Clean data for DB
    const payload = {
      ...formData,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      pay_rate: parseFloat(formData.pay_rate.toString().replace(/,/g, "")),
      is_active: true,
    };

    const { error } = employeeId
      ? await supabase.from("employees").update(payload).eq("id", employeeId)
      : await supabase.from("employees").insert([payload]);

    if (error) {
      alert(error.message);
    } else {
      onClose();
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(onClose: () => void) {
    if (!confirm("Soft delete this employee?")) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("employees")
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq("id", employeeId);

    if (!error) {
      onClose();
      router.refresh();
    }
    setLoading(false);
  }

  return { handleSave, handleDelete, loading };
}