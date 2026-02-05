"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartDepartmentInput } from "./smart-department-input"; // NEW IMPORT
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId?: string | null;
}

export function EmployeeFormModal({ isOpen, onClose, employeeId }: EmployeeFormModalProps) {
  const isEdit = !!employeeId;
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    role: "",
    employment_type: "Full-time",
    pay_type: "Monthly",
    pay_rate: "",
  });

  useEffect(() => {
    if (isOpen && isEdit) fetchEmployee();
    else if (isOpen) {
      setFormData({
        first_name: "", last_name: "", email: "",
        department: "", role: "",
        employment_type: "Full-time", pay_type: "Monthly", pay_rate: "",
      });
    }
  }, [isOpen, employeeId]);

  const fetchEmployee = async () => {
    setFetching(true);
    const { data } = await supabase.from("employees").select("*").eq("id", employeeId).single();
    if (data) setFormData({ ...data, pay_rate: data.pay_rate?.toString() || "" });
    setFetching(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation: Pay rate must be greater than 0
    if (parseFloat(formData.pay_rate) <= 0) {
      alert("Pay rate must be a positive number.");
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      // Smart Casing for Department
      department: formData.department.charAt(0).toUpperCase() + formData.department.slice(1).toLowerCase(),
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      pay_rate: parseFloat(formData.pay_rate),
      is_active: true,
    };

    const { error } = isEdit 
      ? await supabase.from("employees").update(payload).eq("id", employeeId)
      : await supabase.from("employees").insert([payload]);

    if (!error) onClose();
    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-50">
        <DialogHeader className="border-b border-zinc-800 pb-4">
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>Manage payroll and employment details.</DialogDescription>
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

            <div className="space-y-2">
              <Label>Department</Label>
              <SmartDepartmentInput 
                value={formData.department} 
                onChange={(val) => setFormData({...formData, department: val})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input placeholder="e.g. Intern" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-zinc-900 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label>Pay Rate</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0.01" // Browser-level validation to prevent 0 or negative
                  required 
                  value={formData.pay_rate} 
                  onChange={e => setFormData({...formData, pay_rate: e.target.value})} 
                  className="bg-zinc-900 border-zinc-800" 
                />
              </div>
            </div>

            {/* Other fields: Email, Employment Type, Pay Type ... */}
            {/* [Included in final full file but omitted here for brevity] */}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-blue-600">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}