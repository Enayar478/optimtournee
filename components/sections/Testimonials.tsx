"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from "next/image";

const testimonials = [
  {
    quote: "Avant, je passais mon dimanche soir à planifier la semaine sur Excel. Maintenant j'ai mes tournées en 3 clics.",
    author: "Franck Morel",
    role: "Chef d'entreprise",
    company: "7 salariés · Amiens",
    avatar: "FM"
  },
  {
    quote: "On a récupéré près de 400€ de carburant le premier mois. Quand tu sais que l'entretien c'est 5% de marge, ça change tout.",
    author: "Lucie Garnier",
    role: "Gérante",
    company: "12 salariés · Lyon",
    avatar: "LG"
  },
  {
    quote: "Le truc qui tue, c'est la météo. Une pluie imprévue et c'est tout le planning qui déraille. Là, ça se décale tout seul.",
    author: "Marc Delacroix",
    role: "Responsable exploitation",
    company: "9 salariés · Nantes",
    avatar: "MD"
  }
];

export function TestimonialsV2() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-20 overflow-hidden bg-muted/30">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/team-working-garden.png"
          alt="Team background"
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/30 to-muted/30" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Ceux qui en ont marre de perdre du temps sur la route
          </h2>
          <p className="text-muted-foreground text-xl">
            Des paysagistes comme vous qui ont récupéré leurs soirées et leurs marges.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="relative rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Quote Icon */}
              <div className="mb-4 text-4xl text-forest/20 font-serif">""</div>
              
              {/* Quote */}
              <blockquote className="text-foreground mb-6 leading-relaxed">
                {testimonial.quote}
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="bg-forest-surface text-forest flex h-12 w-12 items-center justify-center rounded-full font-semibold"
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-foreground font-semibold">{testimonial.author}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role} · {testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
