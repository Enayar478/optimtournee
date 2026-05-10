# OptimTournée — Roadmap & Statut Features

> **Source de vérité** des user stories, statuts, et bugs identifiés.
> Mise à jour à chaque session de test E2E.
>
> **Dernière mise à jour** : 2026-05-10
> **Branche** : `claude/roadmap-user-stories-wesgR`
> **Prod** : https://optimtournee.vercel.app

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

| Symbole | Signification |
|---|---|
| ✅ | Fonctionne en prod |
| ⚠️ | Fonctionne partiellement / petit bug non bloquant |
| ❌ | Cassé / bloquant |
| 🚧 | Pas encore testé |
| 📦 | Pas encore implémenté |

Priorisation **MoSCoW** :
- **M** = Must (bloquant pour MVP utilisable)
- **S** = Should (important mais MVP peut sortir sans)
- **C** = Could (nice-to-have)
- **W** = Won't (hors scope MVP)

---

## User stories — MVP (Must)

### Epic 1 — Onboarding & Auth

| ID | Statut | Prio | User story |
|---|---|---|---|
| US-01 | 🚧 | M | En tant que visiteur, je veux comprendre la valeur du produit en moins de 10s sur la landing |
| US-02 | 🚧 | M | En tant que visiteur, je veux essayer la démo sans créer de compte |
| US-03 | 🚧 | M | En tant que prospect, je veux créer un compte (email + password ou Google) |
| US-04 | 🚧 | M | En tant que nouvel utilisateur connecté, je veux être guidé vers la création de mon premier client/équipe |

### Epic 2 — Gestion des données métier (CRUD)

| ID | Statut | Prio | User story |
|---|---|---|---|
| US-05 | 🚧 | M | En tant que gérant, je veux ajouter un client (nom, adresse, fréquence, durée) |
| US-06 | 🚧 | M | En tant que gérant, je veux que l'adresse soit auto-géocodée (lat/lng) pour la carte |
| US-07 | 🚧 | M | En tant que gérant, je veux modifier/supprimer un client |
| US-08 | 🚧 | M | En tant que gérant, je veux créer une équipe avec ses membres et son secteur |
| US-09 | 🚧 | M | En tant que gérant, je veux modifier/supprimer une équipe |
| US-10 | 🚧 | S | En tant que gérant, je veux importer mes clients via CSV (papaparse déjà en deps) |

### Epic 3 — Génération de planning (cœur métier)

| ID | Statut | Prio | User story |
|---|---|---|---|
| US-11 | 🚧 | M | En tant que gérant, je veux générer le planning d'une semaine pour toutes mes équipes en 1 clic |
| US-12 | 🚧 | M | En tant que gérant, je veux que le planning évite les jours de pluie pour les interventions extérieures |
| US-13 | 🚧 | M | En tant que gérant, je veux voir le planning sous forme de calendrier (semaine + jour) |
| US-14 | 🚧 | M | En tant que gérant, je veux voir les tournées sur une carte (Leaflet) |
| US-15 | 🚧 | M | En tant que gérant, je veux ajouter manuellement une intervention au planning |
| US-16 | 🚧 | M | En tant que gérant, je veux modifier/déplacer/supprimer une intervention |
| US-17 | 🚧 | S | En tant que gérant, je veux pouvoir réoptimiser une journée après ajout d'une demande ponctuelle |

### Epic 4 — Exécution des tournées

| ID | Statut | Prio | User story |
|---|---|---|---|
| US-18 | 🚧 | M | En tant qu'équipe, je veux voir les tournées du jour avec adresses et ordre |
| US-19 | 🚧 | M | En tant qu'équipe, je veux passer une intervention en "en cours" / "terminée" |
| US-20 | 🚧 | S | En tant qu'équipe, je veux ajouter une note/photo après une intervention |

### Epic 5 — Paramètres & préférences

| ID | Statut | Prio | User story |
|---|---|---|---|
| US-21 | 🚧 | M | En tant que gérant, je veux configurer mes horaires de travail et pauses |
| US-22 | 🚧 | M | En tant que gérant, je veux configurer l'adresse du dépôt (point de départ) |
| US-23 | 🚧 | S | En tant que gérant, je veux configurer mes préférences météo (seuils pluie/vent) |
| US-24 | 🚧 | C | En tant que gérant, je veux activer les notifications (email/push) |

### Epic 6 — Dashboard & analytics

| ID | Statut | Prio | User story |
|---|---|---|---|
| US-25 | 🚧 | S | En tant que gérant, je veux voir les KPI : nb interventions, km parcourus, taux de complétion |
| US-26 | 🚧 | C | En tant que gérant, je veux exporter les rapports (PDF/CSV) |

---

## Bugs identifiés

> Mis à jour au fil des tests. Les bugs **bloquants** ont une issue GitHub liée.

| ID | Sévérité | Feature | Description | Issue GH | Statut |
|---|---|---|---|---|---|
| _(aucun pour l'instant — tests en cours)_ | | | | | |

**Légende sévérité** :
- 🔴 Bloquant : empêche l'utilisation de la feature
- 🟠 Majeur : feature dégradée mais utilisable
- 🟡 Mineur : cosmétique / UX

---

## Plan de test E2E

Ordre des tests (parcours utilisateur réaliste) :

1. ✅ **Setup** : ROADMAP.md créé, branche prête
2. 🚧 **Landing** (`/`) — hero, CTA, navigation, ROI calc
3. 🚧 **Démo publique** (`/demo`) — 3 étapes guidées
4. 🚧 **Sign-up** — création compte Clerk
5. 🚧 **Dashboard** — première vue après login
6. 🚧 **Clients CRUD** — créer, éditer, supprimer + geocoding
7. 🚧 **Teams CRUD** — créer équipe + membres
8. 🚧 **Préférences** — horaires, dépôt, météo
9. 🚧 **Génération planning** — bouton "Générer" → schedule
10. 🚧 **Planning view** — calendrier semaine/jour + carte + météo
11. 🚧 **Tournées du jour** — vue mobile-friendly + status update
12. 🚧 **Settings** — profil, notifs

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
