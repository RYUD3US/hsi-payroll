"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";

export default function EmployeeFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isEdit = id !== "add"; // If the URL is /people/add, it's a new employee
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "Operations",
    pay_type: "Monthly",
    pay_rate: "",
  });

  // Load data if we are EDITING
  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("id", id)
          .single();
        
        if (data) {
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            department: data.department || "Operations",
            pay_type: data.pay_type || "Monthly",
            pay_rate: data.pay_rate?.toString() || "",
          });
        }
        setFetching(false);
      };
      fetchEmployee();
    }
  }, [id, isEdit, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      pay_rate: parseFloat(formData.pay_rate),
    };

    const { error } = isEdit 
      ? await supabase.from("employees").update(payload).eq("id", id)
      : await supabase.from("employees").insert([payload]);

    if (error) {
      alert(error.message);
    } else {
      router.push("/people");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to remove this employee?")) {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (!error) {
        router.push("/people");
        router.refresh();
      }
    }
  }

  if (fetching) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-4 text-zinc-400">
        <ArrowLeft className="h-4 w-4" /> Back to People
      </Button>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">{isEdit ? "Edit Employee" : "Add New Employee"}</h1>
          <p className="text-zinc-400">Set up personal and payroll information.</p>
        </div>
        {isEdit && (
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input 
              value={formData.first_name} 
              onChange={e => setFormData({...formData, first_name: e.target.value})} 
              required className="bg-zinc-950 border-zinc-800" 
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input 
              value={formData.last_name} 
              onChange={e => setFormData({...formData, last_name: e.target.value})} 
              required className="bg-zinc-950 border-zinc-800" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            className="bg-zinc-950 border-zinc-800" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Pay Type</Label>
            <Select value={formData.pay_type} onValueChange={v => setFormData({...formData, pay_type: v})}>
              <SelectTrigger className="bg-zinc-950 border-zinc-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
              onChange={e => setFormData({...formData, pay_rate: e.target.value})} 
              required className="bg-zinc-950 border-zinc-800" 
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Employee" : "Save Employee"}
        </Button>
      </form>
    </div>
  );
}