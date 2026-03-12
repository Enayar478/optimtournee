"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Route, CloudRain, Smartphone, ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "Tournées optimisées",
    description:
      "L'algo calcule le meilleur trajet entre vos clients. Moins de kilomètres, moins d'essence, plus de temps sur les chantiers.",
    image: "/images/feature-route-optimization.png",
    icon: Route,
    color: "#2D5A3D",
    gradient: "from-[#2D5A3D] to-[#4A90A4]",
  },
  {
    title: "Météo intégrée",
    description:
      "Pluie prévue ? Les entretiens pelouse se décalent automatiquement. Vos équipes reçoivent la tournée mise à jour le matin.",
    image: "/images/feature-weather-integration.png",
    icon: CloudRain,
    color: "#4A90A4",
    gradient: "from-[#4A90A4] to-[#2D5A3D]",
  },
  {
    title: "Sur le terrain",
    description:
      "Vos équipes voient leur tournée du jour, cliquent sur l'adresse pour naviguer, cochhent quand c'est fait. Rien de plus.",
    image: "/images/feature-mobile-app.png",
    icon: Smartphone,
    color: "#E07B39",
    gradient: "from-[#E07B39] to-[#F5A572]",
  },
];

export function FeaturesV2() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-white py-32"
    >
      {/* Background Decorations */}
      <motion.div
        className="absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-[#E8F5EC]/50 to-transparent"
        style={{ y }}
      />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#2D5A3D]/5 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#4A90A4]/5 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div
        ref={ref}
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          className="mx-auto mb-20 max-w-3xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E8F5EC] to-[#E8F4F7] px-4 py-2 text-sm font-medium text-[#2D5A3D]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2D5A3D] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2D5A3D]"></span>
            </span>
            Fonctionnalités clés
          </motion.div>

          <motion.h2
            className="text-foreground mb-6 text-4xl leading-tight font-bold lg:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Moins de temps sur la route,{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-transparent">
                plus de marge
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 h-1.5 rounded-full bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4]"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Les outils qu&apos;il vous manquait pour gérer vos tournées
            d&apos;entretien sans y passer des heures chaque semaine.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <motion.div
                className="relative h-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg"
                whileHover={{
                  y: -12,
                  boxShadow: "0 25px 50px -12px rgba(45, 90, 61, 0.25)",
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Image Container */}
                <motion.div
                  className="relative h-56 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#2D5A3D]/80 to-transparent pb-6"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="flex items-center gap-2 font-medium text-white"
                      initial={{ y: 20 }}
                      whileHover={{ y: 0 }}
                    >
                      En savoir plus
                      <ArrowUpRight className="h-5 w-5" />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="p-8">
                  <motion.div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </motion.div>

                  <motion.h3
                    className="text-foreground mb-3 text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Animated Line */}
                  <motion.div
                    className="mt-6 h-1 rounded-full bg-gradient-to-r from-transparent via-[#2D5A3D]/20 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Corner Decoration */}
                <motion.div
                  className="absolute top-4 right-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}20, transparent)`,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/demo"
              className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] px-8 py-4 font-semibold text-white shadow-xl transition-shadow hover:shadow-2xl"
            >
              Découvrir toutes les fonctionnalités
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight className="h-5 w-5" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
