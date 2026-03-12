"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Users2,
  MapPin,
  Calendar,
  Settings,
  Menu,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Équipes", href: "/teams", icon: Users2 },
  { name: "Tournées", href: "/tournees", icon: MapPin },
  { name: "Planning", href: "/planning", icon: Calendar },
];

const bottomNav = [{ name: "Paramètres", href: "/settings", icon: Settings }];

function ClerkSignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <motion.button
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/70 transition-all hover:bg-red-500/20 hover:text-red-300"
      whileHover={{ x: 5 }}
    >
      <LogOut className="h-5 w-5" />
      <span className="font-medium">Déconnexion</span>
    </motion.button>
  );
}

function FallbackSignOutButton() {
  return (
    <Link
      href="/"
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/70 transition-all hover:bg-red-500/20 hover:text-red-300"
    >
      <LogOut className="h-5 w-5" />
      <span className="font-medium">Déconnexion</span>
    </Link>
  );
}

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#E8F5EC]/30">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-72 flex-col bg-gradient-to-b from-[#2D5A3D] to-[#1F3D29] text-white shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} transition-transform duration-300 ease-out lg:relative lg:translate-x-0`}
        initial={false}
      >
        {/* Logo */}
        <motion.div
          className="border-b border-white/10 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/dashboard" className="flex items-center gap-3">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Image
                src="/logo.png"
                alt="OptimTournée"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </motion.div>
            <div>
              <span className="text-xl font-bold">OptimTournée</span>
              <p className="text-xs text-white/60">
                Planification intelligente
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Main navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item, index) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
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
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-300 ${
                    isActive
                      ? "bg-white/15 text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#4A90A4]/20 to-transparent"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <motion.div
                    className={`relative rounded-lg p-2 transition-all duration-300 ${isActive ? "bg-[#4A90A4]" : "bg-white/5 group-hover:bg-white/10"}`}
                    whileHover={{ rotate: 5 }}
                  >
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  <span className="relative font-medium">{item.name}</span>

                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative ml-auto"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="space-y-2 border-t border-white/10 p-4">
          {bottomNav.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </motion.div>
          ))}

          {clerkEnabled ? <ClerkSignOutButton /> : <FallbackSignOutButton />}
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        {/* Mobile header */}
        <motion.header
          className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-xl lg:hidden"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <motion.button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 transition-colors hover:bg-gray-100"
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-6 w-6" />
            </motion.button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4]">
                <Image
                  src="/logo.png"
                  alt="OptimTournée"
                  width={28}
                  height={28}
                  className="rounded"
                />
              </div>
            </Link>

            <motion.button
              className="relative rounded-xl p-2 hover:bg-gray-100"
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-6 w-6" />
              <motion.div
                className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-[#E07B39]"
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
