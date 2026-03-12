import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équipes · OptimTournée",
  description: "Organisez vos équipes et gérez leurs membres.",
};

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
