"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className = "", hoverEffect = true }: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/70 backdrop-blur-xl
        border border-white/50
        shadow-[0_8px_32px_rgba(45,90,61,0.1)]
        ${className}
      `}
      whileHover={hoverEffect ? {
        y: -8,
        boxShadow: "0 20px 60px rgba(45,90,61,0.2)",
        transition: { duration: 0.3 },
      } : {}}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-forest-surface/30 pointer-events-none" />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.5) 55%, transparent 60%)",
        }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
