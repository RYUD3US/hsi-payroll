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

// THE SMART FORMATTER
const formatSmartly = (text: string) => {
  const acronyms = ["QA", "HR", "IT", "UI", "UX", "CEO", "CTO", "CFO", "COO", "VP", "PR", "R&D","GFX"];
  
  return text
    .split(' ')
    .map(word => {
      const upperWord = word.toUpperCase();
      // If the word is a known acronym, keep it uppercase
      if (acronyms.includes(upperWord)) return upperWord;
      
      // Otherwise, do Title Case
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export function SmartDepartmentInput({ value, onChange, fieldName, filterBy }: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getSuggestions() {
      if (fieldName === "role" && filterBy && !filterBy.value) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      let query = supabase.from("employees").select(fieldName);
      
      if (filterBy?.value) {
        query = query.ilike(filterBy.field, filterBy.value);
      }

      const { data } = await query;
      if (data) {
        const unique = Array.from(new Set(
          data.map((item: any) => item[fieldName]?.trim())
          .filter(Boolean)
          .map((s: string) => formatSmartly(s)) // Using the smart formatter here
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
          className="w-full justify-between bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800 h-9 sm:h-10 text-sm"
        >
          <span className="truncate">{value || `Select ${fieldName}...`}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-950 border-zinc-800">
        <Command className="bg-transparent" filter={(value, search) => {
          if (value.toLowerCase().includes(search.toLowerCase())) return 1;
          return 0;
        }}>
          <CommandInput 
            placeholder="Search or type new..." 
            onValueChange={(val) => onChange(val)} 
            className="text-zinc-100"
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty className="py-2 px-4 text-xs text-zinc-500">
              {loading ? <Loader2 className="animate-spin h-3 w-3" /> : `New ${fieldName}: "${value}"`}
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => {
                    onChange(item); 
                    setOpen(false);
                  }}
                  className="hover:bg-zinc-800 cursor-pointer flex items-center px-2 py-1.5 text-sm"
                >
                  <Check className={cn("mr-2 h-4 w-4 shrink-0", value === item ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{item}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}