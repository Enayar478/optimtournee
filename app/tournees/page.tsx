"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface Tournee {
  id: string;
  nom: string;
  equipe: string;
  clients: number;
  km: number;
  heureDebut: string;
  statut: string;
}

function TourneesContent() {
  const [tournees, setTournees] = useState<Tournee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournees();
  }, []);

  const fetchTournees = async () => {
    try {
      const res = await fetch("/api/tournees");
      const data = await res.json();
      setTournees(data);
    } catch {
      setTournees([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-3xl font-bold text-transparent">
          Tournées
        </h1>
      </div>

      {loading ? (
        <div className="text-muted-foreground flex items-center justify-center py-20">
          Chargement...
        </div>
      ) : tournees.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-lg">
          <p className="text-muted-foreground text-lg">
            Aucune tournée planifiée pour aujourd&apos;hui.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Les tournées apparaissent ici lorsque des interventions sont
            planifiées.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tournees.map((tournee, index) => (
            <motion.div
              key={tournee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-xl p-3 ${
                      tournee.statut === "active"
                        ? "bg-forest/10 text-forest"
                        : tournee.statut === "terminee"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tournee.statut === "active" ? (
                      <Circle className="h-6 w-6 animate-pulse" />
                    ) : tournee.statut === "terminee" ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Clock className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{tournee.nom}</h3>
                    <p className="text-muted-foreground">
                      {tournee.equipe} · {tournee.heureDebut}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{tournee.clients}</p>
                    <p className="text-muted-foreground text-sm">clients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{tournee.km} km</p>
                    <p className="text-muted-foreground text-sm">distance</p>
                  </div>
                  <button className="hover:bg-muted rounded-lg p-2 transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TourneesPage() {
  return (
    <AdminLayout>
      <TourneesContent />
    </AdminLayout>
  );
}
