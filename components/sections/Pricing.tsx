import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Pour les indépendants",
    features: [
      "Jusqu'à 50 clients",
      "Optimisation quotidienne",
      "Application mobile",
      "Support email",
    ],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Pro",
    price: "79",
    description: "Pour les équipes en croissance",
    features: [
      "Jusqu'à 500 clients",
      "Optimisation temps réel",
      "Météo intégrée",
      "Multi-utilisateurs (5)",
      "Support prioritaire",
      "API d'accès",
    ],
    cta: "Essai gratuit 14 jours",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "Sur mesure",
    description: "Pour les grands groupes",
    features: [
      "Clients illimités",
      "Fonctionnalités sur mesure",
      "Intégrations personnalisées",
      "Support dédié",
      "Formation incluse",
    ],
    cta: "Nous contacter",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-xl text-muted-foreground">
            Commencez gratuitement, évoluez selon vos besoins. 
            Sans engagement, résiliez à tout moment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-forest text-white shadow-xl scale-105 border-2 border-forest"
                  : "bg-muted/30 text-foreground border border-border hover:border-forest/30 transition-colors"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-economy text-white text-sm font-bold px-4 py-1 rounded-full">
                  Le plus populaire
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>
              
              <div className="mb-6">
                {plan.price !== "Sur mesure" ? (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold font-mono">{plan.price}€</span>
                    <span className={`ml-2 ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}>
                      /mois
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{plan.price}</span>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? "text-economy-light" : "text-forest"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <TrackButton
                event={AnalyticsEvents.CTA_PRICING_CLICK}
                properties={{ plan: plan.name }}
                variant={plan.popular ? "secondary" : "primary"}
                size="md"
                className="w-full"
                href="/sign-up"
              >
                {plan.cta}
              </TrackButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
