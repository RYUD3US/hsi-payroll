"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockEmployees, mockTimesheets } from "@/data/mockData";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

export function WizardStepReviewTime({
  onNext,
}: {
  onNext: () => void;
}) {
  const [approved, setApproved] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    return mockEmployees.map((emp) => {
      const sheets = mockTimesheets.filter(
        (ts) => ts.employee_id === emp.id
      );
      const totalHours = sheets.reduce((s, ts) => s + ts.total_hours, 0);
      const hasMissing = sheets.some((ts) => ts.status === "Draft" || (ts.time_in == null && ts.time_out == null));
      const hasOvertime = totalHours > 8 * 5; // simple: > 40
      const status = sheets.every((ts) => ts.status === "Approved")
        ? "Approved"
        : sheets.some((ts) => ts.status === "Submitted")
          ? "Pending"
          : "Draft";
      return {
        employeeId: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        totalHours,
        status,
        hasMissing,
        hasOvertime,
      };
    });
  }, []);

  const toggleApprove = (employeeId: string) => {
    setApproved((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) next.delete(employeeId);
      else next.add(employeeId);
      return next;
    });
  };

  const bulkApprove = () => {
    setApproved(new Set(rows.map((r) => r.employeeId)));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Review employee hours. Approve time cards before proceeding. Warnings: overtime, missing punches, unapproved time.
      </p>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={bulkApprove}>
          Bulk approve all
        </Button>
      </div>
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Warnings</TableHead>
              <TableHead className="w-[120px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.employeeId}>
                <TableCell className="font-medium text-zinc-50">
                  {row.name}
                </TableCell>
                <TableCell className="text-zinc-400">{row.totalHours} hrs</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.status === "Approved"
                        ? "approved"
                        : row.status === "Submitted"
                          ? "submitted"
                          : "draft"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  {row.hasMissing && (
                    <span className="flex items-center gap-1 text-amber-500 text-xs">
                      <AlertTriangle className="h-3 w-3" /> Missing
                    </span>
                  )}
                  {row.hasOvertime && (
                    <span className="flex items-center gap-1 text-blue-400 text-xs">
                      <Clock className="h-3 w-3" /> OT
                    </span>
                  )}
                  {!row.hasMissing && !row.hasOvertime && row.status === "Approved" && (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleApprove(row.employeeId)}
                  >
                    {approved.has(row.employeeId) ? "Approved" : "Approve"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Enter Payroll</Button>
      </div>
    </div>
  );
}
