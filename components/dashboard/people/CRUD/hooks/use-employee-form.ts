import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addEmployeeAndInvite } from "@/app/actions/employee-actions";
import { useRouter } from "next/navigation";

export function useEmployeeForm(onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No active session found. Please log in again.");

      // 2. FRESH FETCH of the organization_id from profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      // - This catch prevents the "Organization ID not found" alert
      if (profileError || !profile?.organization_id) {
        throw new Error("Your profile is not yet linked to an organization in the database.");
      }

      // 3. Call the server action with the verified ID
      const result = await addEmployeeAndInvite(formData, profile.organization_id);
      
      if (result.error) throw new Error(result.error);

      onClose();
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, loading, handleSubmit };
}