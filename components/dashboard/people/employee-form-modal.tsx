"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartDepartmentInput } from "./smart-department-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Circle } from "lucide-react";

export function EmployeeFormModal({ isOpen, onClose, employeeId }: any) {
  const isEdit = !!employeeId;
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "",
    department: "", role: "",
    employment_type: "Full-time", pay_type: "Monthly", pay_rate: "0",
    status: "Active" // Added status back
  });

  const formatNumber = (val: string) => {
    const num = val.replace(/,/g, "");
    if (isNaN(Number(num))) return formData.pay_rate;
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (isOpen && isEdit) fetchEmployee();
    else if (isOpen) setFormData({
      first_name: "", last_name: "", email: "",
      department: "", role: "", employment_type: "Full-time", 
      pay_type: "Monthly", pay_rate: "0", status: "Active"
    });
  }, [isOpen, employeeId]);

  const fetchEmployee = async () => {
    setFetching(true);
    const { data } = await supabase.from("employees").select("*").eq("id", employeeId).single();
    if (data) setFormData({ 
      ...data, 
      pay_rate: formatNumber(data.pay_rate?.toString() || "0"),
      status: data.status || "Active" 
    });
    setFetching(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numericPay = parseFloat(formData.pay_rate.replace(/,/g, ""));
    if (numericPay < 0) return alert("Pay rate cannot be negative.");

    setLoading(true);
    const payload = {
      ...formData,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      pay_rate: numericPay,
      is_active: formData.status === "Active" // Sync boolean is_active with status string
    };

    const { error } = isEdit 
      ? await supabase.from("employees").update(payload).eq("id", employeeId)
      : await supabase.from("employees").insert([payload]);

    if (!error) onClose();
    setLoading(false);
  }

  // Helper for status colors
  const getStatusColor = (status: string) => {
    if (status === "Active") return "text-green-500";
    if (status === "Inactive") return "text-zinc-400";
    if (status === "Exited") return "text-red-500";
    return "text-zinc-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-50">
        <DialogHeader className="border-b border-zinc-800 pb-4">
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>Setup employment and payroll details.</DialogDescription>
        </DialogHeader>

        {fetching ? (
          <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="bg-zinc-900 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="bg-zinc-900 border-zinc-800" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <SmartDepartmentInput fieldName="department" value={formData.department} onChange={(val) => setFormData({...formData, department: val})} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <SmartDepartmentInput fieldName="role" filterBy={{ field: "department", value: formData.department }} value={formData.role} onChange={(val) => setFormData({...formData, role: val})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select value={formData.employment_type} onValueChange={v => setFormData({...formData, employment_type: v})}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800">
                    {["Full-time", "Part-time", "Internship", "Contract"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pay Rate & Frequency</Label>
                <div className="flex gap-0">
                  <Input 
                    value={formData.pay_rate} 
                    onChange={e => setFormData({...formData, pay_rate: formatNumber(e.target.value)})} 
                    className="bg-zinc-900 border-zinc-800 rounded-r-none border-r-0" 
                    placeholder="0"
                  />
                  <Select value={formData.pay_type} onValueChange={v => setFormData({...formData, pay_type: v})}>
                    <SelectTrigger className="w-[100px] bg-zinc-900 border-zinc-800 rounded-l-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800">
                      <SelectItem value="Monthly">/mo</SelectItem>
                      <SelectItem value="Daily">/day</SelectItem>
                      <SelectItem value="Hourly">/hr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              <div className="flex items-center gap-3">
                {isEdit && (
                  <>
                    <Label className="text-zinc-500">Status:</Label>
                    <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                      <SelectTrigger className={`w-[130px] bg-transparent border-none font-medium focus:ring-0 p-0 h-auto ${getStatusColor(formData.status)}`}>
                        <div className="flex items-center gap-2">
                           <Circle className="w-2 h-2 fill-current" />
                           <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800">
                        <SelectItem value="Active" className="text-green-500">Active</SelectItem>
                        <SelectItem value="Inactive" className="text-zinc-400">Inactive</SelectItem>
                        <SelectItem value="Exited" className="text-red-500">Exited</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[100px]">
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}