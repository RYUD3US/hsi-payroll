"use client";

import { useTheme } from "next-themes";
import { useSettingsStore } from "@/stores/settings-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Settings, DollarSign, Navigation } from "lucide-react";
import { useEffect, useState } from "react";

export function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const {
    currency,
    setCurrency,
    browserNavButtonsEnabled,
    setBrowserNavButtonsEnabled,
    holidayDoublePayEnabled,
    setHolidayDoublePayEnabled,
  } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md border border-zinc-800 px-2 py-1.5 hover:bg-zinc-800 transition-colors">
          <Settings className="h-4 w-4 text-zinc-500" />
          <span className="text-sm text-zinc-400">Settings</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span>Theme</span>
          </div>
          <span className="text-xs text-zinc-500 capitalize">{theme}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Currency</DropdownMenuLabel>
        <div className="px-2 py-1.5">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="PHP">PHP - Philippine Peso</option>
            <option value="USD">USD - US Dollar</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
        <div className="px-2 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-zinc-500" />
            <span className="text-sm">Browser Navigation Buttons</span>
          </div>
          <Switch
            checked={browserNavButtonsEnabled}
            onChange={(checked) => setBrowserNavButtonsEnabled(checked)}
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Payroll</DropdownMenuLabel>
        <div className="px-2 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-zinc-500" />
            <span className="text-sm">Holiday Double Pay</span>
          </div>
          <Switch
            checked={holidayDoublePayEnabled}
            onChange={(checked) => setHolidayDoublePayEnabled(checked)}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
