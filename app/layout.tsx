import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OptimTournée - Optimisez vos itinéraires de chantier",
  description: "SaaS d'optimisation d'itinéraires pour les entreprises du paysagisme. Gagnez du temps et réduisez vos coûts de déplacement.",
  keywords: ["optimisation", "itinéraire", "paysagiste", "tournée", "planification", "SaaS"],
  authors: [{ name: "OptimTournée" }],
  openGraph: {
    title: "OptimTournée - Optimisez vos itinéraires de chantier",
    description: "Gagnez 2h par jour sur vos tournées d'entretien. Logiciel simple pour les paysagistes.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
