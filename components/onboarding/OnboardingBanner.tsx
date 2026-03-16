"use client";

import { motion } from "framer-motion";
import { Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";

export function OnboardingBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] p-8 text-white shadow-xl"
    >
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <Rocket className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            Bienvenue sur OptimTournée !
          </h2>
          <p className="mt-2 text-white/80">
            Configurez votre espace en 4 étapes simples : entreprise, équipes,
            clients et contrats. Le système pourra ensuite planifier
            automatiquement vos tournées.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#2D5A3D] shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          Configurer
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </motion.div>
  );
}
