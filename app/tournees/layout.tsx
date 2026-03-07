import { AdminLayout } from "@/components/layout/AdminLayout";

export default function TourneesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
