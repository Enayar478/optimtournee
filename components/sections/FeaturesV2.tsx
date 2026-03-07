"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Route, CloudRain, Smartphone } from "lucide-react";

const features = [
  {
    title: "Tournées optimisées",
    description: "L'algo calcule le meilleur trajet entre vos clients. Moins de kilomètres, moins d'essence, plus de temps sur les chantiers.",
    image: "/images/feature-route-optimization.png",
    icon: Route
  },
  {
    title: "Météo intégrée",
    description: "Pluie prévue ? Les entretiens pelouse se décalent automatiquement. Vos équipes reçoivent la tournée mise à jour le matin.",
    image: "/images/feature-weather-integration.png",
    icon: CloudRain
  },
  {
    title: "Sur le terrain",
    description: "Vos équipes voient leur tournée du jour, cliquent sur l'adresse pour naviguer, cochhent quand c'est fait. Rien de plus.",
    image: "/images/feature-mobile-app.png",
    icon: Smartphone
  }
];

export function FeaturesV2() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-20 overflow-hidden bg-white">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-foreground mb-4 text-3xl font-bold lg:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Moins de temps sur la route,{" "}
            <span className="text-[#2D5A3D]">plus de marge en fin de mois</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Les outils qu&apos;il vous manquait pour gérer vos tournées d&apos;entretien.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl border border-gray-100"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <motion.div 
                className="relative h-48 overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </motion.div>
              
              <div className="p-6">
                <motion.div 
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F5EC]"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="h-5 w-5 text-[#2D5A3D]" />
                </motion.div>
                
                <h3 className="text-foreground mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
