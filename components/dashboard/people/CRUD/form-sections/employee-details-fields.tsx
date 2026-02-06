import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function EmployeeDetailsFields({ formData, setFormData, isEdit }: any) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>First Name</Label>
        <Input 
          value={formData.first_name} 
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
          placeholder="e.g. Ace" 
          className="bg-zinc-900 border-zinc-800"
        />
      </div>
      <div className="space-y-2">
        <Label>Last Name</Label>
        <Input 
          value={formData.last_name} 
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} 
          placeholder="e.g. Medrano" 
          className="bg-zinc-900 border-zinc-800"
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label>Work Email</Label>
        <Input 
          disabled={isEdit}
          type="email"
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          placeholder="ryujinmedrano@gmail.com" 
          className="bg-zinc-900 border-zinc-800"
        />
      </div>
    </div>
  );
}