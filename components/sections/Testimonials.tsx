"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Avant, je passais mon dimanche soir à planifier la semaine sur Excel. Maintenant j'ai mes tournées en 3 clics. Mes gars ont même plus besoin de m'appeler pour savoir où aller.",
    author: "Franck Morel",
    role: "Chef d'entreprise",
    company: "7 salariés · Amiens",
    rating: 5,
    avatar: "FM",
  },
  {
    quote:
      "On a récupéré près de 400€ de carburant le premier mois. Quand tu sais que l'entretien c'est 5% de marge, ça change tout. Mes clients hebdo restent hebdo, mais j'optimise le trajet.",
    author: "Lucie Garnier",
    role: "Gérante",
    company: "12 salariés · Lyon",
    rating: 5,
    avatar: "LG",
  },
  {
    quote:
      "Le truc qui tue, c'est la météo. Une pluie imprévue et c'est tout le planning qui déraille. Là, ça se décale tout seul et mon équipe reçoit la tournée à jour le matin.",
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
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Ceux qui en ont marre de perdre du temps sur la route
          </h2>
          <p className="text-muted-foreground text-xl">
            Des paysagistes comme vous qui ont récupéré leurs soirées et leurs
            marges.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="border-border rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="text-forest/20 h-8 w-8" />
              </div>

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="fill-economy text-economy h-4 w-4" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="bg-forest-surface text-forest flex h-12 w-12 items-center justify-center rounded-full font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-foreground font-semibold">
                    {testimonial.author}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {testimonial.role} · {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted By */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-sm">
            Ils utilisent OptimTournée chaque jour
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {trustedBy.map((name, index) => (
              <div
                key={index}
                className="text-muted-foreground text-lg font-semibold"
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
