import type { Employee, Timesheet, TaxStatus } from "./database";

/** Input for a single employee's payroll line (approved time + overrides). */
export interface PayrollLineInput {
  employee: Employee;
  /** Approved timesheets for the period (or manual total). */
  regularHours: number;
  overtimeHours: number;
  sickLeaveHours?: number;
  paidLeaveHours?: number;
  /** Holiday pay multiplier (e.g., 2.0 for double pay). */
  holidayPayMultiplier?: number;
  /** Optional overrides; if set, calculation may use these instead of recomputing. */
  grossOverride?: number;
  taxOverride?: number;
  sssOverride?: number;
  philhealthOverride?: number;
  pagIbigOverride?: number;
  otherDeductionsOverride?: number;
}

/** Result of gross-to-net for one employee. */
export interface PayrollLineResult {
  employeeId: string;
  regularHours: number;
  overtimeHours: number;
  sickLeaveHours: number;
  paidLeaveHours: number;
  grossPay: number;
  taxableIncome: number;
  withholdingTax: number;
  sss: number;
  philhealth: number;
  pagIbig: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  isManualOverride: boolean;
}

/** Input for the full payroll run (period + lines). */
export interface PayrollRunInput {
  periodStart: string;
  periodEnd: string;
  checkDate: string;
  glPostDate?: string;
  deliveryAddress?: string;
  payoutMethod?: string;
  lines: PayrollLineInput[];
  currency?: string;
  holidayDoublePayEnabled?: boolean;
}

/** Result of the full run (totals + per-line). */
export interface PayrollRunResult {
  periodStart: string;
  periodEnd: string;
  checkDate: string;
  glPostDate?: string;
  deliveryAddress?: string;
  payoutMethod?: string;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  currency: string;
  lines: PayrollLineResult[];
}

/** Philippine payroll constants (simplified; extend per BIR/SSS/PhilHealth/Pag-IBIG). */
export interface PhilippinePayrollConstants {
  /** SSS, PhilHealth, Pag-IBIG contribution limits/rates (placeholder structure). */
  sss: { employeeShareRate?: number; maxSalary?: number };
  philhealth: { rate?: number; minPremium?: number; maxPremium?: number };
  pagIbig: { employeeRate?: number; employerRate?: number };
  /** Tax table or formula (e.g. TRAIN law). */
  withholdingTax: (taxableIncome: number, status: TaxStatus | null) => number;
}
