import { AdminLayout } from "@/components/layout/AdminLayout";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
