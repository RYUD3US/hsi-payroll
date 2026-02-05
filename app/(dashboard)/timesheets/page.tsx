import { ApprovalQueue } from "@/components/timesheet/approval-queue";
import { mockTimesheets } from "@/data/mockData";

export default function TimesheetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Timesheets
        </h1>
        <p className="text-zinc-400">
          Approval queue — filter by Pending or History. Updates without page reload.
        </p>
      </div>

      <ApprovalQueue timesheets={mockTimesheets} />
    </div>
  );
}
