"use client";

import { KpiCards } from "@/components/dashboard/kpi-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PayrollTableSection } from "@/components/dashboard/payroll-table-section";
import { DynamicSubheader } from "@/components/dashboard/dynamic-subheader";
import {
  mockDashboardKpis,
  mockPayrollRuns,
} from "@/data/mockData";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Dashboard
        </h1>
        <DynamicSubheader />
      </div>

      <KpiCards
        upcomingPayrollDate={mockDashboardKpis.upcomingPayrollCountdown}
        totalCashRequired={mockDashboardKpis.totalCashRequired}
        pendingTimesheets={mockDashboardKpis.pendingTimesheets}
        activeEmployees={mockDashboardKpis.activeEmployees}
      />

      <QuickActions showOneClickAutomate={false} />

      <PayrollTableSection payrollRuns={mockPayrollRuns} />
    </div>
  );
}
