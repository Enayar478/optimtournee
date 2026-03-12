import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";

export const metadata: Metadata = {
  title: "Politique de confidentialité - OptimTournée",
  description:
    "Politique de confidentialité et de protection des données d'OptimTournée.",
};

export default function ConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-foreground mb-8 text-3xl font-bold">
            Politique de confidentialité
          </h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold">1. Données collectées</h2>
              <p>
                Nous collectons les données nécessaires au fonctionnement du
                service : nom, email, adresse professionnelle, coordonnées de
                vos clients, et données d&apos;utilisation de la plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                2. Finalité du traitement
              </h2>
              <p>
                Vos données sont utilisées pour : fournir le service
                d&apos;optimisation de tournées, gérer votre compte, améliorer
                nos algorithmes, et vous contacter concernant votre abonnement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                3. Hébergement et sécurité
              </h2>
              <p>
                Les données sont hébergées sur des serveurs sécurisés en Europe
                (Supabase, région Frankfurt). Nous utilisons le chiffrement en
                transit (TLS) et au repos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Vos droits</h2>
              <p>
                Conformément au RGPD, vous disposez d&apos;un droit
                d&apos;accès, de rectification, de suppression et de portabilité
                de vos données. Pour exercer ces droits, contactez-nous à{" "}
                <a
                  href="mailto:contact@optimtournee.fr"
                  className="text-[#2D5A3D] hover:underline"
                >
                  contact@optimtournee.fr
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Cookies</h2>
              <p>
                Nous utilisons des cookies essentiels au fonctionnement du
                service (authentification, session) et des cookies analytiques
                (PostHog) pour comprendre l&apos;utilisation de la plateforme.
              </p>
            </section>
          </div>

          <div className="mt-12">
            <Link href="/" className="text-[#2D5A3D] hover:underline">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
