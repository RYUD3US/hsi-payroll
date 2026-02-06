"use client";

// REMOVED: import { AppHeader } from "./header/app-header"; 

export function DarkThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}