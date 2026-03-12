import { RouteOptimizer } from "@/components/map/RouteOptimizer";
import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";

export function DemoPreview() {
  return (
    <section id="demo" className="bg-slate-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Essayez par vous-même
          </h2>
          <p className="text-muted-foreground text-xl">
            Testez notre outil d&apos;optimisation en direct. Ajoutez des points
            sur la carte et voyez l&apos;itinéraire optimal se calculer.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <RouteOptimizer />
        </div>

        <div className="mt-8 text-center">
          <TrackButton
            event={AnalyticsEvents.SIGNUP_INTENT}
            variant="primary"
            size="lg"
            href="/sign-up"
          >
            Commencer gratuitement
          </TrackButton>
        </div>
      </div>
    </section>
  );
}
