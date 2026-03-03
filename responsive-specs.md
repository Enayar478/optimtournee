# OptimTournée — Responsive Breakpoints

## 📱 Mobile First Approach

Base: 320px → Scale up

```
┌─────────────────────────────────────────────────────────┐
│  MOBILE (Default: < 640px)                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                         │
│  ┌─────────────────────────────────────┐                │
│  │ [≡]        [LOGO]          [CTA]   │  Navbar sticky │
│  └─────────────────────────────────────┘                │
│                                                         │
│  ┌─────────────────────────────────────┐                │
│  │                                     │                │
│  │         [CARTE ANIMÉE]              │  100% width    │
│  │         280px height                │  Radius 16px   │
│  │                                     │                │
│  └─────────────────────────────────────┘                │
│                                                         │
│  Réduisez vos                         ← H1: 32px        │
│  trajets de 30%                                         │
│                                                         │
│  Sous-titre...                        ← Body 16px       │
│                                                         │
│  ┌─────────────────────────────────────┐                │
│  │  🚀 Voir ma simulation gratuite     │  Full width    │
│  └─────────────────────────────────────┘                │
│                                                         │
│  ─────────────────────────────────────                  │
│                                                         │
│  💰 Calculez vos économies            ← Section suivante│
│                                                         │
│  Nombre de véhicules: [━━━●━━━]       ← Slider touch   │
│  8 véhicules                                            │
│                                                         │
│  ┌─────────────────────────────────────┐                │
│  │  💶 ÉCONOMIES :                     │                │
│  │  1 247 € / mois                     │                │
│  └─────────────────────────────────────┘                │
│                                                         │
│  ...                                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TABLET (640px - 1023px)                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [LOGO]  Fonctionnalités  Tarifs    [CTA ▼]     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌──────────────────┐ ┌─────────────────────────────┐   │
│  │                  │ │                             │   │
│  │   "Réduisez      │ │    [CARTE                   │   │
│  │    vos           │ │     INTERACTIVE]            │   │
│  │    trajets"      │ │     400px                   │   │
│  │                  │ │                             │   │
│  │   [CTA]          │ │                             │   │
│  │                  │ └─────────────────────────────┘   │
│  └──────────────────┘                                   │
│                                                         │
│  Fonctionnalités :                                      │
│  ┌─────────────┐ ┌─────────────┐                        │
│  │  Feature 1  │ │  Feature 2  │  2 colonnes            │
│  └─────────────┘ └─────────────┘                        │
│  ┌─────────────┐ ┌─────────────┐                        │
│  │  Feature 3  │ │  Feature 4  │                        │
│  └─────────────┘ └─────────────┘                        │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  DESKTOP (≥ 1024px)                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ [LOGO]    Features    Pricing    Testimonials  [CTA]││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │                     │  │                          │ │
│  │   H1 (48px)         │  │   [CARTE INTERACTIVE]    │ │
│  │   "Réduisez vos     │  │   500px × 400px          │ │
│  │    trajets de 30%"  │  │                          │ │
│  │                     │  │   Animation Lottie       │ │
│  │   Subtitle          │  │   ou iframe OSM          │ │
│  │                     │  │                          │ │
│  │   [CTA Primary]     │  │                          │ │
│  │   [Link secondary]  │  │                          │ │
│  │                     │  │                          │ │
│  │   🏆 Trust badges   │  │                          │ │
│  │                     │  │                          │ │
│  └─────────────────────┘  └──────────────────────────┘ │
│                                                         │
│  Features: 3 colonnes                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │    1     │ │    2     │ │    3     │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│                                                         │
│  Pricing côte à côte avec highlight sur Pro             │
│  Témoignages: 3 colonnes                                │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  LARGE DESKTOP (≥ 1440px)                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Container max-width: 1280px centré                     │
│  Plus d'air sur les côtés                               │
│  Hero: peut passer à 3 colonnes avec trust logos        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Spécifications Techniques

### Breakpoints CSS (Tailwind par défaut)
```css
/* Mobile first - pas de media query nécessaire */

/* sm: 640px */
@media (min-width: 640px) { }

/* md: 768px */
@media (min-width: 768px) { }

/* lg: 1024px */
@media (min-width: 1024px) { }

/* xl: 1280px */
@media (min-width: 1280px) { }

/* 2xl: 1536px */
@media (min-width: 1536px) { }
```

### Grille Adaptative
```
Mobile:  1 colonne  (grid-cols-1)
Tablet:  2 colonnes (sm:grid-cols-2)
Desktop: 3 colonnes (lg:grid-cols-3)
Large:   4 colonnes si besoin (xl:grid-cols-4)
```

### Espacements Responsive
| Élément | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Section padding Y | 48px (py-12) | 64px (py-16) | 80px (py-20) |
| Container padding X | 16px (px-4) | 24px (px-6) | 32px (px-8) |
| Card padding | 20px (p-5) | 24px (p-6) | 32px (p-8) |
| Gap grid | 16px (gap-4) | 24px (gap-6) | 32px (gap-8) |

---

## 📝 Checklist Responsive

### Navigation
- [ ] Logo centré ou gauche selon breakpoint
- [ ] Menu hamburger < 768px avec animation
- [ ] Navigation pleine largeur ou drawer
- [ ] CTA toujours visible ou dans menu

### Hero
- [ ] Carte en haut sur mobile (priorité visuelle)
- [ ] Texte centré sur mobile, gauche sur desktop
- [ ] CTA full width sur mobile
- [ ] Trust badges empilés sur mobile

### Calculateur ROI
- [ ] Sliders full width touch-friendly
- [ ] Résultats empilés sur mobile
- [ ] Nombre de véhicules limité à affichage
- [ ] Scroll horizontal si nécessaire

### Témoignages
- [ ] Carousel avec swipe sur mobile
- [ ] Pagination dots visibles
- [ ] Grille sur desktop

### Images
- [ ] Lazy loading obligatoire
- [ ] Srcset pour différentes résolutions
- [ ] Images compressées WebP avec fallback

### Performance
- [ ] Pas d'animation lourde sur mobile
- [ ] Réduire particules/effets visuels
- [ ] Prioriser le contenu above the fold
