"use client";

import { usePayrollWizardStore } from "@/stores/payroll-wizard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { mockEmployees } from "@/data/mockData";
import Link from "next/link";

export function WizardStepPreview({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const { lineResults, periodStart, periodEnd, checkDate, setDraft } =
    usePayrollWizardStore();

  const totalGross = lineResults.reduce((s, l) => s + l.grossPay, 0);
  const totalDeductions = lineResults.reduce((s, l) => s + l.totalDeductions, 0);
  const totalNet = lineResults.reduce((s, l) => s + l.netPay, 0);

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
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <p className="text-sm text-zinc-400">
            Period: {periodStart} – {periodEnd} · Check date: {checkDate}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Total Gross</span>
              <span className="text-zinc-50">{formatCurrency(totalGross)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Total Deductions</span>
              <span className="text-zinc-50">{formatCurrency(totalDeductions)}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-2 font-medium text-zinc-50">
              <span>Total Net (Cash Required)</span>
              <span>{formatCurrency(totalNet)}</span>
            </div>
          </div>
          <ul className="text-xs text-zinc-500 space-y-1">
            {lineResults.map((l) => {
              const emp = mockEmployees.find((e) => e.id === l.employeeId);
              const name = emp ? `${emp.first_name} ${emp.last_name}` : l.employeeId;
              return (
                <li key={l.employeeId}>
                  {name}: {formatCurrency(l.netPay)}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleFinishLater} asChild>
            <Link href="/payroll">Finish Later (Save Draft)</Link>
          </Button>
          <Button onClick={handleApprove}>Approve</Button>
        </div>
      </div>
    </div>
  );
}
