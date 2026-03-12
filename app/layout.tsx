import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://optimtournee.fr"),
  title: "OptimTournée - Optimisez vos itinéraires de chantier",
  description:
    "SaaS d'optimisation d'itinéraires pour les entreprises du paysagisme. Gagnez du temps et réduisez vos coûts de déplacement.",
  keywords: [
    "optimisation",
    "itinéraire",
    "paysagiste",
    "tournée",
    "planification",
    "SaaS",
  ],
  authors: [{ name: "OptimTournée" }],
  openGraph: {
    title: "OptimTournée - Optimisez vos itinéraires de chantier",
    description:
      "Gagnez 2h par jour sur vos tournées d'entretien. Logiciel simple pour les paysagistes.",
    type: "website",
    locale: "fr_FR",
    url: "https://optimtournee.fr",
    siteName: "OptimTournée",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OptimTournée - Optimisation d'itinéraires pour paysagistes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OptimTournée - Optimisez vos itinéraires de chantier",
    description:
      "Gagnez 2h par jour sur vos tournées d'entretien. Logiciel simple pour les paysagistes.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "https://optimtournee.fr",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function Providers({ children }: { children: React.ReactNode }) {
  if (clerkPublishableKey) {
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="fr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PostHogProvider>{children}</PostHogProvider>
        </body>
      </html>
    </Providers>
  );
}
