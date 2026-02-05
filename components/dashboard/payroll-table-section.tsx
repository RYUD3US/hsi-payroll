"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PayrollRun } from "@/types/database";
import { Search } from "lucide-react";

export interface PayrollTableSectionProps {
  payrollRuns: PayrollRun[];
}

const statusVariant = (
  status: PayrollRun["status"]
): "draft" | "approved" | "submitted" | "default" => {
  switch (status) {
    case "Draft":
      return "draft";
    case "Approved":
    case "Paid":
      return "approved";
    case "Processing":
      return "submitted";
    default:
      return "default";
  }
};

export function PayrollTableSection({ payrollRuns }: PayrollTableSectionProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = payrollRuns;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.period_start.toLowerCase().includes(q) ||
          r.period_end.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    return list;
  }, [payrollRuns, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-50">Recent Payroll</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search period..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-8"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-zinc-700 bg-zinc-900/50 px-3 text-sm text-zinc-50"
          >
            <option value="all">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="Processing">Processing</option>
            <option value="Approved">Approved</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Check Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total Gross</TableHead>
              <TableHead className="text-right">Total Net</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  No payroll runs found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-medium text-zinc-50">
                    {formatDate(run.period_start)} – {formatDate(run.period_end)}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(run.check_date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(run.status)}>
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {formatCurrency(run.total_gross)}
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {formatCurrency(run.total_net)}
                  </TableCell>
                  <TableCell>
                    {run.status === "Draft" && (
                      <Link
                        href={`/payroll/wizard?runId=${run.id}`}
                        className="text-sm text-zinc-400 hover:text-zinc-50"
                      >
                        Continue
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
