"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const planningData = [
  { jour: "Lundi", equipes: 3, clients: 24, km: 142 },
  { jour: "Mardi", equipes: 3, clients: 26, km: 158 },
  { jour: "Mercredi", equipes: 2, clients: 18, km: 95 },
  { jour: "Jeudi", equipes: 3, clients: 25, km: 165 },
  { jour: "Vendredi", equipes: 3, clients: 22, km: 138 },
];

export default function PlanningPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-transparent">
              Planning
            </h1>
            <p className="text-muted-foreground mt-1">Vue hebdomadaire de vos tournées</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-forest text-white rounded-lg font-medium"
          >
            + Nouveau planning
          </motion.button>
        </motion.div>

        <div className="grid gap-4">
          {planningData.map((jour, index) => (
            <motion.div
              key={jour.jour}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-forest/10 text-forest">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{jour.jour}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {jour.equipes} équipes
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {jour.clients} clients
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {jour.km} km
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
