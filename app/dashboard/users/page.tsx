import type { Metadata } from "next";
import { UsersPageClient } from "./_components/users-page-client";

export const metadata: Metadata = {
  title: "CPS - User Management",
  description: "Manage CPS access-control users",
};

export default function UsersPage() {
  return <UsersPageClient />;
}
