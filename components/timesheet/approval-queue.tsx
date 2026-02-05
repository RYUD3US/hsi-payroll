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
import { formatDate } from "@/lib/utils";
import type { Timesheet } from "@/types/database";
import { mockEmployees } from "@/data/mockData";

export interface ApprovalQueueProps {
  timesheets: Timesheet[];
}

type FilterTab = "pending" | "history";

export function ApprovalQueue({ timesheets }: ApprovalQueueProps) {
  const [filter, setFilter] = useState<FilterTab>("pending");

  const filtered = useMemo(() => {
    if (filter === "pending") {
      return timesheets.filter(
        (ts) => ts.status === "Draft" || ts.status === "Submitted"
      );
    }
    return timesheets.filter(
      (ts) => ts.status === "Approved" || ts.status === "Rejected"
    );
  }, [timesheets, filter]);

  const employeeName = (employeeId: string) => {
    const emp = mockEmployees.find((e) => e.id === employeeId);
    return emp ? `${emp.first_name} ${emp.last_name}` : employeeId;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <Button
          variant={filter === "pending" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          Pending
        </Button>
        <Button
          variant={filter === "history" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilter("history")}
        >
          History
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                  No timesheets in this view.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ts) => (
                <TableRow key={ts.id}>
                  <TableCell className="font-medium text-zinc-50">
                    {employeeName(ts.employee_id)}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(ts.work_date)}
                  </TableCell>
                  <TableCell className="text-right text-zinc-50">
                    {ts.total_hours}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ts.status === "Approved"
                          ? "approved"
                          : ts.status === "Submitted"
                            ? "submitted"
                            : ts.status === "Rejected"
                              ? "rejected"
                              : "draft"
                      }
                    >
                      {ts.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(ts.status === "Draft" || ts.status === "Submitted") && (
                      <Button variant="outline" size="sm">
                        Approve
                      </Button>
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
