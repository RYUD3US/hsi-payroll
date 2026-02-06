"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function addEmployeeAndInvite(formData: any, organizationId: string) {
  try {
    // 1. Create the Employee record first
    // Status is set to "Inactive" and is_active to false until they verify
    const { data: newEmployee, error: dbError } = await supabaseAdmin
      .from("employees")
      .insert([{
          first_name: formData.first_name,
          last_name: formData.last_name,
          full_name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
          department: formData.department,
          role: formData.role,
          organization_id: organizationId, 
          employment_type: formData.employment_type,
          pay_type: formData.pay_type || "Monthly",
          pay_rate: formData.pay_rate,
          status: "Inactive", // User is inactive until password setup
          is_active: false,   // Matching the boolean field in your schema
      }])
      .select().single();

    if (dbError) throw new Error(dbError.message);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // 2. Invite the user via email
    // This sends the link they will use to set their own password
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      formData.email,
      {
        data: { 
            organization_id: organizationId, 
            employee_id: newEmployee.id,
        },
        // Redirect them to a specific password setup page
        redirectTo: `${siteUrl}/auth/set-password`, 
      }
    );

    if (inviteError) {
       if (inviteError.message.includes("rate limit")) throw new Error("Supabase Email limit reached.");
       throw new Error(inviteError.message);
    }

    // 3. Link the Profile to the Employee and Organization
    // This ensures the auth.users entry matches your business logic tables
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        employee_id: newEmployee.id,
        organization_id: organizationId,
        role: formData.role || 'employee'
      })
      .eq("id", inviteData.user.id); 

    if (profileError) throw new Error(profileError.message);

    revalidatePath("/people");
    return { success: true };
  } catch (error: any) {
    console.error("Error in addEmployeeAndInvite:", error);
    return { error: error.message };
  }
}