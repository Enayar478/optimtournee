"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { PlanningView } from "@/components/planning/PlanningView";
import { motion } from "framer-motion";

export default function PlanningPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-3xl font-bold text-transparent">
            Planning
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez et visualisez vos interventions
          </p>
        </motion.div>

        <PlanningView />
      </div>
    </AdminLayout>
  );
}
