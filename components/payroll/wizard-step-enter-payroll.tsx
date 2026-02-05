"use client";

import { useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockEmployees, mockTimesheets } from "@/data/mockData";
import { usePayrollWizardStore } from "@/stores/payroll-wizard-store";
import { calculatePayrollRun } from "@/lib/payroll-engine";
import type { PayrollLineInput } from "@/types/payroll";
import { formatCurrency } from "@/lib/utils";

export function WizardStepEnterPayroll({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const { setLineResults, periodStart, periodEnd, checkDate, setPeriod } =
    usePayrollWizardStore();

  const defaults = useMemo(() => {
    const periodStart = "2025-02-01";
    const periodEnd = "2025-02-15";
    const checkDate = "2025-02-20";
    const lines: PayrollLineInput[] = mockEmployees.map((emp) => {
      const sheets = mockTimesheets.filter(
        (ts) => ts.employee_id === emp.id && ts.status === "Approved"
      );
      const totalHours = sheets.reduce((s, ts) => s + ts.total_hours, 0);
      const regularHours = Math.min(totalHours, 80);
      const overtimeHours = Math.max(0, totalHours - 80);
      return {
        employee: emp,
        regularHours,
        overtimeHours,
      };
    });
    const result = calculatePayrollRun({
      periodStart,
      periodEnd,
      checkDate,
      lines,
    });
    return { result, periodStart, periodEnd, checkDate };
  }, []);

  useEffect(() => {
    if (!periodStart) {
      setPeriod(
        defaults.periodStart,
        defaults.periodEnd,
        defaults.checkDate
      );
    }
    setLineResults(defaults.result.lines);
  }, [defaults, periodStart, setPeriod, setLineResults]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Pre-populated from approved time and base salary. Edit if needed; overrides will be highlighted.
      </p>
      <div className="rounded-lg border border-zinc-800 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="text-right">Regular Hrs</TableHead>
              <TableHead className="text-right">OT Hrs</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defaults.result.lines.map((line) => {
              const emp = mockEmployees.find((e) => e.id === line.employeeId);
              const name = emp ? `${emp.first_name} ${emp.last_name}` : line.employeeId;
              return (
                <TableRow key={line.employeeId}>
                  <TableCell className="font-medium text-zinc-50">
                    {name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="h-8 w-20 text-right"
                      defaultValue={line.regularHours}
                      readOnly
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="h-8 w-20 text-right"
                      defaultValue={line.overtimeHours}
                      readOnly
                    />
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {formatCurrency(line.grossPay)}
                  </TableCell>
                  <TableCell className="text-right text-zinc-400">
                    {formatCurrency(line.totalDeductions)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-zinc-50">
                    {formatCurrency(line.netPay)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext}>Continue to Preview</Button>
      </div>
    </div>
  );
}
