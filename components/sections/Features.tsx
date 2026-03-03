import { MapPin, Route, Cloud, Clock, Smartphone, Shield } from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Optimisation intelligente",
    description: "Notre algorithme calcule l'itinéraire le plus court en tenant compte du trafic en temps réel.",
  },
  {
    icon: Cloud,
    title: "Météo intégrée",
    description: "Visualisez les conditions météo pour chaque chantier et anticipez les imprévus.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Réduisez vos kilomètres parcourus de 20 à 30% et gagnez jusqu'à 2h par jour.",
  },
  {
    icon: Smartphone,
    title: "Application mobile",
    description: "Accédez à vos tournées sur le terrain avec notre app iOS et Android.",
  },
  {
    icon: MapPin,
    title: "Géolocalisation",
    description: "Suivez vos équipes en temps réel et adaptez les plannings à la volée.",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description: "Vos données client sont chiffrées et hébergées en France.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Tout ce qu'il faut pour{" "}
            <span className="text-forest">optimiser vos déplacements</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Une solution complète pensée pour les entreprises du paysagisme, 
            de l'entretien d'espaces verts et des services à domicile.
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
