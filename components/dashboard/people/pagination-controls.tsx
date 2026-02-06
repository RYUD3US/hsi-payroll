"use client";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalFound: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalFound,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-2 py-3 border-t border-zinc-800/50">
      <div className="text-[11px] text-zinc-500 italic">
        Page <span className="text-zinc-300 font-medium">{currentPage}</span> of{" "}
        <span className="text-zinc-300 font-medium">{totalPages || 1}</span>
        <span className="ml-2">({totalFound} total results)</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Rows:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-xs bg-zinc-900 border border-zinc-800 text-zinc-300">
                {pageSize} <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
              {/* Changed: Added 5, removed 100 */}
              {[5, 10, 25, 50].map((size) => (
                <DropdownMenuItem key={size} onClick={() => onPageSizeChange(size)}>
                  {size} rows
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-100 disabled:opacity-20"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((page, idx, arr) => (
                <div key={page} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-zinc-700 px-1 text-xs">...</span>}
                  <Button
                    variant="ghost" size="sm"
                    className={cn("h-8 w-8 text-xs font-bold", 
                      currentPage === page ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300")}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>

          <Button
            variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-100 disabled:opacity-20"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}