"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartDepartmentInput } from "./smart-department-input";
import { ComparisonPayModal } from "./comparison-pay-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

export function EmployeeFormModal({ isOpen, onClose, employeeId }: any) {
  const isEdit = !!employeeId;
  const router = useRouter();
  const supabase = createClient();

  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", department: "", role: "",
    employment_type: "Full-time", pay_type: "Monthly", pay_rate: ""
  });

  // 1. Fetch data for Comparison and Edit mode
  useEffect(() => {
    if (isOpen) {
      // Get all employees for the "Smart" comparison
      supabase.from("employees")
        .select("full_name, role, pay_rate, pay_type, employment_type, id") 
        .is("deleted_at", null)
        .then(({ data }) => data && setAllEmployees(data));
      
      setShowComparison(true);

      if (isEdit) {
        fetchEmployee();
      } else {
        setFormData({
          first_name: "", last_name: "", email: "", department: "", role: "",
          employment_type: "Full-time", pay_type: "Monthly", pay_rate: ""
        });
      }
    }
  }, [isOpen, employeeId]);

  const fetchEmployee = async () => {
    setFetching(true);
    const { data } = await supabase.from("employees").select("*").eq("id", employeeId).single();
    if (data) {
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        department: data.department || "",
        role: data.role || "",
        employment_type: data.employment_type || "Full-time",
        pay_type: data.pay_type || "Monthly",
        pay_rate: data.pay_rate?.toString() || "",
      });
    }
    setFetching(false);
  };

  // 2. Peer Matching Logic
  const peerMatches = useMemo(() => {
    if (!formData.role || formData.role.length < 3) return [];
    return allEmployees.filter(emp => 
      emp.role?.toLowerCase() === formData.role.toLowerCase() && emp.id !== employeeId
    );
  }, [formData.role, allEmployees, employeeId]);

  // 3. Database Save Logic
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Clean formatting before saving
    const cleanRate = formData.pay_rate.replace(/,/g, "");
    
    const payload = {
      ...formData,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      pay_rate: parseFloat(cleanRate) || 0,
      is_active: true,
    };

    const { error } = isEdit
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

  const formatNumber = (val: string) => {
    const num = val.replace(/,/g, "");
    if (isNaN(Number(num))) return formData.pay_rate;
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
        <DialogContent 
          onPointerDownOutside={(e) => e.preventDefault()} 
          className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-xl"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
            <DialogDescription>Setup employment and payroll details.</DialogDescription>
          </DialogHeader>

          {fetching ? (
            <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-zinc-400">First Name</Label>
                  <Input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="bg-zinc-900 border-zinc-800" />
                </div>
                <div className="space-y-1">
                  <Label className="text-zinc-400">Last Name</Label>
                  <Input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="bg-zinc-900 border-zinc-800" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-zinc-400">Department</Label>
                <SmartDepartmentInput fieldName="department" value={formData.department} onChange={(val) => setFormData({...formData, department: val})} />
              </div>

              <div className="space-y-1">
                <Label className="text-zinc-400">Role</Label>
                <SmartDepartmentInput 
                  fieldName="role" 
                  value={formData.role} 
                  filterBy={{ field: "department", value: formData.department }} 
                  onChange={(val) => setFormData({...formData, role: val})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-zinc-400">Employment Type</Label>
                  <Select value={formData.employment_type} onValueChange={v => setFormData({...formData, employment_type: v})}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800">
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-zinc-400">Pay Rate</Label>
                  <div className="flex">
                    <Input 
                      required 
                      value={formatNumber(formData.pay_rate)} 
                      onChange={e => setFormData({...formData, pay_rate: e.target.value})} 
                      className="bg-zinc-900 border-zinc-800 rounded-r-none border-r-0" 
                    />
                    <Select value={formData.pay_type} onValueChange={v => setFormData({...formData, pay_type: v})}>
                      <SelectTrigger className="w-[85px] bg-zinc-900 border-zinc-800 rounded-l-none"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                          <SelectItem value="Monthly">/mo</SelectItem>
                          <SelectItem value="Daily">/day</SelectItem>
                          <SelectItem value="Hourly">/hr</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 font-bold px-8">
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
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