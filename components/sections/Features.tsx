import {
  CloudRain,
  Route,
  CalendarDays,
  Smartphone,
  AlertTriangle,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Tournées optimisées",
    description:
      "L'algo calcule le meilleur trajet entre vos clients. Moins de kilomètres, moins d'essence, plus de temps sur les chantiers.",
  },
  {
    icon: CloudRain,
    title: "Météo qui décide à votre place",
    description:
      "Pluie prévue ? Les entretiens pelouse se décalent automatiquement. Vos équipes reçoivent la tournée mise à jour le matin.",
  },
  {
    icon: CalendarDays,
    title: "Récurrences gérées tout seul",
    description:
      "Hebdo, bi-hebdo, mensuel… Une fois paramétré, les tournées se génèrent automatiquement. Fini le planning le dimanche soir.",
  },
  {
    icon: Smartphone,
    title: "Sur le terrain, ça juste marche",
    description:
      "Vos équipes voient leur tournée du jour, cliquent sur l'adresse pour naviguer, cochhent quand c'est fait. Rien de plus.",
  },
  {
    icon: AlertTriangle,
    title: "Urgences qui s'insèrent sans tout casser",
    description:
      "Un client qui réclame une intervention rapide ? L'algo trouve le meilleur créneau sans décaler toute la semaine.",
  },
  {
    icon: Users,
    title: "Équipes et congés en ligne de mire",
    description:
      "Qui est dispo cette semaine ? Qui a pris congés ? La planification tient compte de vos effectifs réels.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Moins de temps sur la route,{" "}
            <span className="text-forest">plus de marge en fin de mois</span>
          </h2>
          <p className="text-muted-foreground text-xl">
            Les outils qu&apos;il vous manquait pour gérer vos tournées
            d&apos;entretien sans y passer des heures chaque semaine.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-muted/30 hover:bg-forest-surface hover:border-forest/20 rounded-2xl border border-transparent p-6 transition-colors duration-300"
            >
              <div className="bg-forest-surface group-hover:bg-forest mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                <feature.icon className="text-forest h-6 w-6 group-hover:text-white" />
              </div>

              <h3 className="text-foreground mb-2 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
