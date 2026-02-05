/**
 * Database types aligned with Supabase schema (supabase/migrations/001_initial_schema.sql).
 * For full type generation use: npx supabase gen types typescript --project-id <id> > types/database.ts
 */

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type UserRole = "Admin" | "HR" | "Employee" | "Manager";

export type User = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserTenantRole = {
  id: string;
  user_id: string;
  tenant_id: string;
  role: UserRole;
  created_at: string;
};

export type PayType = "Hourly" | "Monthly" | "Daily";
export type TaxStatus =
  | "S"
  | "ME"
  | "ME1"
  | "ME2"
  | "ME3"
  | "ME4"
  | "Married"
  | "Head"
  | "Additional";

export type Employee = {
  id: string;
  tenant_id: string;
  user_id: string | null;
  employee_number: string | null;
  first_name: string;
  last_name: string;
  email: string;
  department: string | null;
  job_title: string | null;
  pay_type: PayType;
  pay_rate: number;
  currency: string;
  tax_status: TaxStatus | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  is_active: boolean;
  hire_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TimesheetStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

export type Timesheet = {
  id: string;
  tenant_id: string;
  employee_id: string;
  work_date: string;
  time_in: string | null;
  time_out: string | null;
  break_minutes: number;
  total_hours: number;
  status: TimesheetStatus;
  notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PayrollRunStatus = "Draft" | "Processing" | "Approved" | "Paid" | "Cancelled";

export type PayrollRun = {
  id: string;
  tenant_id: string;
  period_start: string;
  period_end: string;
  check_date: string;
  status: PayrollRunStatus;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  currency: string;
  run_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PayrollItem = {
  id: string;
  payroll_run_id: string;
  employee_id: string;
  regular_hours: number;
  overtime_hours: number;
  gross_pay: number;
  taxable_income: number;
  withholding_tax: number;
  sss: number;
  philhealth: number;
  pag_ibig: number;
  other_deductions: number;
  total_deductions: number;
  net_pay: number;
  currency: string;
  notes: string | null;
  is_manual_override: boolean;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  tenant_id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};
