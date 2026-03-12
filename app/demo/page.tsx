import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import RouteOptimizerDemoClient from "@/components/map/RouteOptimizerDemoClient";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Démo - OptimTournée",
  description:
    "Testez notre outil d'optimisation d'itinéraires en direct avec prise en compte de la météo.",
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white pt-20">
        {/* Hero */}
        <div className="container mx-auto px-4 pt-12 pb-8 text-center">
          <div className="mx-auto max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E8F5EC] to-[#E8F4F7] px-4 py-2 text-sm font-medium text-[#2D5A3D]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2D5A3D] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2D5A3D]" />
              </span>
              Démonstration interactive
            </span>
            <h1 className="mt-4 text-4xl font-bold text-gray-900 lg:text-5xl">
              Optimisez vos tournées en{" "}
              <span className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-transparent">
                3 étapes
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Découvrez comment OptimTournée planifie automatiquement les
              tournées de vos équipes en tenant compte de la météo, des
              compétences et de la proximité géographique.
            </p>
          </div>

          {/* Steps indicator */}
          <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-4">
            {[
              { num: 1, label: "Vos clients" },
              { num: 2, label: "Génération" },
              { num: 3, label: "Résultat" },
            ].map((step, i) => (
              <div key={step.num} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] text-sm font-bold text-white">
                    {step.num}
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {step.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className="mb-4 h-0.5 w-16 bg-gradient-to-r from-[#2D5A3D]/30 to-[#4A90A4]/30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo content */}
        <div className="container mx-auto px-4 pb-8">
          <RouteOptimizerDemoClient />
        </div>

        {/* CTA */}
        <div className="border-t border-gray-100 bg-white py-16 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Prêt à optimiser vos tournées ?
            </h2>
            <p className="mt-3 text-gray-600">
              Créez votre compte gratuitement et commencez à planifier vos
              tournées en quelques minutes.
            </p>
            <Link
              href="/sign-up"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-8 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
