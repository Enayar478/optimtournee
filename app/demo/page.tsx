import type { Metadata } from "next";
import RouteOptimizerDemoClient from "@/components/map/RouteOptimizerDemoClient";

export const metadata: Metadata = {
  title: "Démo - OptimTournée",
  description: "Testez notre outil d'optimisation d'itinéraires en direct avec prise en compte de la météo.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Démonstration interactive</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Découvrez comment OptimTournée génère automatiquement des plannings optimisés
            en tenant compte de la météo, des contraintes d&apos;équipes et des récurrences clients.
            Cette démo utilise des données fictives pour illustrer le fonctionnement.
          </p>
        </div>

        <RouteOptimizerDemoClient />
      </div>
    </div>
  );
}
