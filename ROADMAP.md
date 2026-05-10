# OptimTournée — Roadmap & Statut Features

> **Source de vérité** des user stories, statuts, et bugs identifiés.
> Mise à jour à chaque session de test/audit.
>
> **Dernière mise à jour** : 2026-05-10 — audit statique complet
> **Branche** : `claude/roadmap-user-stories-wesgR`
> **PR** : https://github.com/Enayar478/optimtournee/pull/8 (draft)
> **Prod** : https://optimtournee.vercel.app

---

## ⚠️ Note sur cette session

Le test E2E live de la prod n'a pas été possible : le sandbox Claude Code on the web bloque les requêtes HTTP vers les domaines non whitelistés (`Host not in allowlist`), et l'allowlist n'est pas configurable côté utilisateur ([issue #52982](https://github.com/anthropics/claude-code/issues/52982)).

**Pivot** : audit statique du code par 4 sous-agents en parallèle. Les findings ci-dessous sont issus de la lecture du code, pas d'une exécution. Les **numéros de ligne sont à vérifier** avant tout fix — les agents peuvent halluciner des détails. Les **catégories de bugs** (race condition, validation manquante, etc.) sont en revanche fiables.

Pour passer en mode runtime, lancer Claude Code en CLI local (pas web) ou tester manuellement.

---

## Vision produit

**OptimTournée** est un SaaS d'optimisation de tournées pour PME paysagistes (et services itinérants similaires). L'utilisateur doit pouvoir :

1. Saisir ses clients, ses équipes, ses préférences
2. Générer un planning hebdomadaire optimisé (TSP + météo)
3. Suivre l'exécution des tournées du jour
4. Réagir aux aléas (météo, demandes ponctuelles)

**Persona principal** : gérant de PME paysagiste, 5–20 employés, 50–500 clients récurrents.

---

## Légende statut

| Symbole | Signification                                 |
| ------- | --------------------------------------------- |
| ✅      | Fonctionne en prod (vérifié)                  |
| ⚠️      | Fonctionne mais bug(s) identifié(s) à l'audit |
| ❌      | Cassé / bloquant                              |
| 🚧      | Pas encore testé en runtime                   |
| 📦      | Pas encore implémenté                         |

Priorisation **MoSCoW** :

- **M** = Must (bloquant pour MVP utilisable)
- **S** = Should (important mais MVP peut sortir sans)
- **C** = Could (nice-to-have)
- **W** = Won't (hors scope MVP)

---

## User stories — MVP (Must)

### Epic 1 — Onboarding & Auth

| ID    | Statut | Prio | User story                                                                                                | Bugs liés                            |
| ----- | ------ | ---- | --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| US-01 | ⚠️     | M    | En tant que visiteur, je veux comprendre la valeur du produit en moins de 10s sur la landing              | BUG-A4, A5                           |
| US-02 | ⚠️     | M    | En tant que visiteur, je veux essayer la démo sans créer de compte                                        | (à vérifier en runtime)              |
| US-03 | ⚠️     | M    | En tant que prospect, je veux créer un compte (email + password ou Google)                                | BUG-A1, A2                           |
| US-04 | ❌     | M    | En tant que nouvel utilisateur connecté, je veux être guidé vers la création de mon premier client/équipe | BUG-A1, A3 (race condition critique) |

### Epic 2 — Gestion des données métier (CRUD)

| ID    | Statut | Prio | User story                                                                   | Bugs liés                               |
| ----- | ------ | ---- | ---------------------------------------------------------------------------- | --------------------------------------- |
| US-05 | ⚠️     | M    | En tant que gérant, je veux ajouter un client                                | BUG-B5 (no error toast)                 |
| US-06 | ⚠️     | M    | En tant que gérant, je veux que l'adresse soit auto-géocodée                 | BUG-B3, B4 (race + no timeout)          |
| US-07 | ❌     | M    | En tant que gérant, je veux modifier/supprimer un client                     | BUG-B2 (cascade delete orphelin)        |
| US-08 | ⚠️     | M    | En tant que gérant, je veux créer une équipe avec ses membres et son secteur | BUG-B7 (members shrinkage)              |
| US-09 | ⚠️     | M    | En tant que gérant, je veux modifier/supprimer une équipe                    | BUG-B7, B8                              |
| US-10 | 📦     | S    | En tant que gérant, je veux importer mes clients via CSV                     | (papaparse en deps mais non implémenté) |

### Epic 3 — Génération de planning (cœur métier)

| ID    | Statut | Prio | User story                                                                                       | Bugs liés                                         |
| ----- | ------ | ---- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| US-11 | ⚠️     | M    | En tant que gérant, je veux générer le planning d'une semaine pour toutes mes équipes en 1 clic  | BUG-C1, C5, C6                                    |
| US-12 | ⚠️     | M    | En tant que gérant, je veux que le planning évite les jours de pluie                             | BUG-C2 (seuil hardcodé), C5 (no fallback weather) |
| US-13 | ⚠️     | M    | En tant que gérant, je veux voir le planning sous forme de calendrier (semaine + jour)           | BUG-C9 (timezone misalignment)                    |
| US-14 | ⚠️     | M    | En tant que gérant, je veux voir les tournées sur une carte (Leaflet)                            | BUG-C13 (Paris hardcoded fallback)                |
| US-15 | ⚠️     | M    | En tant que gérant, je veux ajouter manuellement une intervention au planning                    | BUG-C10 (no conflict detection)                   |
| US-16 | ⚠️     | M    | En tant que gérant, je veux modifier/déplacer/supprimer une intervention                         | BUG-C7 (pas de re-optim)                          |
| US-17 | 📦     | S    | En tant que gérant, je veux pouvoir réoptimiser une journée après ajout d'une demande ponctuelle | non implémenté                                    |

### Epic 4 — Exécution des tournées

| ID    | Statut | Prio | User story                                                                    | Bugs liés                                                 |
| ----- | ------ | ---- | ----------------------------------------------------------------------------- | --------------------------------------------------------- |
| US-18 | ⚠️     | M    | En tant qu'équipe, je veux voir les tournées du jour avec adresses et ordre   | BUG-C12 (date hardcodée)                                  |
| US-19 | ❌     | M    | En tant qu'équipe, je veux passer une intervention en "en cours" / "terminée" | BUG-C11 (pas de state machine)                            |
| US-20 | 📦     | S    | En tant qu'équipe, je veux ajouter une note/photo après une intervention      | non implémenté (champ `notes` existe en DB mais pas d'UI) |

### Epic 5 — Paramètres & préférences

| ID    | Statut | Prio | User story                                                                       | Bugs liés                                                                               |
| ----- | ------ | ---- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| US-21 | ⚠️     | M    | En tant que gérant, je veux configurer mes horaires de travail et pauses         | BUG-D1 (silent .catch)                                                                  |
| US-22 | ⚠️     | M    | En tant que gérant, je veux configurer l'adresse du dépôt                        | BUG-D1                                                                                  |
| US-23 | 📦     | S    | En tant que gérant, je veux configurer mes préférences météo (seuils pluie/vent) | seuils existent par client (`maxWindSpeed` etc.) mais pas de prefs globales utilisateur |
| US-24 | 📦     | C    | En tant que gérant, je veux activer les notifications (email/push)               | toggles UI existent mais aucune intégration backend (Resend/web push)                   |

### Epic 6 — Dashboard & analytics

| ID    | Statut | Prio | User story                                                                                    | Bugs liés                  |
| ----- | ------ | ---- | --------------------------------------------------------------------------------------------- | -------------------------- |
| US-25 | ❌     | S    | En tant que gérant, je veux voir les KPI : nb interventions, km parcourus, taux de complétion | BUG-B1 (crash si 0 équipe) |
| US-26 | 📦     | C    | En tant que gérant, je veux exporter les rapports (PDF/CSV)                                   | non implémenté             |

---

## Bugs identifiés — Audit statique 2026-05-10

> **48 issues** identifiées : 8 🔴 bloquants, 22 🟠 majeurs, 18 🟡 mineurs.
>
> Préfixes : **A** = auth/landing/onboarding · **B** = CRUD admin · **C** = scheduler/planning · **D** = settings/cross-cutting

### 🔴 Bloquants (8)

| ID          | Feature               | Description                                                                                                                                                                                                 | Fix proposé                                                                                                                        |
| ----------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| BUG-A1      | Sign-up → onboarding  | Race condition : `forceRedirectUrl="/onboarding"` redirige avant que le webhook Clerk ait créé la row User en DB. Le `getOrCreateUser()` dans `/api/onboarding/company` peut tomber sur un User inexistant. | Ajouter polling/retry côté client OU délai middleware avant accès `/onboarding`, OU upsert User à la volée à chaque appel API auth |
| BUG-B1      | Dashboard             | `app/api/dashboard/route.ts` : `teamOfDay = allTeams[0]` sans guard si tableau vide → crash dashboard pour user sans équipe (juste après onboarding partiel)                                                | Guard `if (!allTeams.length) return { …, teamOfDay: null }`                                                                        |
| BUG-B2      | Clients DELETE        | Suppression d'un client n'efface pas son `RecurringContract` (relation @unique sans cascade Prisma) → contrats orphelins qui plantent le scheduler                                                          | Soit `onDelete: Cascade` dans le schema, soit `prisma.recurringContract.deleteMany` avant `client.delete` dans la route            |
| BUG-C1      | Scheduler             | `generateSchedule()` ne lève pas d'erreur si `tasks` est vide → renvoie un planning vide indistinguable d'un échec silencieux                                                                               | Throw explicite + handling côté API pour renvoyer 422                                                                              |
| BUG-C2      | Scheduler météo       | Seuil de pluie hardcodé (≈40%) dans le scheduler, ignoré par `SchedulingPreferences`. Les seuils par client (`maxWindSpeed`, `noRainForecast`, etc.) du modèle Prisma ne sont pas tous lus                  | Lire les seuils depuis `RecurringContract`/`OneOffRequest` et/ou créer un champ global `SchedulingPreferences.maxRainProbability`  |
| BUG-C5      | Scheduler persistence | `generateAndPersistSchedule()` appelle `weatherProvider()` dans la transaction. Si OpenWeather tombe à mi-parcours, interventions partielles persistées avec données météo incomplètes                      | Fetch weather AVANT la transaction, OU fallback `getMockWeather()` en catch, OU rollback explicite                                 |
| BUG-C11     | Tournées status       | `PATCH /api/interventions/[id]` accepte n'importe quelle transition de statut (`completed → planned`, etc.) sans state machine                                                                              | Whitelister les transitions : `planned → in_progress → completed` ; `* → cancelled` ; `* → postponed`                              |
| BUG-D-tests | Coverage              | Aucun test sur les API critiques (preferences, one-off-requests, schedules CRUD). Risque élevé de régression silencieuse en prod                                                                            | Ajouter Jest tests pour API routes + Playwright e2e pour les parcours critiques                                                    |

### 🟠 Majeurs (22)

| ID      | Feature              | Description                                                                                    |
| ------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| BUG-A2  | Sign-in redirect     | `forceRedirectUrl="/dashboard"` peut renvoyer avant session établie côté serveur               |
| BUG-A3  | Onboarding           | Étapes 2 & 3 (équipes/clients) ne persistent pas en API → données perdues si refresh           |
| BUG-B3  | Geocoding            | `ClientModal` peut soumettre `lat:0, lng:0` si Nominatim échoue, sans feedback user            |
| BUG-B4  | Geocoding            | Aucun timeout sur `fetch()` Nominatim → modal peut hang indéfiniment                           |
| BUG-B5  | Clients/Teams page   | Erreurs fetch silencieuses → liste vide sans message d'erreur                                  |
| BUG-B6  | Dashboard            | N+1 queries : loop sur teams pour fetch interventions (10 équipes = 11 round-trips)            |
| BUG-B7  | Teams PUT            | Membres peuvent être réduits à 0 côté serveur (validation client only)                         |
| BUG-B8  | Teams PUT            | Ownership check hors transaction → race possible                                               |
| BUG-B9  | RecurringContract    | `startDate` hardcodé à `new Date()` côté serveur, ignore l'input utilisateur                   |
| BUG-C3  | Scheduler distance   | Vitesse moyenne hardcodée `12.5 m/s ≈ 45 km/h`, pas de vraie API routing (OSRM/Mapbox)         |
| BUG-C4  | Scheduler capacity   | Single-client edge case mal géré sur `currentTeam.availableMins`                               |
| BUG-C6  | Schedules POST       | Pas de validation plage de dates (peut planifier 10 ans dans le futur ou dans le passé)        |
| BUG-C7  | Interventions PATCH  | Modifier `assignedTeamId` ou `estimatedStartTime` ne re-calcule pas `routeOrder` → ordre stale |
| BUG-C9  | PlanningView         | Parsing date par split `T` ne gère pas les fuseaux → décalage d'un jour selon le tz user       |
| BUG-C10 | AddInterventionModal | Pas de détection de conflit horaire pour une équipe                                            |
| BUG-D1  | Settings             | `.catch(() => {})` sur fetch preferences → spinner infini si API tombe                         |
| BUG-D2  | Settings save        | `try/catch` silencieux sur save preferences → toast "Saved" affiché même en cas d'échec        |
| BUG-D3  | Demandes             | Erreurs status update / delete silencieusement avalées                                         |
| BUG-D4  | One-off audit        | Pas d'audit log sur transitions de statut (important pour business)                            |
| BUG-D5  | Webhook Clerk        | Pas de tracking d'idempotency (`svix-id`) → upserts dupliqués sur retry Clerk                  |
| BUG-A6  | Auth layout          | Pas de liens Confidentialité / CGU dans `app/(auth)/layout.tsx` (RGPD)                         |
| BUG-A7  | Onboarding           | Validation `ContractFormData` importée mais pas utilisée → contrats peuvent être bypassés      |

### 🟡 Mineurs (18)

| ID      | Feature        | Description                                                                                                          |
| ------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| BUG-A4  | HeroV2         | Date "Semaine du 3 mars" hardcodée                                                                                   |
| BUG-A5  | CTAs           | Texte CTA inconsistant entre pages ("Créer un compte gratuit" vs "Essayer gratuitement" vs "Essai gratuit 14 jours") |
| BUG-A8  | DashboardV2    | Pas d'état d'erreur visible si `/api/dashboard` échoue (silent .catch)                                               |
| BUG-B10 | client.zod     | `lat` et `lng` indépendamment optionnels (devrait être both-or-neither)                                              |
| BUG-B11 | Clients list   | Pas de pagination (lent à 1000+ clients)                                                                             |
| BUG-B12 | Teams UI       | "+N autres" sans expand/collapse                                                                                     |
| BUG-B13 | Admin route    | Pas de RBAC sur `/admin/*` (tout user authentifié y accède)                                                          |
| BUG-B14 | Admin route    | Layout admin sans pages réelles (juste layout vide)                                                                  |
| BUG-B15 | Schema         | `Client.contract` optionnel mais le scheduler suppose qu'il existe                                                   |
| BUG-B16 | Schema         | `PlannedIntervention.weatherIsSuitable` jamais peuplé                                                                |
| BUG-C8  | Schedules POST | Pas d'idempotency-key → double-clic crée 2 plannings                                                                 |
| BUG-C12 | Tournées       | Date hardcodée à "today" → interventions passées invisibles                                                          |
| BUG-C13 | PlanningMap    | Centre par défaut Paris (devrait utiliser companyLat/Lng)                                                            |
| BUG-C14 | Weather cache  | Revalidate inconsistant (5min vs 30min selon endpoint)                                                               |
| BUG-C15 | Recurring      | Pas de gestion explicite leap year / 31 du mois (mensuel sur 31 janvier saute février)                               |
| BUG-D6  | Loading        | Pas de skeletons (juste spinners) → CLS sur Settings/Demandes                                                        |
| BUG-D7  | a11y           | Modals sans `role="dialog" aria-modal="true"` ni focus trap                                                          |
| BUG-D8  | Errors         | Format d'erreur API inconsistant entre routes (`{error}` vs `{error, code}`)                                         |

---

## Plan de fix priorisé

### Sprint 1 — Débloquer le MVP (1–2 semaines)

**Objectif** : un nouvel utilisateur peut sign-up → onboarding → créer 5 clients + 1 équipe → générer un planning → voir ses tournées du jour, sans crash.

1. **BUG-A1** : Fixer race condition signup → onboarding (upsert User à la demande dans `getOrCreateUser` côté API + retry client)
2. **BUG-B1** : Guard `allTeams.length === 0` dans `/api/dashboard`
3. **BUG-B2** : Cascade delete `RecurringContract` quand on supprime un Client (modifier `schema.prisma` + migrer)
4. **BUG-C1** : Throw explicite si scheduler reçoit 0 task + 422 côté API
5. **BUG-C5** : Sortir le fetch météo de la transaction Prisma + fallback mock
6. **BUG-C11** : Implémenter state machine sur `PATCH /api/interventions/[id]`
7. **BUG-A3** : Persister étapes 2 & 3 d'onboarding via API à chaque "Suivant"

### Sprint 2 — Robustesse (1 semaine)

8. **BUG-B3, B4** : Geocoding avec timeout + feedback échec + désactivation submit
9. **BUG-B5, A8, D1, D2, D3** : Toasts d'erreur partout (créer un hook `useToast` ou utiliser `sonner`)
10. **BUG-C2** : Lire les seuils météo depuis `RecurringContract`/`OneOffRequest`
11. **BUG-C9** : Standardiser dates en UTC côté serveur + parsing tz-safe côté client
12. **BUG-B6** : Refacto N+1 → `prisma.findMany({ where: { teamId: { in: teamIds } } })`
13. **BUG-C7** : Re-calculer `routeOrder` sur PATCH intervention
14. **BUG-D-tests** : Ajouter Jest tests sur les 4 routes API les plus critiques (`schedules POST`, `clients DELETE`, `interventions PATCH`, `webhooks/clerk`)

### Sprint 3 — Polish UX (1 semaine)

15. **BUG-A4, A5, A6** : Date dynamique HeroV2, CTAs uniformes, footer auth avec liens légaux
16. **BUG-C13** : Carte centrée sur companyLat/companyLng
17. **BUG-D7** : `role="dialog"` + focus trap sur modals (utiliser `@radix-ui/react-dialog` qui est déjà installé via shadcn)
18. **BUG-B11** : Pagination clients
19. **BUG-D6** : Remplacer spinners par skeletons sur listes
20. **BUG-C8** : Idempotency-Key sur POST schedules

### Backlog (post-MVP)

- BUG-C3 : Vraie API routing (OSRM auto-hébergé ou Mapbox)
- BUG-B13, B14 : RBAC admin + pages admin réelles (ou supprimer le scaffolding)
- BUG-B15, B16 : Nettoyer schema (champs jamais peuplés)
- BUG-C15 : Gestion edge cases recurring (mois variable)
- BUG-C12 : Sélecteur de date sur Tournées
- BUG-C14 : Cache météo unifié

---

## Plan de test E2E (à exécuter quand le sandbox/env permet de joindre la prod)

Ordre des tests (parcours utilisateur réaliste) :

1. ✅ **Setup** : ROADMAP + audit statique
2. 🚧 **Landing** (`/`) — hero, CTA, navigation, ROI calc
3. 🚧 **Démo publique** (`/demo`) — 3 étapes guidées
4. 🚧 **Sign-up** — création compte Clerk + redirect onboarding
5. 🚧 **Onboarding** — 3 étapes (entreprise / équipes / clients) + persistance
6. 🚧 **Dashboard** — première vue après login (vérifier BUG-B1 fixé)
7. 🚧 **Clients CRUD** — créer, éditer, supprimer + geocoding (vérifier BUG-B2, B3)
8. 🚧 **Teams CRUD** — créer équipe + membres
9. 🚧 **Préférences** — horaires, dépôt, météo
10. 🚧 **Génération planning** — bouton "Générer" → schedule (vérifier BUG-C1, C5)
11. 🚧 **Planning view** — calendrier semaine/jour + carte + météo (vérifier BUG-C9)
12. 🚧 **Tournées du jour** — vue mobile-friendly + status update (vérifier BUG-C11)
13. 🚧 **Settings** — profil, notifs (vérifier BUG-D1, D2)

À chaque feature : screenshot + rapport (OK / KO + détails) → MAJ ROADMAP.

---

## Backlog post-MVP (Should / Could)

- Import CSV clients (papaparse)
- Notifications email (Resend ?) + push (PWA)
- Export PDF des plannings (jsPDF)
- Réoptimisation à chaud d'une journée
- Multi-langue (i18n) — actuellement FR only
- App mobile native (React Native ?) pour les équipes terrain
- Intégration GPS temps réel (OBD/téléphone)
- Facturation (Stripe ou GoCardless)

---

## Won't (hors scope MVP)

- Marketplace de paysagistes
- Module RH (paie, congés)
- ERP complet (stock, achats)
