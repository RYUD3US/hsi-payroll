"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  employeeId?: string | null; // null means "Add New"
}

export function EmployeeFormModal({ isOpen, onClose, employeeId }: EmployeeFormModalProps) {
  const isEdit = !!employeeId;
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "Operations",
    role: "",
    employment_type: "Full-time",
    pay_type: "Monthly",
    pay_rate: "",
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && isEdit) {
      fetchEmployee();
    } else if (isOpen) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        department: "Operations",
        role: "",
        employment_type: "Full-time",
        pay_type: "Monthly",
        pay_rate: "",
      });
    }
  }, [isOpen, employeeId]);

  const fetchEmployee = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", employeeId)
      .single();

    if (data && !error) {
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        department: data.department || "Operations",
        role: data.role || "",
        employment_type: data.employment_type || "Full-time",
        pay_type: data.pay_type || "Monthly",
        pay_rate: data.pay_rate?.toString() || "",
      });
    }
    setFetching(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      pay_rate: parseFloat(formData.pay_rate),
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

  async function handleDelete() {
    if (confirm("Soft delete this employee? They will remain in history but disappear from the active list.")) {
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-50">
        <DialogHeader>
          <div className="flex justify-between items-center pr-6">
            <div>
              <DialogTitle className="text-2xl font-semibold">
                {isEdit ? "Edit Employee" : "Add New Employee"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Set up personal, role, and payroll information.
              </DialogDescription>
            </div>
            {isEdit && (
              <Button variant="destructive" size="icon" onClick={handleDelete} disabled={loading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {fetching ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-zinc-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  className="bg-zinc-900 border-zinc-800 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Role / Position</Label>
                <Input
                  placeholder="e.g. Lead Designer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) => setFormData({ ...formData, department: v })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(v) => setFormData({ ...formData, employment_type: v })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pay Type</Label>
                <Select
                  value={formData.pay_type}
                  onValueChange={(v) => setFormData({ ...formData, pay_type: v })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pay Rate</Label>
                <Input
                  type="number"
                  value={formData.pay_rate}
                  onChange={(e) => setFormData({ ...formData, pay_rate: e.target.value })}
                  required
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Update" : "Save Employee"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}