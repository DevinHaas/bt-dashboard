import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Screenshot Uploads",
  description:
    "Monitor user screenshot uploads and identify users who need follow-up",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
