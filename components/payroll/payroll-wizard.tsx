"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePayrollWizardStore, type WizardStep } from "@/stores/payroll-wizard-store";
import { WizardStepReviewTime } from "./wizard-step-review-time";
import { WizardStepEnterPayroll } from "./wizard-step-enter-payroll";
import { WizardStepPreview } from "./wizard-step-preview";
import { WizardStepConfirmation } from "./wizard-step-confirmation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const steps: { num: WizardStep; label: string }[] = [
  { num: 1, label: "Review Time Cards" },
  { num: 2, label: "Enter / Edit Payroll" },
  { num: 3, label: "Preview" },
  { num: 4, label: "Confirmation" },
];

export function PayrollWizard() {
  const { step, setStep } = usePayrollWizardStore();

  const goNext = useCallback(() => {
    if (step < 4) setStep((step + 1) as WizardStep);
  }, [step, setStep]);

  const goPrev = useCallback(() => {
    if (step > 1) setStep((step - 1) as WizardStep);
  }, [step, setStep]);

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map(({ num, label }) => (
          <React.Fragment key={num}>
            <div
              className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                step === num
                  ? "border-zinc-500 bg-zinc-800 text-zinc-50"
                  : step > num
                    ? "border-zinc-700 bg-zinc-800/50 text-zinc-400"
                    : "border-zinc-800 text-zinc-500"
              }`}
            >
              <span className="font-medium">{num}.</span>
              <span>{label}</span>
            </div>
            {num < 4 && (
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        {step === 1 && <WizardStepReviewTime onNext={goNext} />}
        {step === 2 && <WizardStepEnterPayroll onNext={goNext} onPrev={goPrev} />}
        {step === 3 && <WizardStepPreview onNext={goNext} onPrev={goPrev} />}
        {step === 4 && <WizardStepConfirmation />}
      </div>

      {/* Footer nav (when not on confirmation) */}
      {step < 4 && (
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <Button variant="ghost" asChild={step === 1} onClick={step === 1 ? undefined : goPrev}>
            {step === 1 ? (
              <Link href="/payroll">Cancel</Link>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Back
              </>
            )}
          </Button>
          {step < 3 && (
            <Button onClick={goNext}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
