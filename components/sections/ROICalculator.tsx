"use client";

import { useState, useEffect } from "react";
import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { Calculator, TrendingDown, Clock, Fuel, Leaf } from "lucide-react";

export function ROICalculator() {
  const [vehicles, setVehicles] = useState(3);
  const [kmPerDay, setKmPerDay] = useState(80);
  const [fuelPrice, setFuelPrice] = useState(1.65);
  const [results, setResults] = useState({
    kmSaved: 0,
    moneySaved: 0,
    hoursSaved: 0,
    co2Saved: 0,
  });

  useEffect(() => {
    // Calculs basés sur 20% d'optimisation des trajets
    const optimizationRate = 0.2;
    const workDaysPerMonth = 22;
    const avgSpeed = 35; // km/h en zone urbaine/périurbaine
    const co2PerKm = 0.12; // kg CO2/km pour véhicule utilitaire

    const kmSaved = Math.round(vehicles * kmPerDay * optimizationRate);
    const moneySaved = Math.round(
      kmSaved * fuelPrice * 0.08 * workDaysPerMonth
    ); // 8L/100km
    const hoursSaved =
      Math.round((kmSaved / avgSpeed) * workDaysPerMonth * 10) / 10;
    const co2Saved = Math.round(kmSaved * co2PerKm * workDaysPerMonth);

    setResults({ kmSaved, moneySaved, hoursSaved, co2Saved });
  }, [vehicles, kmPerDay, fuelPrice]);

  const formatNumber = (num: number) => num.toLocaleString("fr-FR");

  return (
    <section className="from-forest-surface/50 bg-gradient-to-b to-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="bg-economy-surface text-economy-dark mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <Calculator className="h-4 w-4" />
            Calculateur d&apos;économies
          </div>
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Calculez vos économies en{" "}
            <span className="text-economy">30 secondes</span>
          </h2>
          <p className="text-muted-foreground text-xl">
            Découvrez combien vous pourriez économiser chaque mois avec une
            optimisation intelligente de vos tournées.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Sliders Panel */}
          <div className="border-border rounded-2xl border bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-lg font-semibold">
              Votre situation actuelle
            </h3>

            <div className="space-y-8">
              {/* Véhicules */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-muted-foreground text-sm font-medium">
                    Nombre de véhicules
                  </label>
                  <span className="text-forest font-mono text-2xl font-bold">
                    {vehicles}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={vehicles}
                  onChange={(e) => setVehicles(Number(e.target.value))}
                  className="bg-forest-surface accent-forest h-2 w-full cursor-pointer appearance-none rounded-lg"
                />
              </div>

              {/* KM par jour */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-muted-foreground text-sm font-medium">
                    Kilomètres par jour et véhicule
                  </label>
                  <span className="text-forest font-mono text-2xl font-bold">
                    {kmPerDay} km
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="10"
                  value={kmPerDay}
                  onChange={(e) => setKmPerDay(Number(e.target.value))}
                  className="bg-forest-surface accent-forest h-2 w-full cursor-pointer appearance-none rounded-lg"
                />
              </div>

              {/* Prix carburant */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-muted-foreground text-sm font-medium">
                    Prix du carburant
                  </label>
                  <span className="text-forest font-mono text-2xl font-bold">
                    {fuelPrice.toFixed(2)} €/L
                  </span>
                </div>
                <input
                  type="range"
                  min="1.30"
                  max="2.00"
                  step="0.05"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  className="bg-forest-surface accent-forest h-2 w-full cursor-pointer appearance-none rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-forest rounded-2xl p-8 text-white shadow-lg">
            <h3 className="mb-6 text-lg font-semibold text-white/90">
              Vos économies mensuelles estimées
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Fuel className="text-economy-light h-5 w-5" />
                  <span className="text-sm text-white/80">Carburant</span>
                </div>
                <div className="font-mono text-3xl font-bold">
                  {formatNumber(results.moneySaved)} €
                </div>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingDown className="text-sky-light h-5 w-5" />
                  <span className="text-sm text-white/80">Kilomètres</span>
                </div>
                <div className="font-mono text-3xl font-bold">
                  {formatNumber(results.kmSaved)} km
                </div>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="text-economy-light h-5 w-5" />
                  <span className="text-sm text-white/80">Heures gagnées</span>
                </div>
                <div className="font-mono text-3xl font-bold">
                  {results.hoursSaved} h
                </div>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Leaf className="text-economy-light h-5 w-5" />
                  <span className="text-sm text-white/80">CO₂ évité</span>
                </div>
                <div className="font-mono text-3xl font-bold">
                  {formatNumber(results.co2Saved)} kg
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-white/80">
                  Économies annuelles estimées
                </span>
                <span className="text-economy-light font-mono text-4xl font-bold">
                  {formatNumber(results.moneySaved * 12)} €
                </span>
              </div>

              <TrackButton
                event={AnalyticsEvents.CTA_CALCULATOR_CLICK}
                variant="secondary"
                size="lg"
                className="text-forest w-full bg-white hover:bg-white/90"
              >
                Voir le détail de l&apos;offre
              </TrackButton>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          * Calculs basés sur une optimisation moyenne de 20% des trajets.
          Résultats variables selon les zones géographiques.
        </p>
      </div>
    </section>
  );
}
