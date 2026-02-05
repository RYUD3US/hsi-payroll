import { create } from "zustand";
import type { PayrollLineResult } from "@/types/payroll";

export type WizardStep = 1 | 2 | 3 | 4;

interface PayrollWizardState {
  step: WizardStep;
  payrollRunId: string | null;
  periodStart: string;
  periodEnd: string;
  checkDate: string;
  glPostDate?: string;
  deliveryAddress?: string;
  payoutMethod?: string;
  /** Selected employee line results (step 2 → 3). */
  lineResults: PayrollLineResult[];
  /** Draft saved so user can "Finish Later". */
  isDraft: boolean;
  setStep: (step: WizardStep) => void;
  setPeriod: (start: string, end: string, checkDate: string, glPostDate?: string) => void;
  setDeliveryInfo: (address?: string, method?: string) => void;
  setLineResults: (lines: PayrollLineResult[]) => void;
  setPayrollRunId: (id: string | null) => void;
  setDraft: (isDraft: boolean) => void;
  reset: () => void;
}

const initialState = {
  step: 1 as WizardStep,
  payrollRunId: null,
  periodStart: "",
  periodEnd: "",
  checkDate: "",
  glPostDate: undefined,
  deliveryAddress: undefined,
  payoutMethod: undefined,
  lineResults: [],
  isDraft: false,
};

export const usePayrollWizardStore = create<PayrollWizardState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setPeriod: (periodStart, periodEnd, checkDate, glPostDate) =>
    set({ periodStart, periodEnd, checkDate, glPostDate }),
  setDeliveryInfo: (deliveryAddress, payoutMethod) =>
    set({ deliveryAddress, payoutMethod }),
  setLineResults: (lineResults) => set({ lineResults }),
  setPayrollRunId: (payrollRunId) => set({ payrollRunId }),
  setDraft: (isDraft) => set({ isDraft }),
  reset: () => set(initialState),
}));
