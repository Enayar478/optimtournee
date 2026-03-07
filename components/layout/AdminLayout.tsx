"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Users, MapPin, Calendar, Settings,
  Menu, X, LogOut, ChevronRight, Bell
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Tournées", href: "/tournees", icon: MapPin },
  { name: "Planning", href: "/planning", icon: Calendar },
];

const bottomNav = [
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#E8F5EC]/30">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-[#2D5A3D] to-[#1F3D29] text-white flex flex-col shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-out lg:relative lg:translate-x-0`}
        initial={false}
      >
        {/* Logo */}
        <motion.div 
          className="p-6 border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/dashboard" className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Image src="/logo.png" alt="OptimTournée" width={32} height={32} className="rounded-lg" />
            </motion.div>
            <div>
              <span className="text-xl font-bold">OptimTournée</span>
              <p className="text-xs text-white/60">Planification intelligente</p>
            </div>
          </Link>
        </motion.div>

        {/* Main navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? "bg-white/15 text-white shadow-lg" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-[#4A90A4]/20 to-transparent rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className={`relative p-2 rounded-lg transition-all duration-300
                      ${isActive ? "bg-[#4A90A4]" : "bg-white/5 group-hover:bg-white/10"}`}
                    whileHover={{ rotate: 5 }}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  <span className="relative font-medium">{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative ml-auto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {bottomNav.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </motion.div>
          ))}
          
          <motion.button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
            whileHover={{ x: 5 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile header */}
        <motion.header 
          className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <motion.button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] flex items-center justify-center">
                <Image src="/logo.png" alt="OptimTournée" width={28} height={28} className="rounded" />
              </div>
            </Link>
            
            <motion.button
              className="p-2 rounded-xl hover:bg-gray-100 relative"
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-6 h-6" />
              <motion.div
                className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E07B39] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </div>
        </motion.header>

        {/* Page content */}
        <motion.main
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
