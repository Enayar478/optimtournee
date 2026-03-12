"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

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
            <h1 className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-3xl font-bold text-transparent">
              Planning
            </h1>
            <p className="text-muted-foreground mt-1">
              Vue hebdomadaire de vos tournées
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-forest rounded-lg px-4 py-2 font-medium text-white"
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
              className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-forest/10 text-forest rounded-xl p-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{jour.jour}</h3>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {jour.equipes} équipes
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {jour.clients} clients
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
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
