import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Reports
        </h1>
        <p className="text-zinc-400">
          Payroll and timesheet reports (coming soon).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Library
          </CardTitle>
          <CardDescription>
            Generate payroll summary, tax reports, and timesheet exports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500">
            Report templates will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
