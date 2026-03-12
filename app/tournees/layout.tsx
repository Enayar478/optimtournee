import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournées · OptimTournée",
  description: "Gérez et suivez vos tournées en cours et planifiées.",
};

export default function TourneesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
