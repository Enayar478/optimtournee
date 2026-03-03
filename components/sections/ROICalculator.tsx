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
    const optimizationRate = 0.20;
    const workDaysPerMonth = 22;
    const avgSpeed = 35; // km/h en zone urbaine/périurbaine
    const co2PerKm = 0.12; // kg CO2/km pour véhicule utilitaire

    const kmSaved = Math.round(vehicles * kmPerDay * optimizationRate);
    const moneySaved = Math.round(kmSaved * fuelPrice * 0.08 * workDaysPerMonth); // 8L/100km
    const hoursSaved = Math.round((kmSaved / avgSpeed) * workDaysPerMonth * 10) / 10;
    const co2Saved = Math.round(kmSaved * co2PerKm * workDaysPerMonth);

    setResults({ kmSaved, moneySaved, hoursSaved, co2Saved });
  }, [vehicles, kmPerDay, fuelPrice]);

  const formatNumber = (num: number) => num.toLocaleString("fr-FR");

  return (
    <section className="py-20 bg-gradient-to-b from-forest-surface/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-economy-surface text-economy-dark px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Calculateur d'économies
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Calculez vos économies en{" "}
            <span className="text-economy">30 secondes</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Découvrez combien vous pourriez économiser chaque mois avec une 
            optimisation intelligente de vos tournées.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Sliders Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
            <h3 className="text-lg font-semibold mb-6">Votre situation actuelle</h3>
            
            <div className="space-y-8">
              {/* Véhicules */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Nombre de véhicules
                  </label>
                  <span className="text-2xl font-bold text-forest font-mono">{vehicles}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={vehicles}
                  onChange={(e) => setVehicles(Number(e.target.value))}
                  className="w-full h-2 bg-forest-surface rounded-lg appearance-none cursor-pointer accent-forest"
                />
              </div>

              {/* KM par jour */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Kilomètres par jour et véhicule
                  </label>
                  <span className="text-2xl font-bold text-forest font-mono">{kmPerDay} km</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="10"
                  value={kmPerDay}
                  onChange={(e) => setKmPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-forest-surface rounded-lg appearance-none cursor-pointer accent-forest"
                />
              </div>

              {/* Prix carburant */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Prix du carburant
                  </label>
                  <span className="text-2xl font-bold text-forest font-mono">{fuelPrice.toFixed(2)} €/L</span>
                </div>
                <input
                  type="range"
                  min="1.30"
                  max="2.00"
                  step="0.05"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  className="w-full h-2 bg-forest-surface rounded-lg appearance-none cursor-pointer accent-forest"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-forest rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-lg font-semibold mb-6 text-white/90">
              Vos économies mensuelles estimées
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="w-5 h-5 text-economy-light" />
                  <span className="text-sm text-white/80">Carburant</span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  {formatNumber(results.moneySaved)} €
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-sky-light" />
                  <span className="text-sm text-white/80">Kilomètres</span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  {formatNumber(results.kmSaved)} km
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-economy-light" />
                  <span className="text-sm text-white/80">Heures gagnées</span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  {results.hoursSaved} h
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-economy-light" />
                  <span className="text-sm text-white/80">CO₂ évité</span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  {formatNumber(results.co2Saved)} kg
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80">Économies annuelles estimées</span>
                <span className="text-4xl font-bold text-economy-light font-mono">
                  {formatNumber(results.moneySaved * 12)} €
                </span>
              </div>
              
              <TrackButton
                event={AnalyticsEvents.CTA_CALCULATOR_CLICK}
                variant="secondary"
                size="lg"
                className="w-full bg-white text-forest hover:bg-white/90"
              >
                Voir le détail de l'offre
              </TrackButton>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          * Calculs basés sur une optimisation moyenne de 20% des trajets. 
          Résultats variables selon les zones géographiques.
        </p>
      </div>
    </section>
  );
}
