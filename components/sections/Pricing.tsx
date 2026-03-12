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
    href: "mailto:contact@optimtournee.fr",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Tarifs simples et transparents
          </h2>
          <p className="text-muted-foreground text-xl">
            Commencez gratuitement, évoluez selon vos besoins. Sans engagement,
            résiliez à tout moment.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-forest border-forest scale-105 border-2 text-white shadow-xl"
                  : "bg-muted/30 text-foreground border-border hover:border-forest/30 border transition-colors"
              }`}
            >
              {plan.popular && (
                <div className="bg-economy absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-sm font-bold text-white">
                  Le plus populaire
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
                <p
                  className={`text-sm ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                {plan.price !== "Sur mesure" ? (
                  <div className="flex items-baseline">
                    <span className="font-mono text-4xl font-bold">
                      {plan.price}€
                    </span>
                    <span
                      className={`ml-2 ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}
                    >
                      /mois
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{plan.price}</span>
                )}
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check
                      className={`h-5 w-5 ${plan.popular ? "text-economy-light" : "text-forest"}`}
                    />
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
                href={plan.href ?? "/sign-up"}
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
