# État actuel

Mis à jour le 2026-10-26 (mise en place de la structure standard). Faits relevés dans le dépôt et sur GitHub.

## Dernier commit

- `main` : `93e3fc8` du 2026-03-17, « fix: corrections code review — validation données, feedback erreurs ».

## Branches et PR ouvertes

- PR #8 (brouillon) : « docs: roadmap, user stories, and feature audit (WIP) », 10 commits d'avance sur `main`, dernière mise à jour le 2026-05-10, CI verte à cette date.
- `chore/structure-agents` : cette structure standard.
- Branches distantes anciennes, sans PR ouverte : `feat/gestion-metier-paysagiste`, `feat/onboarding-wizard`, `feat/thot/onboarding-guide` et `fix/argos/type-safety` n'ont aucun commit d'avance sur `main` ; `feat/planning-system-refactoring` (1), `feat/landing-demo-admin-mvp` (5), `feat/atlas/prisma-schema-clean` (2), `feat/atlas/prisma-supabase` (1) et `feat/thot/copy-repositioning` (2) en ont encore. À trier.

## Ce qui marche

- Fonctionnalités présentes sur `main` d'après l'historique : landing et démo, tableau de bord admin, clients et équipes, planning, tournées du jour, onboarding en 4 étapes, gestion métier (contrats, demandes, employés), import CSV.
- Tests : 8 fichiers de test Jest et 2 specs Playwright dans `e2e/`. Dernière exécution : À compléter.

## Ce qui ne marche pas

- La CI de `main` est en échec sur les 5 derniers pushes (2026-03-17). Pour le dernier, c'est le job `lint-and-typecheck` (le build est ignoré) ; la cause n'a pas été retrouvée, les logs ont expiré.
- Les workflows `deploy-preview.yml` et `deploy-production.yml` se déclenchent sur le workflow « CI », alors que la CI s'appelle « CI/CD » : ils ne partent jamais.

## Prochaines étapes

- À compléter. Éléments relevés : réparer la CI, trier la PR #8 et les branches anciennes.

## À compléter

- État de la production (Vercel, Clerk, Supabase) et fréquence de déploiement.
- `README.md` : décrit une landing seule, cite un dépôt `valhalla/optimtournee` et une licence « Privé » alors que le dépôt est public et que l'application est plus large.
- Fichiers vides `CSS` et `ENDOFFILE` à la racine (0 octet), à supprimer si inutiles.
