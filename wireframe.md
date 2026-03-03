# OptimTournée — Wireframe Landing Page

## 🏗️ Structure de la Page (Single Page Scrolling)

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                        │
│  [Logo]    Fonctionnalités  Tarifs  Témoignages    [CTA │
│  "Demander une démo"]                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ████████████████████████████████████████████████████  │
│  ██                                               ██  │
│  ██  HERO SECTION                                ██  │
│  ██                                               ██  │
│  ██  ┌─────────────────┐  ┌─────────────────┐    ██  │
│  ██  │                 │  │  [CARTE         │    ██  │
│  ██  │  "Réduisez      │  │   INTERACTIVE]  │    ██  │
│  ██  │   vos trajets   │  │                 │    ██  │
│  ██  │   de 30%"       │  │  Visualisation  │    ██  │
│  ██  │                 │  │  itinéraire     │    ██  │
│  ██  │  Sous-titre :   │  │  optimisé       │    ██  │
│  ██  │  "OptimTournée  │  │                 │    ██  │
│  ██  │   calcule       │  │  Animation :    │    ██  │
│  ██  │   automatique-  │  │  points qui se  │    ██  │
│  ██  │   ment le       │  │  connectent     │    ██  │
│  ██  │   meilleur      │  │                 │    ██  │
│  ██  │   itinéraire    │  │                 │    ██  │
│  ██  │   pour vos      │  │                 │    ██  │
│  ██  │   équipes"      │  │                 │    ██  │
│  ██  │                 │  │                 │    ██  │
│  ██  │  [🔥 CTA        │  │                 │    ██  │
│  ██  │   "Voir ma      │  │                 │    ██  │
│  ██  │   simulation    │  │                 │    ██  │
│  ██  │   gratuite"]    │  │                 │    ██  │
│  ██  │                 │  │                 │    ██  │
│  ██  │  Lien secondaire│  │                 │    ██  │
│  ██  │  "ou demandez   │  │                 │    ██  │
│  ██  │   une démo"]    │  │                 │    ██  │
│  ██  │                 │  │                 │    ██  │
│  ██  │  🏆 "300+       │  │                 │    ██  │
│  ██  │   entreprises   │  │                 │    ██  │
│  ██  │   nous font     │  │                 │    ██  │
│  ██  │   confiance"    │  │                 │    ██  │
│  ██  └─────────────────┘  └─────────────────┘    ██  │
│  ██                                               ██  │
│  ████████████████████████████████████████████████████  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BANDEAU LOGOS (Social Proof)                           │
│  [Logo Client 1] [Logo Client 2] [Logo Client 3] ...   │
│  "Ils optimisent déjà leurs tournées"                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CALCULATEUR ROI (Hook interactif)                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  💰 "Calculez vos économies en 30 secondes"     │   │
│  │                                                  │   │
│  │  [Slider] Nombre de véhicules : ___            │   │
│  │  [Slider] Km/jour/vehicule : ___               │   │
│  │  [Slider] Prix du carburant : ___ €/L          │   │
│  │                                                  │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │  💡 ÉCONOMIES ESTIMÉES :                │    │   │
│  │  │                                         │    │   │
│  │  │  🚗 -___ km/jour       💶 -___ €/mois   │    │   │
│  │  │  ⏱️ -___ h/semaine     🌱 -___ kg CO2   │    │   │
│  │  │                                         │    │   │
│  │  │  [CTA "Voir le détail"]                 │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FONCTIONNALITÉS (Grid 3 colonnes)                      │
│                                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐│
│  │  🗺️             │ │  🌤️             │ │  📱         ││
│  │  ITINÉRAIRE     │ │  MÉTÉO TEMPS    │ │  MOBILE     ││
│  │  OPTIMISÉ       │ │  RÉEL           │ │  FIRST      ││
│  │                 │ │                 │ │             ││
│  │  Algorithme     │ │  Intégration    │ │  Application││
│  │  intelligent    │ │  OpenWeatherMap │ │  terrain    ││
│  │  basé sur       │ │  pour anticiper │ │  pour vos   ││
│  │  OpenStreetMap  │ │  les intempéries│ │  équipes    ││
│  │                 │ │                 │ │             ││
│  │  [Capture d'écran│ │  [Widget météo  │ │  [Mockup    ││
│  │   carte]        │ │   temps réel]   │ │   mobile]   ││
│  └─────────────────┘ └─────────────────┘ └─────────────┘│
│                                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐│
│  │  📊             │ │  👥             │ │  🔗         ││
│  │  TABLEAU DE     │ │  MULTI-         │ │  INTÉGRA-   ││
│  │  BORD           │ │  ÉQUIPES        │ │  TIONS      ││
│  │                 │ │                 │ │             ││
│  │  Suivi des      │ │  Gestion de     │ │  Sync       ││
│  │  tournées,      │ │  plusieurs      │ │  Google     ││
│  │  KPIs temps     │ │  équipes et     │ │  Calendar,  ││
│  │  réel           │ │  plannings      │ │  ERP...     ││
│  └─────────────────┘ └─────────────────┘ └─────────────┘│
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DÉMONSTRATION (Section visuelle)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  [CAPTURE D'ÉCRAN APP / VIDÉO DEMO EMBED]      │   │
│  │                                                 │   │
│  │  Interface montrant :                           │   │
│  │  - Carte avec itinéraire optimisé               │   │
│  │  - Liste des clients du jour                    │   │
│  │  - Infos météo sur chaque point                 │   │
│  │  - Temps estimé vs temps réel                   │   │
│  │                                                 │   │
│  │  [Bouton "▶ Voir la démo en action"]           │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TÉMOIGNAGES (Carousel / Grid)                          │
│  "Ils gagnent du temps chaque jour"                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  "Gagné 2h   │  │  "15% de     │  │  "Mon équipe │  │
│  │   par jour"  │  │   carburant  │  │   adore,     │  │
│  │              │  │   en moins"  │  │   simple"    │  │
│  │  — Pierre D. │  │  — Marie L.  │  │  — Jean B.   │  │
│  │  [Photo]     │  │  [Photo]     │  │  [Photo]     │  │
│  │  Paysagiste  │  │  Dirigeante  │  │  Responsable │  │
│  │  12 salariés │  │  PME 25p     │  │  8 salariés  │  │
│  │  ★★★★★       │  │  ★★★★★       │  │  ★★★★★       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  [Logos des entreprises beta-testeurs]                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PRICING / EARLY ACCESS                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  🚀 ACCÈS EARLY ADOPTER                         │   │
│  │                                                 │   │
│  │  ┌─────────────┐    ┌─────────────────────────┐ │   │
│  │  │  GRATUIT    │    │  PRO EARLY              │ │   │
│  │  │             │    │                         │ │   │
│  │  │  • 1 véhicule│   │  • Illimité véhicules   │ │   │
│  │  │  • 10 arrêts│    │  • Illimité arrêts      │ │   │
│  │  │  • Basique  │    │  • Météo avancée        │ │   │
│  │  │             │    │  • Support prioritaire  │ │   │
│  │  │  [CTA       │    │  • API access           │ │   │
│  │  │   secondaire│    │                         │ │   │
│  │  │   "Tester"] │    │  29€/mois               │ │   │
│  │  │             │    │  ━━━━━━━━━━━━━━━━━━━━━  │ │   │
│  │  │             │    │  🔥 OFFRE LANCEMENT :   │ │   │
│  │  │             │    │  -50% premier an        │ │   │
│  │  │             │    │  14,50€/mois            │ │   │
│  │  │             │    │                         │ │   │
│  │  │             │    │  [CTA PRINCIPAL         │ │   │
│  │  │             │    │   "Profiter de l'offre"]│ │   │
│  │  └─────────────┘    └─────────────────────────┘ │   │
│  │                                                 │   │
│  │  ✅ Sans engagement  ✅ 14 jours d'essai       │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FAQ (Accordéon)                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ▶ Comment fonctionne l'optimisation ?          │   │
│  │  ▶ Puis-je importer mes clients existants ?     │   │
│  │  ▶ Quelle précision pour la météo ?             │   │
│  │  ▶ Fonctionne-t-il sans connexion ?             │   │
│  │  ▶ Comment calculez-vous les économies ?        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CTA FINAL (Bandeau contrasté)                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  "Prêt à optimiser vos tournées ?"              │   │
│  │                                                 │   │
│  │  Rejoignez 300+ entreprises qui gagnent du      │   │
│  │  temps chaque jour.                             │   │
│  │                                                 │   │
│  │  [🚀 CTA LARGE "Démarrer ma simulation"]       │   │
│  │                                                 │   │
│  │  ✓ Gratuit et sans engagement                   │   │
│  │  ✓ Configuration en 5 minutes                   │   │
│  │  ✓ Support téléphonique inclus                  │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FOOTER                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [LOGO]                                         │   │
│  │                                                 │   │
│  │  Produit    |    Ressources    |    Entreprise  │   │
│  │  Features   |    Blog         |    À propos     │   │
│  │  Tarifs     |    Guides       |    Contact      │   │
│  │  Démo       |    FAQ          |    Recrutement  │   │
│  │                                                 │   │
│  │  [LinkedIn] [Twitter] [YouTube]                 │   │
│  │                                                 │   │
│  │  © 2025 OptimTournée — Conçu pour les           │   │
│  │  paysagistes 🌳                                 │   │
│  │                                                 │   │
│  │  Mentions légales | CGU | Confidentialité       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📐 Spécifications Techniques

### Grille & Layout
- **Container max-width:** 1200px (desktop), 100% avec padding 16-24px (mobile)
- **Grid système:** 12 colonnes
- **Gouttières:** 24px (desktop), 16px (mobile)
- **Section padding:** 80px vertical (desktop), 48px (mobile)

### Points de Rupture (Breakpoints)
| Breakpoint | Largeur | Usage |
|------------|---------|-------|
| Mobile | < 640px | 1 colonne, empilé |
| Tablet | 640px - 1024px | 2 colonnes |
| Desktop | > 1024px | 3-4 colonnes |

### Hiérarchie Z-index
- Navbar: 1000
- Modales: 1100
- Tooltips: 1200

### Composants Clés à Développer
1. **Hero avec carte interactive** (Lottie ou SVG animé)
2. **Calculateur ROI** (JavaScript interactif)
3. **Carousel témoignages** (swiper ou custom)
4. **FAQ accordéon** (accessible, ARIA)
