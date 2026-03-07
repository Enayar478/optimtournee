# 🎨 OptimTournée - Évolution Design V2

## Vue d'ensemble

Cette évolution repousse les limites de l'UI/UX actuelle avec :
- **Animations cinématiques** au scroll et au hover
- **Effets visuels audacieux** (glassmorphism, particules, gradients dynamiques)
- **Interactions fluides** avec smooth scroll et parallax
- **Images immersives** et vidéos d'ambiance
- **Micro-interactions** qui surprennent et délightent

---

## 🎯 Pages à capturer (pour @apollon_lumiere_bot)

### 1. Landing Page (`/`)
**Éléments à capturer :**
- Hero avec mockup animé de l'app
- Calculateur d'économies interactif
- Grille de fonctionnalités avec hover effects
- Témoignages en carousel
- Section Pricing
- CTA finale

**Zones clés en screenshots :**
- Hero entier (1920x1080)
- Section calculateur (focus sur les résultats)
- Cards fonctionnalités
- Section témoignages

### 2. Dashboard (`/dashboard`)
**Éléments à capturer :**
- Vue d'ensemble avec métriques
- Carte des tournées
- Liste des interventions
- Widgets météo

### 3. Demo (`/demo`)
**Éléments à capturer :**
- Interface complète de l'app
- Carte interactive
- Panneau latéral

### 4. Clients (`/clients`)
**Éléments à capturer :**
- Liste des clients
- Fiche client détaillée
- Carte avec localisation

### 5. Équipes (`/teams`)
**Éléments à capturer :**
- Planning d'équipe
- Vue calendrier
- Assignation des tournées

---

## ✨ Nouvelles Animations & Effets

### 1. Smooth Scroll Global
```typescript
// hooks/useSmoothScroll.ts
"use client";

import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Easing personnalisé pour les ancres
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const id = anchor.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
}
```

### 2. Scroll-Triggered Animations (Framer Motion)
```typescript
// components/animations/FadeInWhenVisible.tsx
"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

export function FadeInWhenVisible({ 
  children, 
  delay = 0, 
  direction = 'up',
  duration = 0.6 
}: FadeInWhenVisibleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {}}
      transition={{ 
        duration, 
        delay,
        ease: [0.22, 1, 0.36, 1] // ease-out-expo
      }}
    >
      {children}
    </motion.div>
  );
}
```

### 3. Parallax Hero Effect
```typescript
// components/animations/ParallaxHero.tsx
"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ParallaxHero({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}
```

### 4. Staggered Grid Animation
```typescript
// components/animations/StaggerContainer.tsx
"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
}

export function StaggerContainer({ children, staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
}
```

### 5. Magnetic Button Effect
```typescript
// components/animations/MagneticButton.tsx
"use client";

import { motion } from 'framer-motion';
import { useRef, useState, ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ 
  children, 
  className = "", 
  strength = 0.3 
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}
```

### 6. Text Reveal Animation
```typescript
// components/animations/TextReveal.tsx
"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const words = text.split(" ");

  return (
    <motion.span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
```

### 7. Gradient Background Animation
```typescript
// components/animations/AnimatedGradient.tsx
"use client";

import { motion } from 'framer-motion';

export function AnimatedGradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(45,90,61,0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(74,144,164,0.12) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
```

### 8. Floating Card Animation
```typescript
// components/animations/FloatingCard.tsx
"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({ children, className = "", delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}
```

### 9. Counter Animation
```typescript
// components/animations/AnimatedCounter.tsx
"use client";

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ 
  value, 
  suffix = "", 
  prefix = "",
  className = "",
  duration = 2
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });
  
  const display = useTransform(spring, (current) => 
    Math.round(current).toLocaleString('fr-FR')
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
```

### 10. Glassmorphism Card
```typescript
// components/ui/GlassCard.tsx
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
        boxShadow: "0_20px_60px_rgba(45,90,61,0.2)",
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-forest-surface/30 pointer-events-none" />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
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
```

---

## 🎨 Classes TailwindCSS Avancées

### Gradients Animés
```css
/* globals.css additions */
@layer utilities {
  /* Gradient text animé */
  .gradient-text-animated {
    @apply bg-gradient-to-r from-forest via-sky to-economy bg-clip-text text-transparent;
    background-size: 200% auto;
    animation: gradient-shift 3s ease infinite;
  }

  @keyframes gradient-shift {
    0%, 100% { background-position: 0% center; }
    50% { background-position: 100% center; }
  }

  /* Mesh gradient background */
  .mesh-gradient {
    background-color: #E8F5EC;
    background-image: 
      radial-gradient(at 40% 20%, hsla(145,60%,70%,1) 0px, transparent 50%),
      radial-gradient(at 80% 0%, hsla(189,60%,75%,1) 0px, transparent 50%),
      radial-gradient(at 0% 50%, hsla(340,60%,85%,1) 0px, transparent 50%),
      radial-gradient(at 80% 50%, hsla(145,60%,70%,1) 0px, transparent 50%),
      radial-gradient(at 0% 100%, hsla(22,60%,75%,1) 0px, transparent 50%),
      radial-gradient(at 80% 100%, hsla(189,60%,70%,1) 0px, transparent 50%),
      radial-gradient(at 0% 0%, hsla(340,60%,80%,1) 0px, transparent 50%);
  }

  /* Glass effect */
  .glass {
    @apply bg-white/70 backdrop-blur-xl border border-white/50;
    box-shadow: 0 8px 32px rgba(45, 90, 61, 0.1);
  }

  .glass-dark {
    @apply bg-forest/80 backdrop-blur-xl border border-forest-light/30;
    box-shadow: 0 8px 32px rgba(31, 61, 41, 0.3);
  }

  /* Glow effects */
  .glow-forest {
    box-shadow: 0 0 40px rgba(45, 90, 61, 0.3);
  }

  .glow-economy {
    box-shadow: 0 0 40px rgba(224, 123, 57, 0.4);
  }

  .glow-sky {
    box-shadow: 0 0 40px rgba(74, 144, 164, 0.3);
  }

  /* Animated underline */
  .animated-underline {
    @apply relative;
  }
  
  .animated-underline::after {
    content: '';
    @apply absolute bottom-0 left-0 w-0 h-0.5 bg-forest transition-all duration-300;
  }
  
  .animated-underline:hover::after {
    @apply w-full;
  }

  /* Spotlight effect */
  .spotlight {
    @apply relative overflow-hidden;
  }
  
  .spotlight::before {
    content: '';
    @apply absolute inset-0 opacity-0 transition-opacity duration-500;
    background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(45,90,61,0.15) 0%, transparent 50%);
  }
  
  .spotlight:hover::before {
    @apply opacity-100;
  }

  /* Card shine */
  .card-shine {
    @apply relative overflow-hidden;
  }
  
  .card-shine::after {
    content: '';
    @apply absolute inset-0 -translate-x-full;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: transform 0.6s;
  }
  
  .card-shine:hover::after {
    @apply translate-x-full;
  }

  /* Floating animation */
  .float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  /* Pulse glow */
  .pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(224, 123, 57, 0.4); }
    50% { box-shadow: 0 0 40px rgba(224, 123, 57, 0.6); }
  }

  /* Smooth scroll container */
  .scroll-smooth {
    scroll-behavior: smooth;
  }

  /* Hide scrollbar but keep functionality */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Stagger animation delays */
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }
}
```

---

## 🖼️ Intégration d'Images

### Types d'images recommandées :

1. **Photos authentiques de paysagistes**
   - Équipes au travail
   - Véhicules d'entreprise
   - Équipement professionnel
   - Jardins entretenus (résultats)

2. **Illustrations 3D isométriques**
   - Interface de l'application
   - Workflow de planification
   - Carte avec trajets optimisés

3. **Icônes animées**
   - Lottie animations pour les features
   - Micro-interactions sur hover

4. **Vidéos d'ambiance**
   - Hero background vidéo (loop, autoplay, muted)
   - Démonstration de l'app en action
   - Témoignages vidéo

### Optimisation :
```typescript
// next.config.ts addition
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
}
```

---

## 📱 Responsive Animations

```typescript
// hooks/useReducedMotion.ts
"use client";

import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

---

## 🎯 Checklist Implémentation

- [ ] Installer Framer Motion : `npm install framer-motion`
- [ ] Créer les hooks d'animation
- [ ] Créer les composants animés réutilisables
- [ ] Mettre à jour globals.css avec les nouvelles utilities
- [ ] Intégrer les images/vidéos dans public/images
- [ ] Capturer les screenshots de toutes les pages
- [ ] Tester les animations sur mobile
- [ ] Vérifier prefers-reduced-motion
- [ ] Optimiser les performances (will-change, etc.)
