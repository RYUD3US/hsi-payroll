import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "PHP" | "USD" | "JPY" | "EUR" | "GBP";
export type Theme = "dark" | "light";

interface SettingsState {
  currency: Currency;
  theme: Theme;
  browserNavButtonsEnabled: boolean;
  holidayDoublePayEnabled: boolean;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: Theme) => void;
  setBrowserNavButtonsEnabled: (enabled: boolean) => void;
  setHolidayDoublePayEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: "PHP",
      theme: "dark",
      browserNavButtonsEnabled: true,
      holidayDoublePayEnabled: false,
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      setBrowserNavButtonsEnabled: (enabled) => set({ browserNavButtonsEnabled: enabled }),
      setHolidayDoublePayEnabled: (enabled) => set({ holidayDoublePayEnabled: enabled }),
    }),
    {
      name: "hsi-payroll-settings",
    }
  )
);
