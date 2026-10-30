# OptimTournée

Contexte projet pour toute session d'agent sur ce dépôt. À lire avant d'agir. Source unique du contexte : `CLAUDE.md` est un lien symbolique vers ce fichier.

## Objectif

SaaS pour PME paysagistes : optimisation des tournées d'intervention. Une landing publique avec démo interactive, puis une application d'administration (clients, équipes, planning généré par un algorithme de plus proche voisin avec météo, tournées du jour, onboarding). Authentification Clerk, base Supabase via Prisma, déploiement Vercel.

## Contexte cerveau

- Note du projet : `/Volumes/Data/brain/20-projets/optimtournee.md`
- Journal de décisions : `docs/decisions.md` — État actuel : `docs/status.md`

## Stack et commandes

### Stack technique

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5.7
- **Base de données**: PostgreSQL via Prisma 6 + Supabase (Frankfurt)
- **Auth**: Clerk (webhook sync → table User)
- **UI**: Tailwind CSS 4, shadcn/ui, Framer Motion, Lucide icons
- **Cartes**: Leaflet + react-leaflet (OpenStreetMap)
- **Analytics**: PostHog
- **Tests**: Jest (unit), Playwright (e2e)
- **Déploiement**: Vercel

### Commandes

```bash
npm ci               # Installer (lockfile npm ; postinstall = prisma generate)
npm run dev          # Serveur dev (port 3000)
npm run build        # Build production (prisma generate + next build)
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run format:check # Prettier (vérifié par la CI)
npm run test         # Jest unit tests
npm run test:e2e     # Playwright e2e tests
npx prisma studio    # Interface BD
npx prisma db push   # Sync schema → BD
```

La CI (`.github/workflows/ci.yml`) enchaîne `npm ci`, `lint`, `type-check`, `format:check`, puis `build`.

## Structure du projet

```
app/                    # Pages (App Router)
  (auth)/               # Routes Clerk (sign-in, sign-up)
  api/                  # API routes
    clients/            # CRUD clients
    teams/              # CRUD équipes
    schedules/          # Génération + CRUD schedules (POST génère, GET liste)
      [id]/             # GET détail, PATCH status, DELETE
        interventions/  # POST ajout, [interventionId] PATCH/DELETE
    tournees/           # Tournées du jour (enrichi avec clients)
    interventions/[id]/ # Status rapide (PATCH)
    preferences/        # GET/PUT préférences planification
    one-off-requests/   # GET/POST demandes ponctuelles
    weather/            # Météo courante + forecast 5 jours
    dashboard/          # Stats dashboard
    webhooks/clerk      # Webhook Clerk → User sync
  dashboard/            # Dashboard admin
  clients/              # Gestion clients (CRUD + modal)
  teams/                # Gestion équipes (CRUD + modal)
  tournees/             # Tournées du jour (expandable, status rapide)
  planning/             # Planning interactif (calendrier semaine/jour, carte, météo)
  settings/             # Paramètres (profil, planification, notifications)
  demo/                 # Démo publique (3 étapes guidées)

components/
  layout/AdminLayout    # Sidebar admin (Dashboard, Clients, Équipes, Tournées, Planning, Paramètres)
  planning/             # Composants planning
    PlanningView        # Vue principale (semaine/jour, filtres, génération)
    WeekCalendar        # Grille horaire type Google Calendar
    DayCalendar         # Vue jour par équipe
    InterventionDetailModal # Détail + édition intervention
    AddInterventionModal    # Ajout intervention manuelle
    GenerateScheduleModal   # Modal génération planning
    WeatherBar          # Barre météo 5 jours
    PlanningMap          # Carte Leaflet routes par équipe
  sections/             # Composants landing (Hero, Features, Pricing, Footer, Navbar, DashboardV2)
  clients/ClientModal   # Modal CRUD clients (zod + geocoding Nominatim)
  teams/TeamModal       # Modal CRUD équipes (membres dynamiques)
  map/                  # Composants carte (RouteOptimizer, OpenStreetMap, Demo)

lib/
  domain/scheduler      # Algorithme de planification (nearest-neighbor TSP + météo, immutable)
  domain/scheduler-persistence # Pont scheduler ↔ Prisma (load, generate, persist)
  hooks/usePlanning     # Hook planning (interventions, mutations)
  hooks/useSchedules    # Hook schedules (CRUD, génération)
  validation/           # Schémas zod (client, team, schedule)
  services/weather      # API OpenWeatherMap (current + forecast 5j)
  db/user               # Opérations utilisateur (upsert Clerk)
  prisma                # Client Prisma singleton

prisma/schema.prisma    # Modèle BD (User, Client, Team, TeamMember, PlannedIntervention, Schedule, SchedulingPreferences, OneOffRequest)
```

## Conventions

- **Couleurs**: Forest green `#2D5A3D`, Blue `#4A90A4`, Orange `#E07B39`
- **Immutabilité**: Toujours créer de nouveaux objets (voir règles globales)
- **API**: Toutes les routes protégées par `auth()` Clerk, pattern RESTful
- **Validation**: zod pour les formulaires, schémas dans `lib/validation/`
- **Composants**: Framer Motion pour animations, shadcn/ui pour les primitives
- **Données admin**: Fetch API côté client dans useEffect, pas de SSR pour les pages dynamiques

Ce qu'il ne faut jamais faire :

- Jamais de secret en dur ni de fichier `.env*` commité : `.env`, `.env.local` et `.env.*.local` sont ignorés par git, le modèle est `.env.example`.
- Jamais de mutation d'objet : toujours de nouveaux objets.
- Dépôt public sur GitHub : aucun secret ni donnée sensible dans les fichiers, les messages de commit et les PR.

## Patterns importants

- `AdminLayout` wraps toutes les pages admin (sidebar + header mobile)
- Les pages admin sont des client components (`"use client"`) avec `force-dynamic`
- Les modals (ClientModal, TeamModal) gèrent leur propre état de formulaire et soumission API
- Le geocoding utilise Nominatim (OSM) pour convertir les adresses en coordonnées
- La démo utilise des données mockées extraites dans `lib/demo/mock-data.ts`
- Le planning utilise un scheduler in-memory (`generateSchedule()`) persisté via `scheduler-persistence.ts`
- Les schedules ont un status (draft → active → archived) et contiennent des PlannedIntervention
- La météo utilise les coordonnées de l'entreprise utilisateur (fallback Paris)
- Les tournées du jour supportent le suivi de statut rapide (planned → in_progress → completed)

## Règles pour les agents

1. Lire ce fichier puis `docs/status.md` avant d'agir.
2. Discuter l'approche avant du code non trivial.
3. Un worktree = une tâche, commits atomiques, messages en français.
4. En fin de session, mettre à jour `docs/status.md`, ajouter une décision à `docs/decisions.md` si besoin, commit.

## Skills et agents du projet

- `.agents/skills/` et `.agents/agents/` : skills et agents propres au projet (vides pour l'instant).
- `.claude/` : absent du dépôt.
- Documents existants à la racine : `ARCHITECTURE.md`, `PROJECT_PLAN.md`, `SETUP_SUMMARY.md`, `DESIGN_EVOLUTION_V2.md`, `direction-visuelle.md`, `responsive-specs.md`, `wireframe.md`, `guides/`. Plusieurs précèdent l'application actuelle (`PROJECT_PLAN.md` date du 2026-03-05) et peuvent être dépassés : ce fichier fait foi pour la stack.
