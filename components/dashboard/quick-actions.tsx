"use client";

import Link from "next/link";
import { Wallet, UserPlus, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface QuickActionsProps {
  onRunPayroll?: () => void;
  onOneClickAutomate?: () => void;
  showOneClickAutomate?: boolean;
}

export function QuickActions({
  onRunPayroll,
  onOneClickAutomate,
  showOneClickAutomate = false,
}: QuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="default" size="sm" className="gap-2">
        <Link href="/payroll/wizard" onClick={onRunPayroll}>
          <Wallet className="h-4 w-4" />
          Run Payroll
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href="/people">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href="/reports">
          <FileText className="h-4 w-4" />
          View Reports
        </Link>
      </Button>
      {showOneClickAutomate && (
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={onOneClickAutomate}
        >
          <Zap className="h-4 w-4" />
          One-Click Automate
        </Button>
      )}
    </div>
  );
}
