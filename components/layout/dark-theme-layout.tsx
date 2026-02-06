"use client";

import { AppHeader } from "./header/app-header"; 
import { useEmployees } from "@/app/hooks/use-employees";

interface DarkThemeLayoutProps {
  children: React.ReactNode;
}

export function DarkThemeLayout({ children }: DarkThemeLayoutProps) {
  // Fetch data here to pass to the Header for live stats
  const { employees } = useEmployees();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* 1. The Header is OUTSIDE the max-w-7xl so the border-bottom is edge-to-edge.
          2. It is 'sticky' inside app-header.tsx, so it will stay at the top.
      */}
      <AppHeader employees={employees} /> 

      <main className="flex-1">
        {/* This container aligns your dashboard content (People table, stats) 
            with the indented header content.
        */}
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* SHADCN-COMPATIBLE SCROLLBAR:
          Styles the scrollbar without touching your global.css.
      */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a; /* zinc-800 */
          border-radius: 10px;
          border: 2px solid #09090b; /* zinc-950 creates 'floating' effect */
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46; /* zinc-700 */
        }
        /* Firefox Support */
        * {
          scrollbar-width: thin;
          scrollbar-color: #27272a transparent;
        }
      `}</style>
    </div>
  );
}