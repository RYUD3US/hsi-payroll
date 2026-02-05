import { PayrollWizard } from "@/components/payroll/payroll-wizard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function PayrollWizardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/payroll">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Run Payroll
          </h1>
          <p className="text-zinc-400">
            Review time cards, enter payroll, and approve.
          </p>
        </div>
      </div>

      <PayrollWizard />
    </div>
  );
}
