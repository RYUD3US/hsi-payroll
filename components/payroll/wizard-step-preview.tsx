"use client";

import { usePayrollWizardStore } from "@/stores/payroll-wizard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockEmployees } from "@/data/mockData";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSettingsStore } from "@/stores/settings-store";
import { Badge } from "@/components/ui/badge";

export function WizardStepPreview({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const {
    lineResults,
    periodStart,
    periodEnd,
    checkDate,
    glPostDate,
    deliveryAddress,
    payoutMethod,
    setDraft,
  } = usePayrollWizardStore();
  const { currency } = useSettingsStore();

  const totalGross = lineResults.reduce((s, l) => s + l.grossPay, 0);
  const totalDeductions = lineResults.reduce((s, l) => s + l.totalDeductions, 0);
  const totalNet = lineResults.reduce((s, l) => s + l.netPay, 0);
  const totalHours = lineResults.reduce((s, l) => s + l.regularHours + l.overtimeHours, 0);

  const handleFinishLater = () => {
    setDraft(true);
    onNext();
  };

  const handleApprove = () => {
    setDraft(false);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Cash Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-zinc-50">
              {formatCurrency(totalNet, currency)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {formatDate(periodStart)} – {formatDate(periodEnd)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Check Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-zinc-50">
              {formatDate(checkDate)}
            </p>
            {glPostDate && (
              <p className="text-xs text-zinc-500 mt-1">
                GL Post: {formatDate(glPostDate)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-zinc-50">
              {lineResults.length}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Total hours: {totalHours.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-zinc-50">
              {payoutMethod || "Direct Deposit"}
            </p>
            {deliveryAddress && (
              <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                {deliveryAddress}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-zinc-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                  <TableHead className="text-right">Gross Pay</TableHead>
                  <TableHead className="text-right">Taxes</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineResults.map((line) => {
                  const emp = mockEmployees.find((e) => e.id === line.employeeId);
                  const name = emp
                    ? `${emp.first_name} ${emp.last_name}`
                    : line.employeeId;
                  const totalHours =
                    line.regularHours + line.overtimeHours + (line.sickLeaveHours || 0) + (line.paidLeaveHours || 0);
                  const taxes = line.withholdingTax;
                  const otherDeductions =
                    line.sss + line.philhealth + line.pagIbig + line.otherDeductions;

                  return (
                    <TableRow key={line.employeeId}>
                      <TableCell className="font-medium text-zinc-50">
                        {name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Regular</Badge>
                      </TableCell>
                      <TableCell className="text-right text-zinc-400">
                        {totalHours.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-zinc-50">
                        {formatCurrency(line.grossPay, currency)}
                      </TableCell>
                      <TableCell className="text-right text-zinc-400">
                        {formatCurrency(taxes, currency)}
                      </TableCell>
                      <TableCell className="text-right text-zinc-400">
                        {formatCurrency(otherDeductions, currency)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-zinc-50">
                        {formatCurrency(line.netPay, currency)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Totals Row */}
                <TableRow className="border-t-2 border-zinc-700 font-medium">
                  <TableCell colSpan={2} className="text-zinc-50">
                    Totals
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {totalHours.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {formatCurrency(totalGross, currency)}
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {formatCurrency(
                      lineResults.reduce((s, l) => s + l.withholdingTax, 0),
                      currency
                    )}
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {formatCurrency(
                      lineResults.reduce(
                        (s, l) =>
                          s +
                          l.sss +
                          l.philhealth +
                          l.pagIbig +
                          l.otherDeductions,
                        0
                      ),
                      currency
                    )}
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {formatCurrency(totalNet, currency)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Totals */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-zinc-400">Payrun total:</span>
            <span className="ml-2 text-lg font-semibold text-zinc-50">
              {formatCurrency(totalNet, currency)}
            </span>
          </div>
          <div>
            <span className="text-sm text-zinc-400">Cash required:</span>
            <span className="ml-2 text-lg font-semibold text-zinc-50">
              {formatCurrency(totalNet, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleFinishLater} asChild>
            <Link href="/payroll">Finish Later</Link>
          </Button>
          <Button
            onClick={handleApprove}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
