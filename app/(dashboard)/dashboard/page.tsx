import { KpiCards } from "@/components/dashboard/kpi-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PayrollTableSection } from "@/components/dashboard/payroll-table-section";
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
        <p className="text-zinc-400">
          Overview of payroll and timesheet activity.
        </p>
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
