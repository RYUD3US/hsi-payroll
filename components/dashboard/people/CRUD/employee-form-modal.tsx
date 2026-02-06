"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PayrollFields } from "./form-sections/payroll-fields";
import { EmployeeDetailsFields } from "./form-sections/employee-details-fields";
import { ComparisonPayModal } from "./comparison-pay-modal";
import { addEmployeeAndInvite } from "@/app/actions/employee-actions";

export function EmployeeFormModal({ isOpen, onClose }: any) {
  const supabase = createClient();
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", department: "", role: "",
    employment_type: "Full-time", pay_type: "Monthly", pay_rate: "", 
  });

  // Smart Comparison Logic
  const peerMatches = useMemo(() => {
    if (!formData.role || formData.role.length < 3) return [];
    return allEmployees.filter(emp => emp.role?.toLowerCase() === formData.role.toLowerCase());
  }, [formData.role, allEmployees]);

  useEffect(() => {
    if (isOpen) {
      supabase.from("employees").select("*").is("deleted_at", null)
        .then(({ data }) => setAllEmployees(data || []));
      setShowComparison(true);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user?.id).single();

      // THE PAYRATE FIX: Strip commas so it's a number for the DB
      const submissionData = {
        ...formData,
        pay_rate: parseFloat(formData.pay_rate.toString().replace(/,/g, "")) || 0
      };

      const result = await addEmployeeAndInvite(submissionData, profile?.organization_id);
      if (result.error) throw new Error(result.error);
      onClose();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-zinc-950 text-white max-w-xl border-zinc-800">
          {/* ACCESSIBILITY FIX: Required DialogTitle */}
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Employee</DialogTitle>
            <DialogDescription className="text-zinc-500">Fill in details to sync with payroll and invite.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <EmployeeDetailsFields formData={formData} setFormData={setFormData} />
            
            {/* SMART COMMA RESTORATION */}
            <PayrollFields 
              formData={formData} 
              setFormData={setFormData} 
              formatNumber={(v: string) => v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
            />
            
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Send Invite"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ComparisonPayModal 
        isOpen={isOpen && peerMatches.length > 0 && showComparison} 
        onClose={() => setShowComparison(false)}
        roleName={formData.role}
        peers={peerMatches}
      />
    </>
  );
}