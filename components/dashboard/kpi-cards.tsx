"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Wallet, FileCheck, Users } from "lucide-react";

export interface KpiCardsProps {
  upcomingPayrollDate: string;
  totalCashRequired: number;
  pendingTimesheets: number;
  activeEmployees: number;
}

export function KpiCards({
  upcomingPayrollDate,
  totalCashRequired,
  pendingTimesheets,
  activeEmployees,
}: KpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-zinc-400">
            Upcoming Payroll
          </span>
          <Calendar className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold text-zinc-50">
            {upcomingPayrollDate}
          </p>
          <p className="text-xs text-zinc-500">Check date</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-zinc-400">
            Total Cash Required
          </span>
          <Wallet className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold text-zinc-50">
            {formatCurrency(totalCashRequired)}
          </p>
          <p className="text-xs text-zinc-500">Last run net pay</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-zinc-400">
            Pending Timesheets
          </span>
          <FileCheck className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold text-zinc-50">
            {pendingTimesheets}
          </p>
          <p className="text-xs text-zinc-500">Awaiting approval</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-zinc-400">
            Active Employees
          </span>
          <Users className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold text-zinc-50">
            {activeEmployees}
          </p>
          <p className="text-xs text-zinc-500">Current headcount</p>
        </CardContent>
      </Card>
    </div>
  );
}
