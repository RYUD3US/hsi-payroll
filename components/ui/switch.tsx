"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  onChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, checked, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <div className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          checked ? "bg-zinc-100" : "bg-zinc-700"
        )}>
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            checked={checked}
            onChange={handleChange}
            {...props}
          />
          <span className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-zinc-950 shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5 bg-zinc-50" : "translate-x-1"
          )} />
        </div>
        {label && <span className="text-sm text-zinc-400">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
