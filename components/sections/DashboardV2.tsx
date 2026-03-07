"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Clock, DollarSign, MapPin, 
  Sun, CloudRain, Wind, Calendar, ArrowUpRight,
  CheckCircle2, Circle, Clock4, Users
} from "lucide-react";
import Link from "next/link";

const stats = [
  { name: "Km parcourus", value: "42", unit: "km", change: "-12%", icon: MapPin, gradient: "from-[#2D5A3D] to-[#3D7A52]" },
  { name: "Temps gagné", value: "3h", unit: "15min", change: "+8%", icon: Clock, gradient: "from-[#4A90A4] to-[#6BB3C7]" },
  { name: "Économies", value: "-127", unit: "€", change: "+15%", icon: DollarSign, gradient: "from-[#E07B39] to-[#F5A572]" },
];

const todayStops = [
  { time: "08:30", client: "Dupont", address: "12 Rue des Lilas", status: "completed", color: "#22C55E" },
  { time: "09:45", client: "Martin", address: "45 Avenue Victor Hugo", status: "in-progress", color: "#2D5A3D" },
  { time: "11:00", client: "Bernard", address: "8 Rue de la Paix", status: "pending", color: "#94A3B8" },
  { time: "14:00", client: "Petit", address: "23 Boulevard Haussmann", status: "pending", color: "#94A3B8" },
];

export function DashboardV2() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Bonjour, Thomas ! 👋
          </motion.h1>
          <p className="text-muted-foreground mt-2 text-lg">Voici ce qui vous attend aujourd'hui</p>
        </div>
        
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-gray-100"
          whileHover={{ scale: 1.05 }}
        >
          <Calendar className="w-5 h-5 text-[#2D5A3D]" />
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.unit}</span>
                </div>
              </div>
              
              <motion.div 
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              <span className="text-xs text-muted-foreground">vs hier</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Route */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2D5A3D]" />
              Tournée du jour
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/tournees" 
                className="text-sm text-[#2D5A3D] hover:text-[#1F3D29] flex items-center gap-1 font-medium"
              >
                Voir sur la carte
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
          
          <div className="space-y-4">
            {todayStops.map((stop, index) => (
              <motion.div
                key={stop.client}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 8, backgroundColor: "#F8FAFC" }}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center w-16">
                  <span className="text-sm font-semibold text-gray-700">{stop.time}</span>
                  <motion.div 
                    className="mt-2"
                    animate={stop.status === 'in-progress' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stop.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {stop.status === 'in-progress' && <Circle className="w-6 h-6 text-[#2D5A3D] fill-[#2D5A3D]/20" />}
                    {stop.status === 'pending' && <Clock4 className="w-6 h-6 text-gray-400" />}
                  </motion.div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{stop.client}</h3>
                  <p className="text-sm text-muted-foreground">{stop.address}</p>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${stop.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    stop.status === 'in-progress' ? 'bg-[#2D5A3D]/10 text-[#2D5A3D]' : 
                    'bg-gray-100 text-gray-500'}`
                >
                  {stop.status === 'completed' ? 'Terminé' : 
                   stop.status === 'in-progress' ? 'En cours' : 'À venir'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Side Widgets */}
        <div className="space-y-6">
          {/* Weather */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-[#4A90A4]/10 via-[#E8F4F7] to-white border border-[#4A90A4]/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paris</p>
                <motion.div 
                  className="flex items-baseline gap-2 mt-1"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  <span className="text-5xl font-bold text-gray-900">18°</span>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sun className="w-10 h-10 text-[#E07B39]" />
                  </motion.div>
                </motion.div>
                <p className="text-sm text-muted-foreground mt-2">Pas de pluie prévue</p>
              </div>
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-[#2D5A3D] to-[#1F3D29] p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Équipe du jour</h3>
            </div>
            
            <div className="space-y-3">
              {['Paul M.', 'Jean D.', 'Marie L.'].map((name, i) => (
                <motion.div 
                  key={name}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A90A4] to-[#2D5A3D] flex items-center justify-center text-xs font-bold">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm">{name}</span>
                  <motion.div 
                    className="ml-auto w-2 h-2 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
