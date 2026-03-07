# 📋 Plan de Projet — OptimTournée

> **Chef de projet:** Athéna (@athena_stratege_bot)  
> **Date:** 2026-03-05  
> **Deadline cible:** Livraison J+12 (mi-mars)  
> **Statut:** 🟡 En cours — 70% complété

---

## 👥 Équipe & Responsabilités

| Agent | Rôle | Username |
|-------|------|----------|
| @hephaistos_forge_bot | Développeur / Architecture | Héphaïstos |
| @apollon_lumiere_bot | Designer / UI-UX | Apollon |
| @atlas_devopsBot | DevOps / Déploiement | Atlas |
| @athena_stratege_bot | Chef de projet / Coordination | Athéna |

---

## 🎯 Objectifs du Projet

Landing page SaaS pour PME paysagistes avec :
- Landing page complète (SEO-friendly)
- Démo interactive (carte + optimisation d'itinéraire)
- Dashboard avec gestion clients/équipes
- Authentification Clerk
- Tracking analytics PostHog
- Déploiement Vercel

---

## ✅ Livrés (Sprint 1-2)

### Landing Page
- [x] Hero avec CTA
- [x] Calculateur ROI
- [x] Section Features
- [x] Demo Preview
- [x] Témoignages
- [x] Pricing
- [x] Footer + Navbar

### Dashboard
- [x] Carte interactive (Leaflet)
- [x] Gestion clients
- [x] Gestion équipes
- [x] Planning avec météo
- [x] Algorithmes d'optimisation (mock)

### Architecture
- [x] Next.js 15 + App Router
- [x] TypeScript
- [x] Tailwind CSS v4
- [x] shadcn/ui
- [x] Prisma ORM
- [x] Clerk Auth
- [x] PostHog Analytics

---

## 🚧 Tâches en Cours / À Faire

### Sprint 3 — Stabilisation & Tests

#### @hephaistos_forge_bot — Développeur
**Priorité P0 (Cette semaine)**
- [ ] **TASK-001:** Vérifier build production (`npm run build`)
  - Critère: Build passe sans erreur
  - Deadline: J+1
  
- [ ] **TASK-002:** Tester la démo publique sans authentification
  - Vérifier que `/demo` fonctionne pour visiteurs
  - Corriger si besoin
  - Deadline: J+1

- [ ] **TASK-003:** Générer client Prisma + valider connexion DB
  - `prisma generate` + test connexion
  - Deadline: J+2

**Priorité P1 (Semaine prochaine)**
- [ ] **TASK-004:** SEO final
  - Sitemap.xml
  - Robots.txt
  - Metadata sur toutes les pages
  - Open Graph images
  - Deadline: J+5

- [ ] **TASK-005:** Tests E2E critique
  - Flow landing → démo → CTA
  - Deadline: J+6

#### @apollon_lumiere_bot — Designer
**Priorité P1**
- [ ] **TASK-006:** Review design system
  - Vérifier cohérence couleurs/typo sur toutes les pages
  - Dark mode si prévu
  - Deadline: J+4

- [ ] **TASK-007:** Assets finaux
  - Screenshots produit haute qualité
  - Open Graph image (1200x630)
  - Favicon multi-résolution
  - Deadline: J+5

#### @atlas_devopsBot — DevOps
**Priorité P1**
- [ ] **TASK-008:** Setup Vercel
  - Connecter repo GitHub
  - Configurer variables d'environnement
  - Preview deployments
  - Deadline: J+5

- [ ] **TASK-009:** Variables d'environnement production
  - `DATABASE_URL`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_POSTHOG_KEY`
  - `OPENWEATHER_API_KEY`
  - Deadline: J+5

---

## 🔴 Bloquages / Besoins Owner

### Besoins à confirmer avec @nyr_478

| Item | Question | Impact |
|------|----------|--------|
| **Clés API** | As-tu les clés OpenWeatherMap, PostHog, Clerk ? | Sans ça, pas de déploiement prod |
| **Base de données** | Quelle DB en prod ? Supabase, Vercel Postgres, autre ? | Nécessaire pour Prisma |
| **Domaine** | Quel nom de domaine pour la landing ? | Config Vercel |
| **Analytics** | Compte PostHog créé ? | Tracking impossible sinon |

---

## 📅 Timeline

```
J+1 (06/03)  → Build OK, Démo publique OK
J+2 (07/03)  → DB connectée, Prisma OK
J+4 (09/03)  → Review design terminée
J+5 (10/03)  → SEO + Assets + Vercel setup
J+6 (11/03)  → Tests E2E, corrections finales
J+7 (12/03)  → 🚀 LIVRAISON GO/NO-GO
```

---

## 📊 KPIs de Suivi

| Métrique | Cible | Actuel |
|----------|-------|--------|
| Build production | ✅ Passe | ⏳ À tester |
| Pages sans erreur | 100% | ⏳ À tester |
| Score Lighthouse | >90 | ⏳ À tester |
| Démo fonctionnelle | ✅ Sans auth | ⏳ À tester |
| Déployé sur Vercel | ✅ | ❌ |

---

## 📝 Notes

- Projet bien structuré, architecture solide
- Git clean, commits réguliers
- TypeScript strict activé
- Reste principalement du polish + déploiement

---

**Prochain rapport:** J+3 (dimanche 08/03) ou au prochain jalon critique.
