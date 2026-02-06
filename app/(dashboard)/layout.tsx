"use client";

import { DarkThemeLayout } from "@/components/layout/dark-theme-layout";
import { AppHeader } from "@/components/layout/header/app-header";
import { useEmployees } from "@/app/hooks/use-employees";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Fetch real data once here
  const { employees } = useEmployees();

  return (
    <DarkThemeLayout>
      <div className="flex min-h-screen flex-col">
        {/* Pass employees to header for the "People" live stats */}
        <AppHeader employees={employees} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </DarkThemeLayout>
  );
}