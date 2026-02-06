import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmartDepartmentInput } from "../smart-department-input"; // RESTORED IMPORT

export function PayrollFields({ formData, setFormData, formatNumber }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-zinc-400 text-xs">Department</Label>
        <SmartDepartmentInput 
          fieldName="department" 
          value={formData.department} 
          onChange={(val: string) => setFormData({...formData, department: val})} 
        />
      </div>

      <div className="space-y-1">
        <Label className="text-zinc-400 text-xs">Role (Smart Match)</Label>
        <SmartDepartmentInput 
          fieldName="role" 
          value={formData.role} 
          filterBy={{ field: "department", value: formData.department }} 
          onChange={(val: string) => setFormData({...formData, role: val})} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-zinc-400 text-xs">Type</Label>
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
          <Label className="text-zinc-400 text-xs">Pay Rate</Label>
          <div className="flex">
            <Input 
              required 
              value={formatNumber(formData.pay_rate)} 
              onChange={e => setFormData({...formData, pay_rate: e.target.value})} 
              className="bg-zinc-900 border-zinc-800 rounded-r-none border-r-0 flex-1" 
            />
            <Select value={formData.pay_type} onValueChange={v => setFormData({...formData, pay_type: v})}>
              <SelectTrigger className="w-[85px] bg-zinc-900 border-zinc-800 rounded-l-none text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800">
                <SelectItem value="Monthly">/mo</SelectItem>
                <SelectItem value="Daily">/day</SelectItem>
                <SelectItem value="Hourly">/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}