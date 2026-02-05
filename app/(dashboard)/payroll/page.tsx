import { PayrollTableSection } from "@/components/dashboard/payroll-table-section";
import { mockPayrollRuns } from "@/data/mockData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Payroll
          </h1>
          <p className="text-zinc-400">
            Manage payroll runs and view history.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/payroll/wizard">
            <Wallet className="h-4 w-4" />
            Run Payroll
          </Link>
        </Button>
      </div>

      <PayrollTableSection payrollRuns={mockPayrollRuns} />
    </div>
  );
}
