import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients · OptimTournée",
  description: "Consultez et gérez votre portefeuille clients.",
};

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
