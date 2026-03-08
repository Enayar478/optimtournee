import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-green-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Prêt à optimiser vos tournées ?
        </h2>
        
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Rejoignez plus de 500 paysagistes qui gagnent du temps chaque jour. 
          Essai gratuit de 14 jours, sans carte bancaire.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <TrackButton
            event={AnalyticsEvents.SIGNUP_INTENT}
            variant="secondary"
            size="lg"
            href="/sign-up"
          >
            Créer un compte gratuit
            <ArrowRight className="w-5 h-5" />
          </TrackButton>
        </div>
      </div>
    </section>
  );
}
