"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function addEmployeeAndInvite(formData: any, organizationId: string) {
  try {
    // 1. Database Insert - Explicitly mapping the payroll fields
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
          employment_type: formData.employment_type, // FIX: Sends "Full-time"
          pay_type: formData.pay_type || "Monthly",
          pay_rate: formData.pay_rate,               // FIX: Sends the actual number
          status: "Pending", 
      }])
      .select().single();

    if (dbError) throw new Error(dbError.message);

    // 2. Email Invitation - Use fallback URL if ENV is missing
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      formData.email,
      {
        data: { organization_id: organizationId, employee_id: newEmployee.id },
        redirectTo: `${siteUrl}/auth/confirm`,
      }
    );

    // Provide a clearer error for the rate limit
    if (inviteError) {
       if (inviteError.message.includes("rate limit")) {
         throw new Error("Supabase Email limit reached. The employee was added to the table, but the email couldn't be sent yet.");
       }
       throw new Error(inviteError.message);
    }

    revalidatePath("/people");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}