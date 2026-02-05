/**
 * Payroll Calculation Engine — Philippine-compliant gross-to-net.
 * Encapsulated for unit testing; extend with real BIR/SSS/PhilHealth/Pag-IBIG tables.
 */

import type { Employee, TaxStatus } from "@/types/database";
import type {
  PayrollLineInput,
  PayrollLineResult,
  PayrollRunInput,
  PayrollRunResult,
  PhilippinePayrollConstants,
} from "@/types/payroll";

/** Default constants (simplified; replace with official tables). */
export const DEFAULT_PH_CONSTANTS: PhilippinePayrollConstants = {
  sss: { employeeShareRate: 0.045, maxSalary: 25000 },
  philhealth: { rate: 0.05, minPremium: 500, maxPremium: 2500 },
  pagIbig: { employeeRate: 0.02, employerRate: 0.02 },
  withholdingTax: (taxableIncome: number, status: TaxStatus | null) => {
    // Simplified TRAIN-style tiers (monthly); for hourly/daily, annualize then prorate.
    const monthly = taxableIncome;
    if (monthly <= 20833) return 0;
    if (monthly <= 33333) return (monthly - 20833) * 0.2;
    if (monthly <= 66667) return 2500 + (monthly - 33333) * 0.25;
    if (monthly <= 166667) return 10833 + (monthly - 66667) * 0.3;
    if (monthly <= 666667) return 40833 + (monthly - 166667) * 0.32;
    return 200833 + (monthly - 666667) * 0.35;
  },
};

/**
 * Compute gross pay from hours and pay type.
 * Supports Regular, Overtime, Sick Leave, Paid Leave, and Holiday Pay.
 */
export function computeGrossPay(
  employee: Employee,
  regularHours: number,
  overtimeHours: number,
  sickLeaveHours: number = 0,
  paidLeaveHours: number = 0,
  holidayPayMultiplier: number = 1.0
): number {
  const { pay_type, pay_rate } = employee;
  let regular = 0;
  let overtime = 0;
  let sickLeave = 0;
  let paidLeave = 0;
  const otMultiplier = 1.25; // 125% for OT
  const holidayMultiplier = holidayPayMultiplier > 1.0 ? holidayPayMultiplier : 1.0;

  if (pay_type === "Hourly") {
    regular = regularHours * pay_rate;
    overtime = overtimeHours * pay_rate * otMultiplier;
    sickLeave = sickLeaveHours * pay_rate;
    paidLeave = paidLeaveHours * pay_rate;
  } else if (pay_type === "Monthly") {
    // Assume 22 days, 8 hours/day => 176 hours per month
    const hoursPerMonth = 176;
    const hourlyRate = pay_rate / hoursPerMonth;
    regular = regularHours * hourlyRate;
    overtime = overtimeHours * hourlyRate * otMultiplier;
    sickLeave = sickLeaveHours * hourlyRate;
    paidLeave = paidLeaveHours * hourlyRate;
  } else {
    // Daily
    const hoursPerDay = 8;
    const hourlyRate = pay_rate / hoursPerDay;
    regular = regularHours * hourlyRate;
    overtime = overtimeHours * hourlyRate * otMultiplier;
    sickLeave = sickLeaveHours * hourlyRate;
    paidLeave = paidLeaveHours * hourlyRate;
  }

  // Apply holiday multiplier to regular hours if enabled
  const holidayBonus = holidayMultiplier > 1.0 
    ? regular * (holidayMultiplier - 1.0)
    : 0;

  return Math.round((regular + overtime + sickLeave + paidLeave + holidayBonus) * 100) / 100;
}

/**
 * Compute SSS employee share (simplified).
 */
export function computeSSS(
  grossPay: number,
  constants: PhilippinePayrollConstants
): number {
  const maxSalary = constants.sss.maxSalary ?? 25000;
  const rate = constants.sss.employeeShareRate ?? 0.045;
  const basis = Math.min(grossPay, maxSalary);
  return Math.round(basis * rate * 100) / 100;
}

/**
 * Compute PhilHealth employee share (simplified).
 */
export function computePhilHealth(
  grossPay: number,
  constants: PhilippinePayrollConstants
): number {
  const { minPremium = 500, maxPremium = 2500, rate = 0.05 } = constants.philhealth;
  const premium = Math.min(Math.max(grossPay * rate, minPremium), maxPremium);
  const employeeShare = premium / 2; // 50% employee
  return Math.round(employeeShare * 100) / 100;
}

/**
 * Compute Pag-IBIG employee contribution (simplified).
 */
export function computePagIbig(
  grossPay: number,
  constants: PhilippinePayrollConstants
): number {
  const rate = constants.pagIbig.employeeRate ?? 0.02;
  const maxContribution = 100; // Example cap
  const contribution = Math.min(grossPay * rate, maxContribution);
  return Math.round(contribution * 100) / 100;
}

/**
 * Compute withholding tax (monthly basis; for semi-monthly divide by 2).
 */
export function computeWithholdingTax(
  taxableIncome: number,
  taxStatus: TaxStatus | null,
  constants: PhilippinePayrollConstants
): number {
  return Math.round(constants.withholdingTax(taxableIncome, taxStatus) * 100) / 100;
}

/**
 * Calculate a single payroll line (gross → deductions → net).
 */
export function calculatePayrollLine(
  input: PayrollLineInput,
  constants: PhilippinePayrollConstants = DEFAULT_PH_CONSTANTS
): PayrollLineResult {
  const {
    employee,
    regularHours,
    overtimeHours,
    sickLeaveHours = 0,
    paidLeaveHours = 0,
    holidayPayMultiplier = 1.0,
    grossOverride,
    taxOverride,
    sssOverride,
    philhealthOverride,
    pagIbigOverride,
    otherDeductionsOverride,
  } = input;

  const grossPay =
    grossOverride ??
    computeGrossPay(
      employee,
      regularHours,
      overtimeHours,
      sickLeaveHours,
      paidLeaveHours,
      holidayPayMultiplier
    );
  const taxableIncome = grossPay; // Simplify; subtract non-taxable benefits if needed.

  const sss = sssOverride ?? computeSSS(grossPay, constants);
  const philhealth = philhealthOverride ?? computePhilHealth(grossPay, constants);
  const pagIbig = pagIbigOverride ?? computePagIbig(grossPay, constants);
  const withholdingTax =
    taxOverride ?? computeWithholdingTax(taxableIncome, employee.tax_status, constants);
  const otherDeductions = otherDeductionsOverride ?? 0;

  const totalDeductions = sss + philhealth + pagIbig + withholdingTax + otherDeductions;
  const netPay = Math.round((grossPay - totalDeductions) * 100) / 100;

  const isManualOverride =
    grossOverride !== undefined ||
    taxOverride !== undefined ||
    sssOverride !== undefined ||
    philhealthOverride !== undefined ||
    pagIbigOverride !== undefined ||
    otherDeductionsOverride !== undefined;

  return {
    employeeId: employee.id,
    regularHours,
    overtimeHours,
    sickLeaveHours,
    paidLeaveHours,
    grossPay,
    taxableIncome,
    withholdingTax,
    sss,
    philhealth,
    pagIbig,
    otherDeductions,
    totalDeductions,
    netPay,
    isManualOverride,
  };
}

/**
 * Calculate full payroll run from period + lines.
 */
export function calculatePayrollRun(
  input: PayrollRunInput,
  constants: PhilippinePayrollConstants = DEFAULT_PH_CONSTANTS
): PayrollRunResult {
  const currency = input.currency ?? "PHP";
  const holidayMultiplier = input.holidayDoublePayEnabled ? 2.0 : 1.0;
  
  const lines = input.lines.map((line) =>
    calculatePayrollLine(
      {
        ...line,
        holidayPayMultiplier: line.holidayPayMultiplier ?? holidayMultiplier,
      },
      constants
    )
  );

  const totalGross = lines.reduce((s, l) => s + l.grossPay, 0);
  const totalDeductions = lines.reduce((s, l) => s + l.totalDeductions, 0);
  const totalNet = lines.reduce((s, l) => s + l.netPay, 0);

  return {
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    checkDate: input.checkDate,
    glPostDate: input.glPostDate,
    deliveryAddress: input.deliveryAddress,
    payoutMethod: input.payoutMethod,
    totalGross: Math.round(totalGross * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    totalNet: Math.round(totalNet * 100) / 100,
    currency,
    lines,
  };
}
