# OptimTournée

Landing page SaaS pour l'optimisation d'itinéraires des PME paysagistes.

## 🚀 Stack Technique

- **Framework:** [Next.js 15](https://nextjs.org/) avec App Router
- **Langage:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Cartographie:** [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/)
- **Météo:** [OpenWeatherMap](https://openweathermap.org/)
- **Analytics:** [PostHog](https://posthog.com/)
- **Hébergement:** [Vercel](https://vercel.com/)

## 📋 Prérequis

- Node.js 22+
- npm ou pnpm
- Clés API (voir `.env.example`)

## 🛠️ Installation

```bash
# Cloner le repo
git clone https://github.com/valhalla/optimtournee.git
cd optimtournee

# Installer les dépendances
npm install

# Configuration des variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API

# Lancer le serveur de développement
npm run dev
```

## 🔑 Variables d'Environnement

Créez un fichier `.env.local` avec :

```env
# OpenWeatherMap API (https://openweathermap.org/api)
OPENWEATHER_API_KEY=your_api_key_here

# PostHog Analytics (https://posthog.com/)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# GraphHopper (optionnel, pour routing avancé)
GRAPHHOPPER_API_KEY=your_key_here
```

## 📁 Structure du Projet

```
optimtournee/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing page + pages marketing
│   ├── api/                # API Routes
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Styles globaux
├── components/
│   ├── ui/                 # Composants shadcn/ui
│   ├── sections/           # Sections landing page
│   └── map/                # Composants cartographie
├── lib/
│   ├── utils/              # Utilities (cn, format)
│   ├── hooks/              # Custom React hooks
│   └── services/           # Services API
├── public/                 # Assets statiques
└── types/                  # Types TypeScript
```

## 🧞 Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement avec Turbopack |
| `npm run build` | Build de production |
| `npm run start` | Démarrer serveur de production |
| `npm run lint` | Linter ESLint |
| `npm run type-check` | Vérification TypeScript |
| `npm run format` | Formater avec Prettier |

## 🗺️ Fonctionnalités

### Landing Page
- Hero avec CTA
- Présentation des fonctionnalités
- Témoignages clients
- Page tarifs

### Demo Interactive
- Carte OpenStreetMap
- Ajout de points d'intervention
- Visualisation d'itinéraire optimisé
- Overlay météo en temps réel

## 📈 Analytics

Événements trackés via PostHog :
- `landing_hero_view` - Vue de la landing
- `demo_interaction` - Interaction avec la demo
- `cta_click` - Clic sur bouton CTA
- `demo_route_optimized` - Route optimisée

## 🚀 Déploiement

Le projet est configuré pour un déploiement automatique sur Vercel :

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déploiement automatique sur chaque push

## 👥 Équipe

- **@hephaistos** - Développeur / Architecte
- **@apollon** - Designer

## 📝 License

Privé - Valhalla Team
