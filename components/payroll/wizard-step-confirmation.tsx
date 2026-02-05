"use client";

import { usePayrollWizardStore } from "@/stores/payroll-wizard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle, Calendar, MapPin, CreditCard } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";

export function WizardStepConfirmation() {
  const { lineResults, periodStart, periodEnd, checkDate, glPostDate, deliveryAddress, payoutMethod, isDraft } =
    usePayrollWizardStore();
  const { currency } = useSettingsStore();

  const totalGrossSum = lineResults.reduce((s, l) => s + l.grossPay, 0);
  const totalDeductionsSum = lineResults.reduce((s, l) => s + l.totalDeductions, 0);
  const totalNetSum = lineResults.reduce((s, l) => s + l.netPay, 0);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <div className="relative">
          <CheckCircle className="h-20 w-20 text-emerald-500" />
          <div className="absolute inset-0 animate-ping">
            <CheckCircle className="h-20 w-20 text-emerald-500 opacity-20" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-emerald-500 mb-2">
            {isDraft ? "Draft Saved" : "Success!"}
          </h2>
          <p className="text-lg text-zinc-400">
            {isDraft
              ? "Your payroll draft has been saved."
              : "Your payroll has been submitted."}
          </p>
          {!isDraft && (
            <p className="text-sm text-zinc-500 mt-1">
              We've sent confirmation details to your email.
            </p>
          )}
        </div>
      </div>

      {/* Payroll Summary Card */}
      <Card className="border-zinc-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-400" />
              Payroll Summary
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cash Required - Prominent */}
          <div className="text-center py-4 border-b border-zinc-800">
            <p className="text-sm text-zinc-400 mb-2">Cash Required</p>
            <p className="text-4xl font-bold text-blue-500">
              {formatCurrency(totalNetSum, currency)}
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              This amount does not include service fees. An invoice will be sent separately.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Financial Details */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Pay Period</p>
                <p className="text-base font-medium text-zinc-50">
                  {formatDate(periodStart)} → {formatDate(periodEnd)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Net Pay</p>
                <p className="text-lg font-semibold text-zinc-50">
                  {formatCurrency(totalNetSum, currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Taxes & Deductions</p>
                <p className="text-lg font-semibold text-zinc-50">
                  {formatCurrency(totalDeductionsSum, currency)}
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-sm text-zinc-400 mb-1">Gross</p>
                <p className="text-lg font-semibold text-zinc-50">
                  {formatCurrency(totalGrossSum, currency)}
                </p>
              </div>
            </div>

            {/* Right Column - Dates & Delivery */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-400 mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Check Date
                </p>
                <p className="text-base font-medium text-zinc-50">
                  {formatDate(checkDate)}
                </p>
              </div>
              {glPostDate && (
                <div>
                  <p className="text-sm text-zinc-400 mb-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    GL Post Date
                  </p>
                  <p className="text-base font-medium text-zinc-50">
                    {formatDate(glPostDate)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-zinc-400 mb-1 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payout Method
                </p>
                <p className="text-base font-medium text-zinc-50">
                  {payoutMethod || "Direct Deposit"}
                </p>
              </div>
              {deliveryAddress && (
                <div>
                  <p className="text-sm text-zinc-400 mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivering to
                  </p>
                  <p className="text-base font-medium text-zinc-50">
                    {deliveryAddress}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Reminder */}
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-sm text-zinc-400">
              Want a reminder when your next payroll is due?{" "}
              <button className="text-blue-400 hover:text-blue-300 underline">
                Add to calendar
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/reports">View or manage Reports</Link>
        </Button>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/payroll">Done</Link>
        </Button>
      </div>
    </div>
  );
}
