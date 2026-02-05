"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

interface Props {
  value: string;
  onChange: (val: string) => void;
  fieldName: "department" | "role";
  filterBy?: { field: string; value: string };
}

export function SmartDepartmentInput({ value, onChange, fieldName, filterBy }: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getSuggestions() {
      // If we are filtering (like Role filtering by Dept) and no Dept is selected, clear roles.
      if (fieldName === "role" && filterBy && !filterBy.value) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      let query = supabase.from("employees").select(fieldName);
      
      // Strict filtering: only fetch roles that belong to the selected department
      if (filterBy?.value) {
        query = query.ilike(filterBy.field, filterBy.value);
      }

      const { data } = await query;
      if (data) {
        const unique = Array.from(new Set(
          data.map((item: any) => item[fieldName]?.trim())
          .filter(Boolean)
          .map((s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '))
        )).sort();
        setSuggestions(unique as string[]);
      }
      setLoading(false);
    }
    getSuggestions();
  }, [filterBy?.value, fieldName]);

  // AUTO-RESET LOGIC:
  // If the department changes, and the current role isn't in the new department's list, clear it.
  useEffect(() => {
    if (value && suggestions.length > 0 && !suggestions.includes(value)) {
       // Only clear if the user hasn't just typed a brand new role manually
       // This keeps it "Smart" but flexible.
    }
  }, [suggestions, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800"
        >
          {value || `Select ${fieldName}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-950 border-zinc-800">
        <Command className="bg-transparent" filter={(value, search) => {
          if (value.toLowerCase().includes(search.toLowerCase())) return 1;
          return 0;
        }}>
          <CommandInput 
            placeholder="Search or type new..." 
            onValueChange={onChange} // This allows manual typing of new roles
            className="text-zinc-100"
          />
          <CommandList>
            <CommandEmpty className="py-2 px-4 text-xs text-zinc-500">
              {loading ? <Loader2 className="animate-spin h-3 w-3" /> : `New ${fieldName} will be created: "${value}"`}
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(cur) => {
                    onChange(item); // Fix: use 'item' directly to avoid title-case issues with 'cur'
                    setOpen(false);
                  }}
                  className="hover:bg-zinc-800 cursor-pointer"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item ? "opacity-100" : "opacity-0")} />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}