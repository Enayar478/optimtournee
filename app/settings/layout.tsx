import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paramètres · OptimTournée",
  description: "Configurez votre compte, notifications et préférences.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
