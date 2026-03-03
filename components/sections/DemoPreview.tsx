import { RouteOptimizer } from "@/components/map/RouteOptimizer";
import { WeatherOverlay } from "@/components/map/WeatherOverlay";
import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";

export function DemoPreview() {
  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Essayez par vous-même
          </h2>
          <p className="text-xl text-gray-600">
            Testez notre outil d&apos;optimisation en direct. 
            Ajoutez des points sur la carte et voyez l&apos;itinéraire optimal se calculer.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <RouteOptimizer />
        </div>
        
        <div className="text-center mt-8">
          <TrackButton
            event={AnalyticsEvents.SIGNUP_INTENT}
            variant="primary"
            size="lg"
          >
            Commencer gratuitement
          </TrackButton>
        </div>
      </div>
    </section>
  );
}
