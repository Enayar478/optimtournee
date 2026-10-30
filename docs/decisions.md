# Journal de décisions

<!-- Une entrée par décision. Ne jamais supprimer, seulement marquer « remplacée par ». -->

## 2026-10-26 — Structure standard (AGENTS.md, docs/, orca.yaml)

**Contexte.** Le contexte agents vivait dans `CLAUDE.md`, un nom propre à un seul outil. Le dépôt n'avait ni journal de décisions ni état courant versionnés, et rien ne le reliait à la note de projet du vault (`/Volumes/Data/brain`), qui est la mémoire durable. Les worktrees d'agents n'avaient ni procédure d'installation ni fichiers d'environnement.

**Décision.**

- `AGENTS.md` devient la source unique du contexte : `git mv CLAUDE.md AGENTS.md`, contenu conservé, sections du gabarit ajoutées. `CLAUDE.md` est un lien symbolique vers `AGENTS.md`.
- `docs/decisions.md` (ce journal) et `docs/status.md` (état actuel) sont versionnés.
- `.agents/skills/` et `.agents/agents/` existent (`.gitkeep`) pour les skills et agents propres au projet.
- `orca.yaml` installe les dépendances à la création d'un worktree (`npm ci`, le lockfile est `package-lock.json`), fait attendre l'agent la fin de l'installation et ouvre deux onglets (Agent, Git).
- `.worktreeinclude` copie `.env` et `.env.local` (ignorés par git) dans chaque worktree.

**Alternatives écartées.**

- Garder `CLAUDE.md` comme fichier principal : propre à un outil.
- Deux fichiers distincts, `AGENTS.md` et `CLAUDE.md` : le contenu finit par diverger.
- `worktree.sharedDirectories` pour `node_modules` : ce serait un lien partagé et mutable entre worktrees. On réinstalle par le script de setup.
- Réécrire ou archiver les documents racine (`ARCHITECTURE.md`, `PROJECT_PLAN.md`, etc.) : hors périmètre, ils restent tels quels.

**Conséquences.**

- Chaque nouveau worktree paie un `npm ci` complet avant que l'agent démarre ; `postinstall` lance `prisma generate`.
- `.env` et `.env.local` sont copiés tels quels dans chaque worktree : leur contenu n'est jamais lu ni versionné.
- Le dépôt est public : `AGENTS.md`, `docs/` et `orca.yaml` ne doivent contenir aucun secret.
