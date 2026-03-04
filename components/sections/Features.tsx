import { CloudRain, Route, CalendarDays, Smartphone, AlertTriangle, Users } from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Tournées optimisées",
    description: "L'algo calcule le meilleur trajet entre vos clients. Moins de kilomètres, moins d'essence, plus de temps sur les chantiers.",
  },
  {
    icon: CloudRain,
    title: "Météo qui décide à votre place",
    description: "Pluie prévue ? Les entretiens pelouse se décalent automatiquement. Vos équipes reçoivent la tournée mise à jour le matin.",
  },
  {
    icon: CalendarDays,
    title: "Récurrences gérées tout seul",
    description: "Hebdo, bi-hebdo, mensuel… Une fois paramétré, les tournées se génèrent automatiquement. Fini le planning le dimanche soir.",
  },
  {
    icon: Smartphone,
    title: "Sur le terrain, ça juste marche",
    description: "Vos équipes voient leur tournée du jour, cliquent sur l'adresse pour naviguer, cochhent quand c'est fait. Rien de plus.",
  },
  {
    icon: AlertTriangle,
    title: "Urgences qui s'insèrent sans tout casser",
    description: "Un client qui réclame une intervention rapide ? L'algo trouve le meilleur créneau sans décaler toute la semaine.",
  },
  {
    icon: Users,
    title: "Équipes et congés en ligne de mire",
    description: "Qui est dispo cette semaine ? Qui a pris congés ? La planification tient compte de vos effectifs réels.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Moins de temps sur la route,{" "}
            <span className="text-forest">plus de marge en fin de mois</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Les outils qu'il vous manquait pour gérer vos tournées d'entretien 
            sans y passer des heures chaque semaine.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-muted/30 rounded-2xl hover:bg-forest-surface transition-colors duration-300 border border-transparent hover:border-forest/20"
            >
              <div className="w-12 h-12 bg-forest-surface rounded-xl flex items-center justify-center mb-4 group-hover:bg-forest group-hover:text-white transition-colors">
                <feature.icon className="w-6 h-6 text-forest group-hover:text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
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
