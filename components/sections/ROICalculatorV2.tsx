"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Calculator,
  TrendingDown,
  Clock,
  Fuel,
  Leaf,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
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
      {prefix}
      {displayValue.toLocaleString("fr-FR")}
      {suffix}
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
  const hoursSaved =
    Math.round((kmSaved / avgSpeed) * workDaysPerMonth * 10) / 10;
  const co2Saved = Math.round(kmSaved * co2PerKm * workDaysPerMonth);

  return (
    <section ref={ref} className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-v2-van-journey.png"
          alt="Background"
          fill
          className="object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F5EC]/50 via-white to-[#FDF2EB]/30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E07B39]/20 bg-gradient-to-r from-[#FDF2EB] to-[#FDF2EB]/50 px-5 py-2.5 text-sm font-medium text-[#E07B39]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Calculator className="h-4 w-4" />
            Calculateur d&apos;économies
            <Sparkles className="h-4 w-4" />
          </motion.div>

          <motion.h2
            className="text-foreground mb-4 text-4xl font-bold lg:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Calculez vos économies en{" "}
            <span className="bg-gradient-to-r from-[#E07B39] to-[#F5A572] bg-clip-text text-transparent">
              30 secondes
            </span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Découvrez combien vous pourriez économiser chaque mois.
          </motion.p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Sliders Panel */}
          <motion.div
            className="rounded-3xl border border-white/50 bg-white/80 p-8 shadow-xl backdrop-blur-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-8 flex items-center gap-2 text-2xl font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D5A3D]/10">
                <Calculator className="h-5 w-5 text-[#2D5A3D]" />
              </span>
              Votre situation
            </h3>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-muted-foreground font-medium">
                    Nombre de véhicules
                  </label>
                  <motion.span
                    className="text-3xl font-bold text-[#2D5A3D]"
                    key={vehicles}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {vehicles}
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={vehicles}
                  onChange={(e) => setVehicles(Number(e.target.value))}
                  className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#2D5A3D]"
                  style={{
                    background: `linear-gradient(to right, #2D5A3D 0%, #2D5A3D ${((vehicles - 1) / 19) * 100}%, #e5e7eb ${((vehicles - 1) / 19) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-muted-foreground font-medium">
                    Kilomètres par jour
                  </label>
                  <motion.span
                    className="text-3xl font-bold text-[#2D5A3D]"
                    key={kmPerDay}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {kmPerDay} km
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="10"
                  value={kmPerDay}
                  onChange={(e) => setKmPerDay(Number(e.target.value))}
                  className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#2D5A3D]"
                  style={{
                    background: `linear-gradient(to right, #2D5A3D 0%, #2D5A3D ${((kmPerDay - 20) / 180) * 100}%, #e5e7eb ${((kmPerDay - 20) / 180) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-muted-foreground font-medium">
                    Prix du carburant
                  </label>
                  <motion.span
                    className="text-3xl font-bold text-[#2D5A3D]"
                    key={fuelPrice}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {fuelPrice.toFixed(2)} €
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="1.30"
                  max="2.00"
                  step="0.05"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#2D5A3D]"
                  style={{
                    background: `linear-gradient(to right, #2D5A3D 0%, #2D5A3D ${((fuelPrice - 1.3) / 0.7) * 100}%, #e5e7eb ${((fuelPrice - 1.3) / 0.7) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, #2D5A3D 0%, #1F3D29 50%, #2D5A3D 100%)",
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Background animation */}
            <motion.div
              className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <motion.div
              className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#4A90A4]/20 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            <div className="relative z-10">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white/80">
                <Sparkles className="h-5 w-5 text-[#E07B39]" />
                Vos économies mensuelles
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Fuel,
                    label: "Carburant",
                    value: moneySaved,
                    suffix: " €",
                    color: "#F5A572",
                  },
                  {
                    icon: TrendingDown,
                    label: "Kilomètres",
                    value: kmSaved,
                    suffix: " km",
                    color: "#6BB3C7",
                  },
                  {
                    icon: Clock,
                    label: "Heures gagnées",
                    value: hoursSaved,
                    suffix: " h",
                    color: "#F5A572",
                  },
                  {
                    icon: Leaf,
                    label: "CO₂ évité",
                    value: co2Saved,
                    suffix: " kg",
                    color: "#6BB3C7",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.15)",
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <stat.icon
                        className="h-5 w-5"
                        style={{ color: stat.color }}
                      />
                      <span className="text-sm text-white/70">
                        {stat.label}
                      </span>
                    </div>
                    <div className="font-mono text-3xl font-bold">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-6 border-t border-white/20 pt-6"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-white/80">
                    Économies annuelles estimées
                  </span>
                  <motion.span
                    className="font-mono text-4xl font-bold"
                    style={{
                      background: "linear-gradient(90deg, #F5A572, #E07B39)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <AnimatedCounter value={moneySaved * 12} suffix=" €" />
                  </motion.span>
                </div>

                <motion.button
                  className="w-full rounded-xl bg-white py-4 font-semibold text-[#2D5A3D] shadow-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Voir le détail de l&apos;offre
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
