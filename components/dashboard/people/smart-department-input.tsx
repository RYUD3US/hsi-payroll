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
      setLoading(true);
      let query = supabase.from("employees").select(fieldName);
      
      if (filterBy?.value) {
        query = query.ilike(filterBy.field, filterBy.value);
      }

      const { data } = await query;
      if (data) {
        // Unique values + Smart Casing (Title Case)
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
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Search or type new..." 
            value={value}
            onValueChange={onChange}
            className="text-zinc-100"
          />
          <CommandList>
            <CommandEmpty className="py-2 px-4 text-xs text-zinc-500">
              {loading ? <Loader2 className="animate-spin h-3 w-3" /> : `Press enter to add "${value}"`}
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(cur) => {
                    onChange(cur === value ? "" : item);
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