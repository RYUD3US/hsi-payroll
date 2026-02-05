"use client";

import { AppHeader } from "./app-header";

export function DarkThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <AppHeader />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
