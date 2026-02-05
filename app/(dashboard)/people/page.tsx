import { mockEmployees } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            People
          </h1>
          <p className="text-zinc-400">
            Employee directory and pay information.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/people/add">
            <UserPlus className="h-4 w-4" /> Add Employee
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Pay Type</TableHead>
              <TableHead className="text-right">Pay Rate</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium text-zinc-50">
                  <Link href={`/people/${emp.id}`} className="hover:underline">
                    {emp.first_name} {emp.last_name}
                  </Link>
                </TableCell>
                <TableCell className="text-zinc-400">{emp.department}</TableCell>
                <TableCell className="text-zinc-400">{emp.pay_type}</TableCell>
                <TableCell className="text-right text-zinc-50">
                  {formatCurrency(emp.pay_rate)} {emp.pay_type === "Monthly" ? "/mo" : emp.pay_type === "Hourly" ? "/hr" : "/day"}
                </TableCell>
                <TableCell>
                  <Badge variant={emp.is_active ? "success" : "secondary"}>
                    {emp.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
