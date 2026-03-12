"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="OptimTournée"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-[#2D5A3D]">
              OptimTournée
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-gray-600 transition-colors hover:text-[#2D5A3D]"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#pricing"
              className="text-gray-600 transition-colors hover:text-[#2D5A3D]"
            >
              Tarifs
            </Link>
            <Link
              href="/demo"
              className="text-gray-600 transition-colors hover:text-[#2D5A3D]"
            >
              Démo
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="hidden text-gray-600 transition-colors hover:text-[#2D5A3D] sm:block"
            >
              Connexion
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/sign-up"
                className="rounded-lg bg-[#2D5A3D] px-4 py-2 text-white transition-colors hover:bg-[#3D7A52]"
              >
                Essayer gratuitement
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
