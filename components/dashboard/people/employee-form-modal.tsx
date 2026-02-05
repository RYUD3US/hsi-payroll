"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartDepartmentInput } from "./smart-department-input";
import { ComparisonPayModal } from "./comparison-pay-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function EmployeeFormModal({ isOpen, onClose, employeeId }: any) {
  const supabase = createClient();
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(true);
  
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", department: "", role: "",
    employment_type: "Full-time", pay_type: "Monthly", pay_rate: "0"
  });

  useEffect(() => {
    if (isOpen) {
      supabase.from("employees")
        .select("full_name, role, pay_rate, pay_type, employment_type, id") 
        .is("deleted_at", null)
        .then(({ data }) => data && setAllEmployees(data));
      setShowComparison(true);
    }
  }, [isOpen]);

  const peerMatches = useMemo(() => {
    if (!formData.role || formData.role.length < 3) return [];
    return allEmployees.filter(emp => 
      emp.role?.toLowerCase() === formData.role.toLowerCase() && emp.id !== employeeId
    );
  }, [formData.role, allEmployees, employeeId]);

  const formatNumber = (val: string) => {
    const num = val.replace(/,/g, "");
    if (isNaN(Number(num))) return formData.pay_rate;
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
        <DialogContent 
          // FIX: Prevent clicks on the Comparison Modal from closing this one
          onPointerDownOutside={(e) => e.preventDefault()} 
          className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-xl"
        >
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>Setup employment and payroll details.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-zinc-400">First Name</Label><Input value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="bg-zinc-900 border-zinc-800" /></div>
              <div className="space-y-1"><Label className="text-zinc-400">Last Name</Label><Input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="bg-zinc-900 border-zinc-800" /></div>
            </div>

            <div className="space-y-1">
              <Label className="text-zinc-400">Department</Label>
              <SmartDepartmentInput fieldName="department" value={formData.department} onChange={(val) => setFormData({...formData, department: val})} />
            </div>

            <div className="space-y-1">
              <Label className="text-zinc-400">Role</Label>
              <SmartDepartmentInput fieldName="role" value={formData.role} onChange={(val) => setFormData({...formData, role: val})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-zinc-400">Employment Type</Label>
                <Select value={formData.employment_type} onValueChange={v => setFormData({...formData, employment_type: v})}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800">
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-400">Pay Rate</Label>
                <div className="flex">
                  <Input value={formData.pay_rate} onChange={e => setFormData({...formData, pay_rate: formatNumber(e.target.value)})} className="bg-zinc-900 border-zinc-800 rounded-r-none border-r-0" />
                  <Select value={formData.pay_type} onValueChange={v => setFormData({...formData, pay_type: v})}>
                    <SelectTrigger className="w-[85px] bg-zinc-900 border-zinc-800 rounded-l-none"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800">
                      <SelectItem value="Monthly">/mo</SelectItem>
                      <SelectItem value="Hourly">/hr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8">Save Changes</Button>
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