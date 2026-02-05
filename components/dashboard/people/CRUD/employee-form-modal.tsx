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
import { Loader2, Trash2, Circle } from "lucide-react";

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
    employment_type: "Full-time", pay_type: "Monthly", pay_rate: "", 
    status: "Active" 
  });

  useEffect(() => {
    if (isOpen) {
      if (!isEdit) {
        supabase.from("employees")
          .select("full_name, role, pay_rate, pay_type, employment_type, id") 
          .is("deleted_at", null)
          .then(({ data }) => data && setAllEmployees(data));
      }
      
      setShowComparison(true);

      if (isEdit) {
        fetchEmployee();
      } else {
        setFormData({
          first_name: "", last_name: "", email: "", department: "", role: "",
          employment_type: "Full-time", pay_type: "Monthly", pay_rate: "",
          status: "Active"
        });
      }
    }
  }, [isOpen, employeeId, isEdit]);

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
        status: data.status || (data.is_active ? "Active" : "Inactive")
      });
    }
    setFetching(false);
  };

  async function handleDelete() {
    if (!confirm("Are you sure? This employee will be removed from the active list.")) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("employees")
      .update({ 
        deleted_at: new Date().toISOString(),
        is_active: false,
        status: "Exited" 
      })
      .eq("id", employeeId);

    if (!error) {
      onClose();
      router.refresh();
    }
    setLoading(false);
  }

  const peerMatches = useMemo(() => {
    if (isEdit || !formData.role || formData.role.length < 3) return [];
    return allEmployees.filter(emp => 
      emp.role?.toLowerCase() === formData.role.toLowerCase()
    );
  }, [formData.role, allEmployees, isEdit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const cleanRate = formData.pay_rate.toString().replace(/,/g, "");
    const payload = {
      ...formData,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      pay_rate: parseFloat(cleanRate) || 0,
      is_active: formData.status === "Active", 
    };
    const { error } = isEdit
      ? await supabase.from("employees").update(payload).eq("id", employeeId)
      : await supabase.from("employees").insert([payload]);
    if (!error) {
      onClose();
      router.refresh();
    }
    setLoading(false);
  }

  const formatNumber = (val: string) => {
    const num = val.toString().replace(/,/g, "");
    if (isNaN(Number(num))) return formData.pay_rate;
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusColor = (status: string) => {
    if (status === "Active") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (status === "Inactive") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
        <DialogContent 
          onPointerDownOutside={(e) => e.preventDefault()} 
          className="bg-zinc-950 border-zinc-800 text-zinc-50 w-[95vw] max-w-xl p-0 overflow-hidden"
        >
          <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
            <DialogHeader className="flex flex-row items-center justify-between border-b border-zinc-900 pb-4">
              <div className="space-y-1">
                <DialogTitle className="text-lg">{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">Payroll and employment details.</DialogDescription>
              </div>

              {isEdit && (
                <div className="flex items-center">
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger className={`h-7 w-[95px] sm:w-[110px] text-[10px] sm:text-xs font-medium border rounded-full ${getStatusColor(formData.status)}`}>
                       <div className="flex items-center gap-1.5">
                         <Circle className="h-1.5 w-1.5 fill-current" />
                         <SelectValue />
                       </div>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="Active" className="text-emerald-500">Active</SelectItem>
                      <SelectItem value="Inactive" className="text-amber-500">Inactive</SelectItem>
                      <SelectItem value="Exited" className="text-zinc-500">Exited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </DialogHeader>

            {fetching ? (
              <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                {/* Names stay in 2 columns even on small screens */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <Label className="text-zinc-400 text-xs sm:text-sm">First Name</Label>
                    <Input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="bg-zinc-900 border-zinc-800 h-9 sm:h-10 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-zinc-400 text-xs sm:text-sm">Last Name</Label>
                    <Input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="bg-zinc-900 border-zinc-800 h-9 sm:h-10 text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-zinc-400 text-xs sm:text-sm">Department</Label>
                  <SmartDepartmentInput fieldName="department" value={formData.department} onChange={(val) => setFormData({...formData, department: val})} />
                </div>

                <div className="space-y-1">
                  <Label className="text-zinc-400 text-xs sm:text-sm">Role</Label>
                  <SmartDepartmentInput 
                    fieldName="role" 
                    value={formData.role} 
                    filterBy={{ field: "department", value: formData.department }} 
                    onChange={(val) => setFormData({...formData, role: val})} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-zinc-400 text-xs sm:text-sm">Employment Type</Label>
                    <Select value={formData.employment_type} onValueChange={v => setFormData({...formData, employment_type: v})}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 w-full h-9 sm:h-10"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-zinc-400 text-xs sm:text-sm">Pay Rate</Label>
                    <div className="flex">
                      <Input 
                        required 
                        value={formatNumber(formData.pay_rate)} 
                        onChange={e => setFormData({...formData, pay_rate: e.target.value})} 
                        className="bg-zinc-900 border-zinc-800 rounded-r-none border-r-0 flex-1 h-9 sm:h-10 text-sm" 
                      />
                      <Select value={formData.pay_type} onValueChange={v => setFormData({...formData, pay_type: v})}>
                        <SelectTrigger className="w-[80px] sm:w-[85px] bg-zinc-900 border-zinc-800 rounded-l-none h-9 sm:h-10 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800">
                            <SelectItem value="Monthly">/mo</SelectItem>
                            <SelectItem value="Daily">/day</SelectItem>
                            <SelectItem value="Hourly">/hr</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 border-t border-zinc-900 gap-4 mt-6">
                  <div className="w-full sm:w-auto">
                    {isEdit && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleDelete}
                        className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 gap-2 w-full justify-center sm:justify-start h-9"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">Archive Record</span>
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto h-9 text-xs sm:text-sm">Cancel</Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 font-bold px-8 w-full sm:w-auto h-9 text-xs sm:text-sm">
                      {loading ? <Loader2 className="animate-spin h-4 w-4" /> : isEdit ? "Update Changes" : "Save Employee"}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {!isEdit && (
        <ComparisonPayModal 
          isOpen={isOpen && peerMatches.length > 0 && showComparison} 
          onClose={() => setShowComparison(false)}
          roleName={formData.role}
          peers={peerMatches}
        />
      )}
    </>
  );
}