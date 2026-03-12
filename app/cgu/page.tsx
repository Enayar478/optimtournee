import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";

export const metadata: Metadata = {
  title: "CGU - OptimTournée",
  description: "Conditions Générales d'Utilisation d'OptimTournée.",
};

export default function CGUPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Conditions Générales d&apos;Utilisation</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold">1. Objet</h2>
              <p>
                Les présentes CGU régissent l&apos;utilisation de la plateforme OptimTournée,
                un service de planification et d&apos;optimisation de tournées pour les professionnels du paysage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Accès au service</h2>
              <p>
                L&apos;accès à OptimTournée nécessite la création d&apos;un compte. L&apos;utilisateur s&apos;engage
                à fournir des informations exactes et à maintenir la confidentialité de ses identifiants.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Utilisation du service</h2>
              <p>
                L&apos;utilisateur s&apos;engage à utiliser le service conformément à sa destination :
                la planification et l&apos;optimisation de tournées d&apos;entretien paysager.
                Toute utilisation abusive ou frauduleuse est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Responsabilité</h2>
              <p>
                OptimTournée fournit des suggestions d&apos;optimisation à titre indicatif.
                L&apos;utilisateur reste seul responsable de la planification finale de ses tournées
                et de la sécurité de ses équipes sur le terrain.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Résiliation</h2>
              <p>
                L&apos;utilisateur peut résilier son abonnement à tout moment depuis les paramètres de son compte.
                La résiliation prend effet à la fin de la période de facturation en cours.
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
