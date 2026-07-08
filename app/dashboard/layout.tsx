import type { Metadata } from "next";
import { DashboardShell } from "./_components/dashboard-shell";

export const metadata: Metadata = {
  title: "CPS - Dashboard",
  description: "CPS Production Management System dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
