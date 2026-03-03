"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Gagné 2h par jour sur mes tournées. Je peux enfin passer plus de temps avec mes clients et moins sur la route.",
    author: "Pierre Dubois",
    role: "Paysagiste",
    company: "12 salariés",
    rating: 5,
    avatar: "PD",
  },
  {
    quote: "15% de carburant en moins dès le premier mois. L'optimisation est vraiment efficace, même avec nos contraintes de chantier.",
    author: "Marie Lefebvre",
    role: "Dirigeante",
    company: "PME 25 personnes",
    rating: 5,
    avatar: "ML",
  },
  {
    quote: "Mon équipe adore, c'est simple et intuitif. Plus besoin de passer des heures à planifier les tournées le dimanche soir.",
    author: "Jean Bernard",
    role: "Responsable exploitation",
    company: "8 salariés",
    rating: 5,
    avatar: "JB",
  },
];

const trustedBy = [
  "Vert&Co",
  "Espaces Verts Pro",
  "Nature Services",
  "Green Garden",
  "Paysage & Cie",
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ils gagnent du temps{" "}
            <span className="text-forest">chaque jour</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Rejoignez plus de 300 entreprises qui optimisent leurs tournées avec OptimTournée.
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
            Ils nous font confiance
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
