"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle2, Circle, ArrowRight } from "lucide-react";

const tournees = [
  { id: 1, nom: "Tournée Nord", equipe: "Équipe A", clients: 8, km: 45, heureDebut: "08:00", statut: "active" },
  { id: 2, nom: "Tournée Sud", equipe: "Équipe B", clients: 6, km: 38, heureDebut: "08:30", statut: "planifiee" },
  { id: 3, nom: "Tournée Est", equipe: "Équipe C", clients: 5, km: 32, heureDebut: "09:00", statut: "terminee" },
];

export default function TourneesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Tournées</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-forest text-white rounded-lg font-medium"
          >
            + Nouvelle tournée
          </motion.button>
        </div>

        <div className="grid gap-4">
          {tournees.map((tournee, index) => (
            <motion.div
              key={tournee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    tournee.statut === "active" ? "bg-forest/10 text-forest" :
                    tournee.statut === "terminee" ? "bg-green-100 text-green-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {tournee.statut === "active" ? <Circle className="w-6 h-6 animate-pulse" /> :
                     tournee.statut === "terminee" ? <CheckCircle2 className="w-6 h-6" /> :
                     <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tournee.nom}</h3>
                    <p className="text-muted-foreground">{tournee.equipe} · {tournee.heureDebut}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{tournee.clients}</p>
                    <p className="text-sm text-muted-foreground">clients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{tournee.km} km</p>
                    <p className="text-sm text-muted-foreground">distance</p>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

