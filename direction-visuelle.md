# OptimTournée — Direction Visuelle

## 🎨 Identité Visuelle

### Positionnement Émotionnel
> **"Le professionnalisme technique au service de l'artisanat"**

Pas de tech froide et corporate. On parle à des artisans de terrain qui valorisent :
- La **fiabilité** (ça marche, point)
- L'**efficacité** (gain de temps concret)
- Le **contact humain** (support accessible)

---

## 🖌️ Palette de Couleurs

### Couleurs Principales

```
┌─────────────────────────────────────────────────────────┐
│  PRIMARY — Vert Forêt                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  #2D5A3D  (Main)     ████████████████████████████████   │
│  #3D7A52  (Light)    ████████████████████████████████   │
│  #1F3D29  (Dark)     ████████████████████████████████   │
│  #E8F5EC  (Surface)  ████████████████████████████████   │
│                                                         │
│  Usage : Header, CTA primaires, éléments de confiance   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  SECONDARY — Bleu Ciel / Météo                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  #4A90A4  (Main)     ████████████████████████████████   │
│  #6BB3C7  (Light)    ████████████████████████████████   │
│  #2E5A6B  (Dark)     ████████████████████████████████   │
│  #E8F4F7  (Surface)  ████████████████████████████████   │
│                                                         │
│  Usage : Météo, accents tech, icônes fonctionnalités    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ACCENT — Orange Énergie / Économie                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  #E07B39  (Main)     ████████████████████████████████   │
│  #F5A572  (Light)    ████████████████████████████████   │
│  #B85F28  (Dark)     ████████████████████████████████   │
│  #FDF2EB  (Surface)  ████████████████████████████████   │
│                                                         │
│  Usage : Highlight économies, badges, alerts positives  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  NEUTRES                                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  #1A1A1A  (Texte principal)                             │
│  #4A4A4A  (Texte secondaire)                            │
│  #8A8A8A  (Texte tertiaire / placeholders)              │
│  #E5E5E5  (Bordures)                                    │
│  #F5F5F5  (Fonds alternés)                              │
│  #FFFFFF  (Fond principal)                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  SÉMANTIQUES                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  ✅ Succès : #22C55E  (vert vif pour valid/économies)   │
│  ⚠️  Alerte : #F59E0B  (orange pour météo modérée)      │
│  ❌ Erreur : #EF4444   (rouge pour problèmes)           │
│  ℹ️  Info : #3B82F6   (bleu pour tips)                  │
└─────────────────────────────────────────────────────────┘
```

### Gradients Utilisés
```css
/* Hero background subtil */
linear-gradient(135deg, #E8F5EC 0%, #E8F4F7 100%)

/* CTA hover effect */
linear-gradient(135deg, #2D5A3D 0%, #3D7A52 100%)

/* Highlight économies */
linear-gradient(90deg, #E07B39 0%, #F5A572 100%)

/* Carte - ambiance terrain */
radial-gradient(circle at 30% 70%, #E8F5EC 0%, #D4E8DB 100%)
```

---

## 🔤 Typographie

### Choix des Fonts

| Rôle | Police | Fallback | Usage |
|------|--------|----------|-------|
| **Titres** | Inter | system-ui, sans-serif | H1-H6, boutons, navigation |
| **Corps** | Inter | system-ui, sans-serif | Paragraphes, descriptions |
| **Chiffres/Data** | JetBrains Mono | monospace | Stats, prix, calculateur |
| **Accent** | (optionnel) | - | Citations témoignages |

### Échelle Typographique

```
┌────────────────────────────────────────────────────────┐
│  H1 — 48px / 56px line / -0.02em                       │
│  "Optimisez vos tournées"                              │
│  Font-weight: 700                                      │
│  Mobile: 32px                                          │
├────────────────────────────────────────────────────────┤
│  H2 — 36px / 44px line / -0.01em                       │
│  "Fonctionnalités clés"                                │
│  Font-weight: 600                                      │
│  Mobile: 28px                                          │
├────────────────────────────────────────────────────────┤
│  H3 — 24px / 32px line                                 │
│  "Cartographie avancée"                                │
│  Font-weight: 600                                      │
│  Mobile: 20px                                          │
├────────────────────────────────────────────────────────┤
│  Body Large — 18px / 28px line                         │
│  Texte d'introduction, descriptions importantes        │
│  Font-weight: 400                                      │
├────────────────────────────────────────────────────────┤
│  Body — 16px / 24px line                               │
│  Texte courant                                         │
│  Font-weight: 400                                      │
├────────────────────────────────────────────────────────┤
│  Small — 14px / 20px line                              │
│  Légendes, métadonnées, labels                         │
│  Font-weight: 400                                      │
├────────────────────────────────────────────────────────┤
│  Caption — 12px / 16px line                            │
│  Mentions légales, crédits                             │
│  Font-weight: 400                                      │
└────────────────────────────────────────────────────────┘
```

---

## 🖼️ Moodboard & Références

### Direction Esthétique

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   INSPIRATION VISUELLE                                  │
│                                                         │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│   │  NATURE   │  │  TECH     │  │  HUMAN    │          │
│   │  🌲       │  │  ⚡       │  │  🤝       │          │
│   ├───────────┤  ├───────────┤  ├───────────┤          │
│   │ Vert forêt│  │ Interface │  │ Photos    │          │
│   │ Textures  │  │ épurée    │  │ authenti- │          │
│   │ bois/terre│  │ Cartes    │  │ ques      │          │
│   │           │  │ modernes  │  │ équipes   │          │
│   │           │  │           │  │           │          │
│   │ Ref:      │  │ Ref:      │  │ Ref:      │          │
│   │ Figma,    │  │ Mapbox,   │  │ Notion,   │          │
│   │ Notion    │  │ Linear    │  │ Gusto     │          │
│   └───────────┘  └───────────┘  └───────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Mots-Clés Visuels
- **Clair** (pas de fouillis, informations digestes)
- **Respirant** (beaucoup d'air, espaces généreux)
- **Organique** (formes douces, pas de coins trop agressifs)
- **Fiable** (typo solide, alignements stricts)
- **Chaleureux** (photos de vraies personnes, pas de stock corporate)

### Style d'Illustrations
- **Icônes:** Line icons, stroke 1.5-2px, style Fluent ou Phosphor
- **Illustrations:** Flat design subtil, pas de 3D tape-à-l'œil
- **Cartes:** OpenStreetMap customisée (thème vert/forêt)
- **Photos:** Vrais paysagistes au travail, pas de stock généric

### Photographie
- **Style:** Documentaire, naturel, en plein air
- **Lumière:** Lumière naturelle, golden hour préféré
- **Sujets:** Équipes en action, véhicules d'entreprise, équipement pro
- **À éviter:** Photos studio trop propres, sourires forcés

---

## 🧩 Système de Composants

### Boutons

```
┌─────────────────────────────────────────────────────────┐
│  PRIMARY BUTTON                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  [ Fond: #2D5A3D  Texte: #FFFFFF ]                      │
│  Padding: 16px 32px                                     │
│  Border-radius: 8px                                     │
│  Font: 16px, weight 600                                 │
│  Hover: #3D7A52 + shadow 0 4px 12px rgba(45,90,61,0.3)  │
│                                                         │
│  🚀 Demander une démo                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  SECONDARY BUTTON                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  [ Fond: transparent  Bordure: 2px #2D5A3D ]            │
│  Texte: #2D5A3D                                         │
│  Padding: 14px 30px (compense la bordure)               │
│  Border-radius: 8px                                     │
│  Hover: fond #E8F5EC                                    │
│                                                         │
│  Voir les fonctionnalités                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ACCENT BUTTON (CTA économies)                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  [ Fond: #E07B39  Texte: #FFFFFF ]                      │
│  Padding: 16px 32px                                     │
│  Border-radius: 8px                                     │
│  Hover: #F5A572                                         │
│                                                         │
│  💰 Calculer mes économies                              │
└─────────────────────────────────────────────────────────┘
```

### Cards

```
┌─────────────────────────────────────────────────────────┐
│  FEATURE CARD                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Fond: #FFFFFF                                          │
│  Border: 1px solid #E5E5E5                              │
│  Border-radius: 16px                                    │
│  Padding: 32px                                          │
│  Shadow: 0 2px 8px rgba(0,0,0,0.04)                     │
│  Hover shadow: 0 8px 24px rgba(0,0,0,0.08)              │
│                                                         │
│  ┌───────────┐                                          │
│  │  🗺️       │  48x48, fond #E8F5EC, radius 12px       │
│  └───────────┘                                          │
│  Titre (H3)                                             │
│  Description texte corps                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TESTIMONIAL CARD                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Fond: #F5F5F5 ou #FFFFFF avec border                   │
│  Border-radius: 16px                                    │
│  Padding: 24px                                          │
│                                                         │
│  "Citation en italique légère"                          │
│                                                         │
│  ┌────┐  Prénom Nom                                     │
│  │ 👤 │  Métier                                         │
│  │    │  ★★★★★                                          │
│  └────┘  Photo 48x48, radius 50%                        │
└─────────────────────────────────────────────────────────┘
```

### Formulaires

```
┌─────────────────────────────────────────────────────────┐
│  INPUT FIELD                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  Label: 14px, weight 500, #4A4A4A                       │
│  Input:                                                 │
│    - Border: 1px solid #E5E5E5                          │
│    - Border-radius: 8px                                 │
│    - Padding: 12px 16px                                 │
│    - Focus: border #2D5A3D, shadow 0 0 0 3px #E8F5EC    │
│    - Placeholder: #8A8A8A                               │
│                                                         │
│  Email professionnel                                    │
│  ┌─────────────────────────────────────┐                │
│  │  jean@paysagiste-pro.fr             │                │
│  └─────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### Adaptations Mobile

| Élément | Desktop | Mobile |
|---------|---------|--------|
| Navigation | Horizontal + CTA | Hamburger menu |
| Hero | 2 colonnes | Empilé, carte en haut |
| Features Grid | 3 colonnes | 1 colonne scrollable |
| Calculateur | Large | Empilé, sliders full-width |
| Pricing | 2 cartes côte à côte | Empilé, Pro en premier |
| Témoignages | 3 colonnes | Carousel swipe |

### Touch Targets
- **Minimum:** 44x44px pour tous les éléments interactifs
- **Boutons principaux:** 48px de haut minimum
- **Espacement entre liens:** 16px minimum

---

## 🎭 Animations & Micro-interactions

### Principes
- **Durée:** 200-300ms (rapide mais perceptible)
- **Easing:** ease-out pour entrées, ease-in-out pour transitions
- **Performance:** utilise transform et opacity uniquement

### Déclencheurs
| Élément | Animation | Déclencheur |
|---------|-----------|-------------|
| Boutons | Scale 1.02 + shadow | Hover |
| Cards | TranslateY -4px + shadow | Hover |
| Sections | Fade up (opacity 0→1, translateY 20→0) | Scroll into view |
| Calculateur | Number count up | Slider change |
| Carte | Path draw | Page load |
| CTA | Pulse subtil (shadow) | Toutes les 5s |

---

## 📝 Notes d'Application

### Do's ✅
- Utiliser le vert comme couleur de confiance principale
- Mettre en avant les chiffres d'économies (orange)
- Photos de vrais paysagistes si possible
- Garder beaucoup d'espace blanc
- Typos lisibles, tailles généreuses

### Don'ts ❌
- Pas de dégradés flashy sur les textes
- Pas d'ombres trop marquées (flat design)
- Pas d'iconographie trop "tech" ou abstraite
- Pas de jargon corporate incompréhensible
- Pas de popups agressifs
