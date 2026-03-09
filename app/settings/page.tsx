"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { User, Bell, Shield, CreditCard } from "lucide-react";

const settingsSections = [
  { id: "profile", title: "Profil", icon: User, description: "Gérez vos informations personnelles" },
  { id: "notifications", title: "Notifications", icon: Bell, description: "Configurez vos alertes" },
  { id: "security", title: "Sécurité", icon: Shield, description: "Mot de passe et authentification" },
  { id: "billing", title: "Facturation", icon: CreditCard, description: "Gérez votre abonnement" },
];

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>

        <div className="grid gap-4">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-forest/10 text-forest">
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

