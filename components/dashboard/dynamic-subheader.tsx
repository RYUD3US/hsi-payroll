"use client";

import { usePathname } from "next/navigation";

const subHeaders: Record<string, string> = {
  "/dashboard": "Overview of payroll and timesheet activity.",
  "/payroll": "Manage payroll runs and view history.",
  "/payroll/wizard": "Review time cards, enter payroll, and approve.",
  "/timesheets": "Approval queue — filter by Pending or History. Updates without page reload.",
  "/people": "Employee directory and pay information.",
  "/reports": "Payroll and timesheet reports.",
};

export function DynamicSubheader() {
  const pathname = usePathname();
  const subHeader = subHeaders[pathname] || subHeaders["/dashboard"];

  return <p className="text-zinc-400">{subHeader}</p>;
}
