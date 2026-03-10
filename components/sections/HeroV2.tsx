"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Zap, Clock, Fuel, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroV2() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Background Image avec overlay */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero-v2-golden-hour.png"
          alt="Paysagiste au travail"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40" />
      </div>

      {/* Animated Mesh Gradient Overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#2D5A3D]/20 to-[#4A90A4]/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-l from-[#E07B39]/15 to-[#4A90A4]/15 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#2D5A3D]/10 via-transparent to-[#E07B39]/10 blur-3xl"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#2D5A3D]/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32"
        style={{ y, opacity }}
      >
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-white/90 backdrop-blur-md shadow-lg border border-[#2D5A3D]/10"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-transparent font-semibold">
                Planifiez vos tournées en 3 minutes
              </span>
              <Sparkles className="w-4 h-4 text-[#E07B39]" />
            </motion.div>

            <motion.h1
              className="text-foreground text-5xl leading-[1.1] font-bold lg:text-6xl xl:text-7xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Tondez plus,{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-[#2D5A3D] via-[#4A90A4] to-[#E07B39] bg-clip-text text-transparent">
                  roulez moins
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <motion.path
                    d="M0 4 Q50 0, 100 4 T200 4"
                    fill="none"
                    stroke="#E07B39"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground max-w-xl text-xl leading-relaxed lg:text-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Vos tournées d&apos;entretien,{" "}
              <span className="text-[#2D5A3D] font-medium">planifiées sans y penser</span>.
              Moins d&apos;essence, moins de temps perdu, plus de marge.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"
                />
                <Link
                  href="/sign-up"
                  className="relative inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] hover:from-[#1F3D29] hover:to-[#2D5A3D] transition-all duration-300 shadow-xl"
                >
                  Tester gratuitement
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl border-2 border-[#2D5A3D]/20 text-[#2D5A3D] hover:bg-[#2D5A3D]/5 hover:border-[#2D5A3D]/40 transition-all duration-300 backdrop-blur-sm"
                >
                  Voir comment ça marche
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-8 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { icon: Clock, text: "3 min", subtext: "Planification" },
                { icon: Fuel, text: "-20%", subtext: "Carburant" },
                { icon: MapPin, text: "100%", subtext: "Météo" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 group cursor-default"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="p-2.5 rounded-xl bg-gradient-to-br from-[#E8F5EC] to-[#E8F4F7] group-hover:from-[#2D5A3D] group-hover:to-[#4A90A4] transition-all duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    <item.icon className="h-5 w-5 text-[#2D5A3D] group-hover:text-white transition-colors" />
                  </motion.div>
                  <div>
                    <div className="text-xl font-bold text-[#2D5A3D]">{item.text}</div>
                    <div className="text-xs text-muted-foreground">{item.subtext}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="relative lg:scale-110"
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            style={{ scale }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <motion.div
                className="relative rounded-3xl bg-white/60 backdrop-blur-2xl p-3 shadow-2xl border border-white/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#E8F5EC] via-white to-[#E8F4F7] overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] flex items-center justify-between px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Zap className="h-6 w-6" />
                      </motion.div>
                      <span className="font-bold text-lg">OptimTournée</span>
                    </div>
                    <div className="text-sm font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">
                      Semaine du 3 mars
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      <motion.div
                        className="col-span-2 relative rounded-xl border-2 border-[#2D5A3D]/10 bg-white shadow-lg overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="absolute inset-0 opacity-15">
                          <svg viewBox="0 0 400 300" className="h-full w-full">
                            <motion.path
                              d="M50,150 Q100,100 150,150 T250,150 T350,100"
                              fill="none"
                              stroke="#2D5A3D"
                              strokeWidth="3"
                              strokeDasharray="8,4"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, delay: 1 }}
                            />
                            <motion.circle cx="80" cy="130" r="8" fill="#2D5A3D"
                              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
                            <motion.circle cx="180" cy="160" r="8" fill="#4A90A4"
                              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
                            <motion.circle cx="280" cy="140" r="8" fill="#E07B39"
                              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
                          </svg>
                        </div>
                        <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg border border-[#2D5A3D]/10">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Trajet optimisé</div>
                          <div className="text-[#2D5A3D] font-mono text-2xl font-bold">42 km</div>
                        </div>
                      </motion.div>

                      <div className="space-y-3">
                        {[
                          { name: "Dupont", time: "8h30", status: "done", color: "#22C55E" },
                          { name: "Martin", time: "9h45", status: "current", color: "#2D5A3D" },
                          { name: "Bernard", time: "11h00", status: "pending", color: "#94A3B8" },
                          { name: "Petit", time: "14h00", status: "pending", color: "#94A3B8" },
                        ].map((stop, i) => (
                          <motion.div
                            key={i}
                            className={`rounded-xl p-3 text-sm border-2 transition-all duration-300 ${
                              stop.status === "current"
                                ? "bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] text-white border-transparent shadow-lg"
                                : stop.status === "done"
                                  ? "bg-[#E8F5EC] text-[#1F3D29] border-[#2D5A3D]/20"
                                  : "bg-white text-gray-600 border-gray-100"
                            }`}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.15 }}
                            whileHover={{ scale: 1.05, x: -5 }}
                          >
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: stop.color }}
                                animate={stop.status === "current" ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              <div className="font-semibold">{stop.name}</div>
                            </div>
                            <div className="text-xs opacity-80 mt-1 pl-4">{stop.time}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -right-6 -bottom-6"
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="rounded-2xl px-6 py-4 text-white shadow-2xl border border-white/20"
                  style={{
                    background: "linear-gradient(135deg, #E07B39 0%, #F5A572 50%, #E07B39 100%)",
                    backgroundSize: "200% 200%",
                  }}
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                >
                  <motion.div
                    className="text-xs font-medium text-white/90 uppercase tracking-wider mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  >
                    Économie réelle
                  </motion.div>
                  <motion.div
                    className="font-mono text-3xl font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    -420€/mois
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
