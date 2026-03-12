import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";

export const metadata: Metadata = {
  title: "Mentions légales - OptimTournée",
  description: "Mentions légales du site OptimTournée.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Mentions légales</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold">Éditeur du site</h2>
              <p>
                OptimTournée<br />
                Email : <a href="mailto:contact@optimtournee.fr" className="text-[#2D5A3D] hover:underline">contact@optimtournee.fr</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Hébergement</h2>
              <p>
                Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, logos, icônes) est protégé par le droit d&apos;auteur.
                Toute reproduction, même partielle, est interdite sans autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Responsabilité</h2>
              <p>
                Les informations fournies sur ce site le sont à titre indicatif. OptimTournée ne saurait
                garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations diffusées.
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
