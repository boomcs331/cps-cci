import type { Metadata } from "next";
import { DashboardShell } from "./_components/dashboard-shell";
import { dashboardNavigation } from "../config/navigation";

export const metadata: Metadata = {
  title: "CPS - Dashboard",
  description: "CPS Production Management System dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell navItems={dashboardNavigation}>{children}</DashboardShell>;
}
