import { DarkThemeLayout } from "@/components/layout/dark-theme-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DarkThemeLayout>{children}</DarkThemeLayout>;
}
