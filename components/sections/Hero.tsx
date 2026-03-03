import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { ArrowRight, MapPin, Zap, Clock, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-surface via-white to-sky-surface/30 py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-forest-surface text-forest-dark px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              Nouveau : Optimisation IA pour paysagistes
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
              Optimisez vos{" "}
              <span className="text-forest">tournées</span>{" "}
              en quelques clics
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Gagnez jusqu'à 2 heures par jour sur vos déplacements. 
              OptimTournée calcule automatiquement le meilleur itinéraire 
              pour vos équipes d'entretien.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackButton
                event={AnalyticsEvents.CTA_HERO_CLICK}
                variant="primary"
                size="lg"
                className="group"
              >
                Essayer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </TrackButton>
              
              <TrackButton
                event={AnalyticsEvents.CTA_DEMO_CLICK}
                variant="outline"
                size="lg"
              >
                Voir la démo
              </TrackButton>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-forest" />
                Mise en place en 5 min
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-forest" />
                Sans carte requise
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-forest" />
                300+ entreprises
              </div>
            </div>
          </div>
          
          {/* Right Content - App Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-4 border border-border">
              {/* Mock App Interface */}
              <div className="aspect-[4/3] bg-gradient-to-br from-forest-surface to-sky-surface/20 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-forest text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">OptimTournée</span>
                  </div>
                  <div className="text-sm text-white/80">Lundi 3 mars</div>
                </div>
                
                {/* Map Area */}
                <div className="p-4 h-full">
                  <div className="grid grid-cols-3 gap-3 h-full">
                    {/* Map visualization */}
                    <div className="col-span-2 bg-white rounded-lg border border-border relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                          <path
                            d="M50,150 Q100,100 150,150 T250,150 T350,100"
                            fill="none"
                            stroke="#2D5A3D"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                          <circle cx="80" cy="130" r="6" fill="#2D5A3D" />
                          <circle cx="180" cy="160" r="6" fill="#4A90A4" />
                          <circle cx="280" cy="140" r="6" fill="#E07B39" />
                          <circle cx="320" cy="90" r="6" fill="#2D5A3D" />
                        </svg>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
                        <div className="text-xs text-muted-foreground">Trajet optimisé</div>
                        <div className="text-lg font-bold text-forest font-mono">42 km</div>
                      </div>
                    </div>
                    
                    {/* Stops List */}
                    <div className="space-y-2">
                      {[
                        { name: "Client A", time: "8h30", status: "done" },
                        { name: "Client B", time: "9h45", status: "current" },
                        { name: "Client C", time: "11h00", status: "pending" },
                        { name: "Client D", time: "14h00", status: "pending" },
                      ].map((stop, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg text-sm ${
                            stop.status === "current"
                              ? "bg-forest text-white"
                              : stop.status === "done"
                              ? "bg-muted text-muted-foreground"
                              : "bg-white border border-border"
                          }`}
                        >
                          <div className="font-medium">{stop.name}</div>
                          <div className="text-xs opacity-80">{stop.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-forest/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-sky/10 rounded-full blur-3xl" />
            
            {/* Floating badge */}
            <div className="absolute -bottom-2 -right-2 bg-economy text-white px-4 py-2 rounded-lg shadow-lg">
              <div className="text-xs font-medium">Économie</div>
              <div className="text-lg font-bold font-mono">-23%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
