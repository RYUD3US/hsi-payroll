"use client";

import { AppHeader } from "./header/app-header"; 
import { useEmployees } from "@/app/hooks/use-employees";

export function DarkThemeLayout({ children }: { children: React.ReactNode }) {
  const { employees } = useEmployees();

  return (
    <div 
      className="min-h-screen bg-zinc-950 text-zinc-50 overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#27272a transparent', // zinc-800
      }}
    >
      {/* Edge-to-edge header line fix */}
      <AppHeader employees={employees} /> 

      <main className="flex-1">
        {/* Centered content container */}
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Inline Webkit Scrollbar Styling (The shadcn way to keep globals clean) */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a; /* zinc-800 */
          border-radius: 10px;
          border: 2px solid #09090b; /* zinc-950 */
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46; /* zinc-700 */
        }
      `}</style>
    </div>
  );
}