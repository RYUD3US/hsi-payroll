"use client";

import { usePayrollWizardStore } from "@/stores/payroll-wizard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export function WizardStepConfirmation() {
  const { lineResults, isDraft } = usePayrollWizardStore();

  const totalGrossSum = lineResults.reduce((s, l) => s + l.grossPay, 0);
  const totalDeductionsSum = lineResults.reduce((s, l) => s + l.totalDeductions, 0);
  const totalNetSum = lineResults.reduce((s, l) => s + l.netPay, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle className="h-16 w-16 text-emerald-500" />
        <h2 className="text-xl font-semibold text-zinc-50">
          {isDraft ? "Draft Saved" : "Payroll Submitted"}
        </h2>
        <p className="text-zinc-400">
          {isDraft
            ? "You can continue this payroll run later from the Payroll list."
            : "Success! Payroll has been approved."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Cash Required</CardTitle>
          <p className="text-2xl font-semibold text-zinc-50">
            {formatCurrency(totalNetSum)}
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-400">
          <div className="flex justify-between">
            <span>Net Pay</span>
            <span className="text-zinc-50">{formatCurrency(totalNetSum)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Deductions</span>
            <span className="text-zinc-50">{formatCurrency(totalDeductionsSum)}</span>
          </div>
          <div className="flex justify-between border-t border-zinc-800 pt-2">
            <span>Gross</span>
            <span className="text-zinc-50">{formatCurrency(totalGrossSum)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/payroll">Back to Payroll</Link>
        </Button>
      </div>
    </div>
  );
}
