import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planning · OptimTournée",
  description: "Planifiez et visualisez vos tournées hebdomadaires.",
};

export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
