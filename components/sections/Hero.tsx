import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { ArrowRight, MapPin, Zap, Clock, Fuel } from "lucide-react";

export function Hero() {
  return (
    <section className="from-forest-surface to-sky-surface/30 relative overflow-hidden bg-gradient-to-br via-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="bg-forest-surface text-forest-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Planifiez vos tournées en 3 minutes
            </div>

            <h1 className="text-foreground text-4xl leading-tight font-bold lg:text-5xl xl:text-6xl">
              Tondez plus, <span className="text-forest">roulez moins</span>
            </h1>

            <p className="text-muted-foreground max-w-xl text-lg leading-relaxed lg:text-xl">
              Vos tournées d&apos;entretien, planifiées sans y penser. Moins
              d&apos;essence, moins de temps perdu, plus de marge en fin de
              mois.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <TrackButton
                event={AnalyticsEvents.CTA_HERO_CLICK}
                variant="primary"
                size="lg"
                className="group"
                href="/sign-up"
              >
                Tester gratuitement
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </TrackButton>

              <TrackButton
                event={AnalyticsEvents.CTA_DEMO_CLICK}
                variant="outline"
                size="lg"
                href="/demo"
              >
                Voir comment ça marche
              </TrackButton>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="text-forest h-4 w-4" />
                Planification en 3 min
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="text-forest h-4 w-4" />
                -20% de carburant
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-forest h-4 w-4" />
                Météo intégrée
              </div>
            </div>
          </div>

          {/* Right Content - App Preview */}
          <div className="relative">
            <div className="border-border relative rounded-2xl border bg-white p-4 shadow-2xl">
              {/* Mock App Interface */}
              <div className="from-forest-surface to-sky-surface/20 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br">
                {/* Header */}
                <div className="bg-forest flex items-center justify-between px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold">OptimTournée</span>
                  </div>
                  <div className="text-sm text-white/80">Semaine du 3 mars</div>
                </div>

                {/* Map Area */}
                <div className="h-full p-4">
                  <div className="grid h-full grid-cols-3 gap-3">
                    {/* Map visualization */}
                    <div className="border-border relative col-span-2 overflow-hidden rounded-lg border bg-white">
                      <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 400 300" className="h-full w-full">
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
                      <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
                        <div className="text-muted-foreground text-xs">
                          Trajet optimisé
                        </div>
                        <div className="text-forest font-mono text-lg font-bold">
                          42 km
                        </div>
                      </div>
                    </div>

                    {/* Stops List */}
                    <div className="space-y-2">
                      {[
                        { name: "Dupont", time: "8h30", status: "done" },
                        { name: "Martin", time: "9h45", status: "current" },
                        { name: "Bernard", time: "11h00", status: "pending" },
                        { name: "Petit", time: "14h00", status: "pending" },
                      ].map((stop, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-2 text-sm ${
                            stop.status === "current"
                              ? "bg-forest text-white"
                              : stop.status === "done"
                                ? "bg-muted text-muted-foreground"
                                : "border-border border bg-white"
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
            <div className="bg-forest/10 absolute -top-4 -right-4 h-24 w-24 rounded-full blur-2xl" />
            <div className="bg-sky/10 absolute -bottom-4 -left-4 h-32 w-32 rounded-full blur-3xl" />

            {/* Floating badge */}
            <div className="bg-economy absolute -right-2 -bottom-2 rounded-lg px-4 py-2 text-white shadow-lg">
              <div className="text-xs font-medium">Économie réelle</div>
              <div className="font-mono text-lg font-bold">-420€/mois</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
