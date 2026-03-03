# 🚀 OptimTournée - Architecture Technique

> **Projet:** Landing page SaaS pour PME paysagistes  
> **Deadline:** Archi J+2 | Livraison J+12  
> **Architecte:** Héphaïstos (@hephaistos)  
> **Designer:** Apollon (@apollon)

---

## 📊 Stack Technique Recommandée

### 🥇 Choix Principal: **Next.js 15 + Vercel**

| Critère | Next.js | Astro | Remarque |
|---------|---------|-------|----------|
| **SEO** | ⭐⭐⭐ Excellent | ⭐⭐⭐ Excellent | Les deux génèrent du SSG |
| **Interactivité** | ⭐⭐⭐ Native | ⭐⭐ Partial Hydration | Demo interactive nécessaire |
| **Écosystème React** | ⭐⭐⭐ Complet | ⭐⭐ Compatible | Composants réutilisables |
| **Cartographie** | ⭐⭐⭐ Leaflet/React-Map-GL | ⭐⭐ Wrapper nécessaire | Next.js = intégration directe |
| **Courbe d'apprentissage** | ⭐⭐ Modérée | ⭐⭐⭐ Simple | Équipe à l'aise avec React |
| **Vercel Integration** | ⭐⭐⭐ Native | ⭐⭐⭐ Native | Edge functions, analytics |

### Pourquoi Next.js ?

1. **Demo Interactive Requise** : L'utilisateur doit pouvoir tester l'optimisation d'itinéraire → besoin d'état React, pas juste du HTML statique
2. **SSR/SSG Flexibility** : Landing pages statiques (SEO) + pages dynamiques (dashboard demo)
3. **API Routes** : Proxy pour OpenWeatherMap (sécuriser la clé API) sans backend séparé
4. **Edge Functions** : Géolocalisation rapide, rate limiting
5. **Image Optimization** : Next/Image pour les screenshots produit

---

## 🏗️ Architecture du Projet

```
optimtournee/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (marketing)/              # Groupe route landing
│   │   ├── page.tsx                 # Landing page principale
│   │   ├── layout.tsx               # Layout marketing (sans nav complexe)
│   │   ├── 📁 demo/                 # Demo interactive
│   │   │   └── page.tsx             # Preview de l'outil
│   │   └── 📁 pricing/              # Page tarifs
│   │
│   ├── 📁 api/                      # API Routes (Edge)
│   │   ├── 📁 weather/              # Proxy OpenWeatherMap
│   │   │   └── route.ts
│   │   └── 📁 route/                # Optimisation d'itinéraire (mock/demo)
│   │       └── optimize/route.ts
│   │
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Tailwind + styles globaux
│
├── 📁 components/
│   ├── 📁 ui/                       # Composants shadcn/ui (boutons, inputs...)
│   ├── 📁 sections/                 # Sections landing page
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── DemoPreview.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTASection.tsx
│   ├── 📁 map/                      # Composants cartographie
│   │   ├── OpenStreetMap.tsx        # Wrapper Leaflet
│   │   ├── RouteOptimizer.tsx       # Logique optimisation
│   │   └── WeatherOverlay.tsx       # Affichage météo
│   └── 📁 analytics/                # Tracking composants
│       └── TrackButton.tsx
│
├── 📁 lib/
│   ├── 📁 utils/
│   │   ├── cn.ts                    # Merge classes tailwind
│   │   └── format.ts                # Formatage données
│   ├── 📁 hooks/
│   │   ├── useGeolocation.ts
│   │   ├── useWeather.ts            # Fetch météo via API route
│   │   └── useRouteOptimizer.ts     # Mock/algos optimisation
│   └── 📁 services/
│       ├── weather.ts               # Service OpenWeatherMap
│       └── routing.ts               # Service OSRM (OpenStreetMap Routing)
│
├── 📁 styles/
│   └── (Tailwind config in globals.css)
│
├── 📁 public/
│   ├── 📁 images/
│   │   ├── hero-screenshot.png
│   │   └── demo-mockup.png
│   └── fonts/
│
├── 📁 types/
│   └── index.ts                     # Types TypeScript
│
├── .env.local                       # Variables d'environnement (local)
├── .env.production                  # Variables production
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📦 Dépendances Critiques

### Core
```json
{
  "next": "^15.x",
  "react": "^19.x",
  "react-dom": "^19.x",
  "typescript": "^5.x"
}
```

### Styling & UI
```json
{
  "tailwindcss": "^4.x",
  "@tailwindcss/postcss": "^4.x",
  "class-variance-authority": "^0.7.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "lucide-react": "^0.x",
  "@radix-ui/react-*": "latest"
}
```

### Cartographie
```json
{
  "leaflet": "^1.9.x",
  "react-leaflet": "^5.x",
  "@types/leaflet": "^1.9.x",
  "leaflet-defaulticon-compatibility": "^0.1.x"
}
```

> **Alternative cartographie:** `react-map-gl` si besoin WebGL plus tard, mais Leaflet est plus léger pour une landing page.

### Analytics
```json
{
  "posthog-js": "^1.x"
}
```

### Dev Tools
```json
{
  "@types/node": "^22.x",
  "@types/react": "^19.x",
  "eslint": "^9.x",
  "eslint-config-next": "^15.x"
}
```

---

## 🔌 Intégrations

### 1. OpenStreetMap (OSM)

**Service:** Leaflet + tuiles OSM (gratuit)

```typescript
// lib/services/routing.ts
// Utilisation de OSRM (Open Source Routing Machine) via demo server
// ou GraphHopper pour l'optimisation de tournée

const OSRM_BASE = 'https://router.project-osrm.org';
const GRAPHHOPPER_API = 'https://graphhopper.com/api/1'; // Nécessite clé gratuite

export interface Waypoint {
  lat: number;
  lng: number;
  address?: string;
}

export async function optimizeRoute(waypoints: Waypoint[]): Promise<Route> {
  // Appel API pour TSP (Traveling Salesman Problem)
  // Retourne ordre optimisé + géométrie
}
```

**Clés API nécessaires:**
- ✅ OSM: Gratuit, pas de clé requise pour les tuiles (respecter usage policy)
- ⚠️ GraphHopper: Clé gratuite (5000 requêtes/jour) pour l'optimisation TSP

### 2. OpenWeatherMap

**Service:** API Current Weather + Forecast

```typescript
// app/api/weather/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
  );
  
  const data = await response.json();
  return NextResponse.json(data);
}
```

**Clés API nécessaires:**
- ✅ Compte gratuit sur openweathermap.org
- ✅ Clé API (activation sous 2h après création)
- ✅ Limites: 1000 requêtes/jour (gratuit)

### 3. PostHog (Analytics)

**Setup:**
```typescript
// lib/analytics/posthog.ts
import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      }
    });
  }
};

// Tracking events
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  posthog.capture(event, properties);
};
```

**Événements à tracker:**
- `landing_hero_view` - Vue de la landing
- `demo_interaction` - Utilisation de la demo
- `cta_click` - Clic sur bouton CTA
- `signup_intent` - Clic sur "Essayer gratuitement"
- `demo_route_optimized` - Route optimisée dans la demo

---

## 🔧 Variables d'Environnement

### Local (.env.local)
```bash
# OpenWeatherMap
OPENWEATHER_API_KEY=your_api_key_here

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=ph_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# GraphHopper (si utilisé pour routing avancé)
GRAPHHOPPER_API_KEY=your_key_here
```

### Production (Vercel)
```bash
# Mêmes variables + 
NEXT_PUBLIC_APP_URL=https://optimtournee.fr
```

---

## 🚀 Déploiement & CI/CD

### Vercel Configuration

**vercel.json:**
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "npm install",
  "regions": ["cdg1"]
}
```

### GitHub Actions (/.github/workflows/ci.yml)
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

### Branches Git
```
main       → Production (Vercel auto-deploy)
develop    → Staging (preview Vercel)
feature/*  → Branches de features (preview Vercel PR)
```

---

## 📅 Timeline Technique

| Jour | Livrable | Responsable |
|------|----------|-------------|
| **J+1** | Setup repo, CI/CD, déploiement initial | @hephaistos |
| **J+2** | Architecture validée, structure composants | @hephaistos |
| **J+3** | Intégration OSM + carte fonctionnelle | @hephaistos |
| **J+4** | Intégration météo + overlay | @hephaistos |
| **J+5** | Demo interactive (ajout points, optimisation) | @hephaistos |
| **J+6** | Setup analytics + tracking | @hephaistos |
| **J+7** | Review avec @apollon, ajustements | Both |
| **J+8-10** | Intégration maquettes @apollon | @apollon + @hephaistos |
| **J+11** | Tests, optimisation perf | @hephaistos |
| **J+12** | Livraison finale | Both |

---

## ❓ Questions Bloquantes

### 🔴 À valider avant J+2:

1. **Demo interactive - Scope ?**
   - Simple: Carte + ajout de points + affichage itinéraire
   - Avancé: Algorithme TSP réel + calcul temps de trajet
   - → **Recommandation:** Version simple pour J+12, TSP réel en V2

2. **Clés API - Qui crée les comptes ?**
   - OpenWeatherMap: 1000 req/jour gratuit
   - GraphHopper: 5000 req/jour gratuit
   - PostHog: 1M events/mois gratuit
   - → **Action:** Créer compte OptimTournée pour chaque service

3. **Nom de domaine ?**
   - optimtournee.fr disponible ?
   - → **Action:** Vérifier et acheter si nécessaire

4. **Design System existant ?**
   - @apollon a-t-il des composants Figma/Storyboard ?
   - Palette de couleurs définie ?
   - → **Action:** Sync avec @apollon J+2

### 🟡 Nice-to-have:

5. **Internationalisation ?**
   - FR uniquement ou EN aussi ?
   - → **Défaut:** FR pour MVP

6. **Authentification ?**
   - Juste landing + demo, ou signup utilisateurs ?
   - → **Défaut:** Sans auth pour MVP (demo publique)

---

## ✅ Checklist Validation Architecture (J+2)

- [ ] Stack Next.js + Vercel validée
- [ ] Structure de dossiers approuvée
- [ ] Clés API créées et testées
- [ ] Repository GitHub initialisé
- [ ] Preview Vercel fonctionnelle
- [ ] Intégration OSM testée
- [ ] Intégration OpenWeatherMap testée
- [ ] PostHog configuré
- [ ] CI/CD opérationnel
- [ ] Sync avec @apollon effectuée

---

## 📚 Ressources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Leaflet.js](https://leafletjs.com/)
- [React-Leaflet](https://react-leaflet.js.org/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [OSRM Demo Server](http://project-osrm.org/)
- [PostHog Docs](https://posthog.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

*Document créé par Héphaïstos - Dernière mise à jour: 2025-02-27*
