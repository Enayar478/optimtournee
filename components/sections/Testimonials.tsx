"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Avant, je passais mon dimanche soir à planifier la semaine sur Excel. Maintenant j'ai mes tournées en 3 clics. Mes gars ont même plus besoin de m'appeler pour savoir où aller.",
    author: "Franck Morel",
    role: "Chef d'entreprise",
    company: "7 salariés · Amiens",
    rating: 5,
    avatar: "FM",
  },
  {
    quote: "On a récupéré près de 400€ de carburant le premier mois. Quand tu sais que l'entretien c'est 5% de marge, ça change tout. Mes clients hebdo restent hebdo, mais j'optimise le trajet.",
    author: "Lucie Garnier",
    role: "Gérante",
    company: "12 salariés · Lyon",
    rating: 5,
    avatar: "LG",
  },
  {
    quote: "Le truc qui tue, c'est la météo. Une pluie imprévue et c'est tout le planning qui déraille. Là, ça se décale tout seul et mon équipe reçoit la tournée à jour le matin.",
    author: "Marc Delacroix",
    role: "Responsable exploitation",
    company: "9 salariés · Nantes",
    rating: 5,
    avatar: "MD",
  },
];

const trustedBy = [
  "Espaces Verts 62",
  "Jardins Moreau",
  "Vert Service Pro",
  "Nature et Paysage",
  "Green Concept",
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ceux qui en ont marre de perdre du temps sur la route
          </h2>
          <p className="text-xl text-muted-foreground">
            Des paysagistes comme vous qui ont récupéré leurs soirées et leurs marges.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-forest/20" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-economy text-economy" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-forest-surface rounded-full flex items-center justify-center text-forest font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} · {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted By */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Ils utilisent OptimTournée chaque jour
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {trustedBy.map((name, index) => (
              <div
                key={index}
                className="text-lg font-semibold text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
