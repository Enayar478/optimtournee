import { AdminLayout } from "@/components/layout/AdminLayout";

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
