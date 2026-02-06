"use client";

import { AppHeader } from "./header/app-header"; 
import { useEmployees } from "@/app/hooks/use-employees";

// FIX: Define the props interface to include employees
interface DarkThemeLayoutProps {
  children: React.ReactNode;
  employees?: any[]; // The '?' makes it optional to avoid other errors
}

export function DarkThemeLayout({ children, employees = [] }: DarkThemeLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* The Header is outside the container for the full-width line.
        Passing employees here fixes the "Live Stats" showing 0.
      */}
      <AppHeader employees={employees} /> 

      <main className="flex-1">
        {/* max-w-7xl ensures your table stays centered */}
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
          border: 2px solid #09090b;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}