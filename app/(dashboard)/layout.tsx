"use client";

import { DarkThemeLayout } from "@/components/layout/dark-theme-layout";
import { useEmployees } from "@/app/hooks/use-employees";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { employees } = useEmployees();

  return (
    /* We pass the employees data into DarkThemeLayout so it can give it to the Header */
    <DarkThemeLayout employees={employees}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </DarkThemeLayout>
  );
}