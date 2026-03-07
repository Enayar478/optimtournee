"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Zap, Clock, Fuel } from "lucide-react";
import Link from "next/link";

export function HeroV2() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#E8F5EC] via-white to-[#E8F4F7]/30">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#2D5A3D]/10 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-[#4A90A4]/10 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-white shadow-lg border border-[#2D5A3D]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-[#2D5A3D] animate-pulse" />
              <span className="text-[#1F3D29]">Planifiez vos tournées en 3 minutes</span>
            </motion.div>

            <motion.h1
              className="text-foreground text-4xl leading-tight font-bold lg:text-5xl xl:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Tondez plus,{" "}
              <span className="text-[#2D5A3D]">roulez moins</span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground max-w-xl text-lg leading-relaxed lg:text-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Vos tournées d&apos;entretien, planifiées sans y penser. Moins
              d&apos;essence, moins de temps perdu, plus de marge en fin de
              mois.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl bg-[#2D5A3D] hover:bg-[#3D7A52] transition-colors shadow-lg"
                >
                  Tester gratuitement
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl border-2 border-[#2D5A3D] text-[#2D5A3D] hover:bg-[#E8F5EC] transition-colors"
                >
                  Voir comment ça marche
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-muted-foreground flex flex-wrap items-center gap-6 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { icon: Clock, text: "Planification en 3 min" },
                { icon: Fuel, text: "-20% de carburant" },
                { icon: MapPin, text: "Météo intégrée" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                >
                  <item.icon className="text-[#2D5A3D] h-4 w-4" />
                  {item.text}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl border bg-white p-4 shadow-2xl"
            >
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#E8F5EC] to-[#E8F4F7]/50 overflow-hidden">
                <div className="bg-[#2D5A3D] flex items-center justify-between px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold">OptimTournée</span>
                  </div>
                  <div className="text-sm text-white/80">Semaine du 3 mars</div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 h-full">
                    <div className="col-span-2 relative rounded-lg border bg-white overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 400 300" className="h-full w-full">
                          <path d="M50,150 Q100,100 150,150 T250,150 T350,100" fill="none" stroke="#2D5A3D" strokeWidth="2" strokeDasharray="5,5" />
                          <circle cx="80" cy="130" r="6" fill="#2D5A3D" />
                          <circle cx="180" cy="160" r="6" fill="#4A90A4" />
                          <circle cx="280" cy="140" r="6" fill="#E07B39" />
                        </svg>
                      </div>
                      <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 shadow-sm">
                        <div className="text-xs text-muted-foreground">Trajet optimisé</div>
                        <div className="text-[#2D5A3D] font-mono text-lg font-bold">42 km</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: "Dupont", time: "8h30", status: "done" },
                        { name: "Martin", time: "9h45", status: "current" },
                        { name: "Bernard", time: "11h00", status: "pending" },
                        { name: "Petit", time: "14h00", status: "pending" },
                      ].map((stop, i) => (
                        <motion.div
                          key={i}
                          className={`rounded-lg p-2 text-sm ${
                            stop.status === "current"
                              ? "bg-[#2D5A3D] text-white"
                              : stop.status === "done"
                                ? "bg-gray-100 text-gray-500"
                                : "border bg-white"
                          }`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        >
                          <div className="font-medium">{stop.name}</div>
                          <div className="text-xs opacity-80">{stop.time}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-4 -bottom-4 rounded-xl px-4 py-3 text-white shadow-xl"
              style={{ background: "linear-gradient(135deg, #E07B39, #F5A572)" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="text-xs font-medium text-white/90">Économie réelle</div>
              <div className="font-mono text-xl font-bold">-420€/mois</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
