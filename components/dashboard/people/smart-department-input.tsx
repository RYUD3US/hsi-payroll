"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function SmartDepartmentInput({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function getDepartments() {
      const { data } = await supabase.from("employees").select("department");
      if (data) {
        // Clean data: unique values, proper casing, no nulls
        const uniqueDepts = Array.from(
          new Set(
            data
              .map((d) => d.department?.trim())
              .filter(Boolean)
              .map((d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase())
          )
        ).sort();
        setSuggestions(uniqueDepts as string[]);
      }
    }
    getDepartments();
  }, [supabase]);

  const handleSelect = (currentValue: string) => {
    // Format: "web dev" -> "Web dev"
    const formatted = currentValue.charAt(0).toUpperCase() + currentValue.slice(1).toLowerCase();
    onChange(formatted);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
        >
          {value || "Select or type department..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-900 border-zinc-800">
        <Command className="bg-zinc-900 text-zinc-50">
          <CommandInput 
            placeholder="Search or add new..." 
            onValueChange={(v) => onChange(v)}
            className="text-zinc-50"
          />
          <CommandList>
            <CommandEmpty className="p-2 text-xs text-zinc-500">
              Type to add "{value}" as a new department
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((dept) => (
                <CommandItem
                  key={dept}
                  value={dept}
                  onSelect={() => handleSelect(dept)}
                  className="aria-selected:bg-zinc-800 aria-selected:text-zinc-50"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === dept ? "opacity-100" : "opacity-0")} />
                  {dept}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}