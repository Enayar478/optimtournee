import type { Metadata } from "next";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardV2 } from "@/components/sections/DashboardV2";

export const metadata: Metadata = {
  title: "Dashboard · OptimTournée",
  description: "Vue d'ensemble de vos tournées, équipes et indicateurs clés.",
};

export default function DashboardPage() {
  return (
    <AdminLayout>
      <DashboardV2 />
    </AdminLayout>
  );
}
