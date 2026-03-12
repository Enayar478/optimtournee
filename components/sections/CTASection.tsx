import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-forest py-20">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
          Prêt à optimiser vos tournées ?
        </h2>

        <p className="text-forest-surface mx-auto mb-8 max-w-2xl text-xl">
          Rejoignez plus de 500 paysagistes qui gagnent du temps chaque jour.
          Essai gratuit de 14 jours, sans carte bancaire.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <TrackButton
            event={AnalyticsEvents.SIGNUP_INTENT}
            variant="secondary"
            size="lg"
            href="/sign-up"
          >
            Créer un compte gratuit
            <ArrowRight className="h-5 w-5" />
          </TrackButton>
        </div>
      </div>
    </section>
  );
}
