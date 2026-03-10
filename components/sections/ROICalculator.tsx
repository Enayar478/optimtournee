"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { Calculator, TrendingDown, Clock, Fuel, Leaf } from "lucide-react";
import Image from "next/image";

function AnimatedCounter({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.round(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString('fr-FR')}{suffix}
    </span>
  );
}

export function ROICalculatorV2() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [vehicles, setVehicles] = useState(3);
  const [kmPerDay, setKmPerDay] = useState(80);
  const [fuelPrice, setFuelPrice] = useState(1.65);
  
  const optimizationRate = 0.2;
  const workDaysPerMonth = 22;
  const avgSpeed = 35;
  const co2PerKm = 0.12;
  
  const kmSaved = Math.round(vehicles * kmPerDay * optimizationRate);
  const moneySaved = Math.round(kmSaved * fuelPrice * 0.08 * workDaysPerMonth);
  const hoursSaved = Math.round((kmSaved / avgSpeed) * workDaysPerMonth * 10) / 10;
  const co2Saved = Math.round(kmSaved * co2PerKm * workDaysPerMonth);

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/savings-celebration.png"
          alt="Savings background"
          fill
          className="object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-surface/50 via-white to-white" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mx-auto mb-12 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-economy-surface text-economy-dark mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          >
            <Calculator className="h-4 w-4" />
            Calculateur d&apos;économies
          </div>
          
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Calculez vos économies en{" "}
            <span className="text-economy">30 secondes</span>
          </h2>
          
          <p className="text-muted-foreground text-xl">
            Découvrez combien vous pourriez économiser chaque mois avec une optimisation intelligente de vos tournées.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Sliders Panel */}
          <motion.div 
            className="rounded-2xl border bg-white/80 backdrop-blur-xl p-8 shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-6 text-lg font-semibold">Votre situation actuelle</h3>

            <div className="space-y-8">
              {/* Véhicules */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-muted-foreground text-sm font-medium">Nombre de véhicules</label>
                  <span className="text-forest font-mono text-2xl font-bold">{vehicles}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={vehicles}
                  onChange={(e) => setVehicles(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-forest/20 accent-forest"
                />
              </div>

              {/* KM par jour */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-muted-foreground text-sm font-medium">Kilomètres par jour et véhicule</label>
                  <span className="text-forest font-mono text-2xl font-bold">{kmPerDay} km</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="10"
                  value={kmPerDay}
                  onChange={(e) => setKmPerDay(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-forest/20 accent-forest"
                />
              </div>

              {/* Prix carburant */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-muted-foreground text-sm font-medium">Prix du carburant</label>
                  <span className="text-forest font-mono text-2xl font-bold">{fuelPrice.toFixed(2)} €/L</span>
                </div>
                <input
                  type="range"
                  min="1.30"
                  max="2.00"
                  step="0.05"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-forest/20 accent-forest"
                />
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div 
            className="bg-forest rounded-2xl p-8 text-white shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h3 className="mb-6 text-lg font-semibold text-white/90 relative z-10">Vos économies mensuelles estimées</h3>

            <div className="grid grid-cols-2 gap-6 relative z-10">
              <motion.div 
                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Fuel className="text-economy-light h-5 w-5" />
                  <span className="text-sm text-white/80">Carburant</span>
                </div>
                <div className="font-mono text-3xl font-bold">
                  <AnimatedCounter value={moneySaved} suffix=" €" />
                </div>
              </motion.div>

              <motion.div 
                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <TrendingDown className="text-sky-light h-5 w-5" />
                  <span className="text-sm text-white/80">Kilomètres</span>
                </div>
                <div className="font-mono text-3xl font-bold">
                  <AnimatedCounter value={kmSaved} suffix=" km" />
                </div>
              </motion.div>

              <motion.div 
                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="text-economy-light h-5 w-5" />
                  <span className="text-sm text-white/80">Heures gagnées</span>
                </div>
                <div className="font-mono text-3xl font-bold">
                  <AnimatedCounter value={hoursSaved} /> h
                </div>
              </motion.div>

              <motion.div 
                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Leaf className="text-economy-light h-5 w-5" />
                  <span className="text-sm text-white/80">CO₂ évité</span>
                </div>
                <div className="font-mono text-3xl font-bold">
                  <AnimatedCounter value={co2Saved} suffix=" kg" />
                </div>
              </motion.div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6 relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-white/80">Économies annuelles estimées</span>
                <span className="text-economy-light font-mono text-4xl font-bold">
                  <AnimatedCounter value={moneySaved * 12} suffix=" €" />
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
