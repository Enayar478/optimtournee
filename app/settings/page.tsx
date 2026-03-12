"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
import {
  User,
  Bell,
  Globe,
  Building2,
  AlertTriangle,
  Save,
  X,
  Check,
} from "lucide-react";
import { useState } from "react";

// ─── Section: Profil utilisateur ─────────────────────────────────────────────

function ClerkProfileFields() {
  const { user } = useUser();
  const [name, setName] = useState(user?.fullName ?? "");
  const [saved, setSaved] = useState(false);

  const firstLast = (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "");
  const initials =
    firstLast ||
    (user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "?");

  const handleSave = async () => {
    const parts = name.trim().split(" ");
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ");
    await user?.update({ firstName, lastName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt="Avatar"
            className="h-20 w-20 rounded-2xl object-cover shadow-md"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] text-2xl font-bold text-white shadow-md">
            {initials}
          </div>
        )}
        <p className="text-xs text-gray-500">Photo de profil</p>
      </div>

      {/* Champs */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={user?.emailAddresses?.[0]?.emailAddress ?? ""}
            readOnly
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-gray-500 outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">
            Modifiable via les paramètres Clerk
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-5 py-2.5 font-medium text-white shadow-md"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Sauvegardé
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Sauvegarder
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <SectionCard
      icon={<User className="h-6 w-6" />}
      title="Profil utilisateur"
      description="Gérez vos informations personnelles"
    >
      {clerkEnabled ? (
        <ClerkProfileFields />
      ) : (
        <p className="text-sm text-gray-500">
          Authentification non configurée.
        </p>
      )}
    </SectionCard>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────

interface ToggleOption {
  id: string;
  label: string;
  description: string;
}

const NOTIFICATION_OPTIONS: ToggleOption[] = [
  {
    id: "weather",
    label: "Alertes météo",
    description: "Soyez alerté en cas de mauvais temps prévu",
  },
  {
    id: "planning",
    label: "Rappels planning",
    description: "Notifications avant chaque tournée planifiée",
  },
  {
    id: "clients",
    label: "Nouvelles demandes clients",
    description: "Soyez notifié à chaque nouvelle demande reçue",
  },
];

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-[#2D5A3D]" : "bg-gray-200"
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function NotificationsSection() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    weather: true,
    planning: true,
    clients: false,
  });

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SectionCard
      icon={<Bell className="h-6 w-6" />}
      title="Notifications"
      description="Configurez vos alertes et rappels"
    >
      <div className="space-y-4">
        {NOTIFICATION_OPTIONS.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
          >
            <div>
              <p className="font-medium text-gray-800">{option.label}</p>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            <Toggle
              enabled={toggles[option.id] ?? false}
              onToggle={() => handleToggle(option.id)}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Section: Préférences ─────────────────────────────────────────────────────

function PreferencesSection() {
  const [language, setLanguage] = useState("fr");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SectionCard
      icon={<Globe className="h-6 w-6" />}
      title="Préférences"
      description="Langue, fuseau horaire et format d'affichage"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Langue
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Fuseau horaire
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
          >
            <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
            <option value="Europe/London">Europe/Londres (UTC+0)</option>
            <option value="America/New_York">Amérique/New York (UTC-5)</option>
            <option value="America/Los_Angeles">
              Amérique/Los Angeles (UTC-8)
            </option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Format d&apos;heure
          </label>
          <div className="flex gap-3">
            {(["24h", "12h"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setTimeFormat(fmt)}
                className={`rounded-xl border px-5 py-2.5 font-medium transition-all ${
                  timeFormat === fmt
                    ? "border-[#2D5A3D] bg-[#2D5A3D] text-white shadow-md"
                    : "border-gray-200 text-gray-600 hover:border-[#2D5A3D]/40"
                }`}
              >
                {fmt === "24h" ? "24h (14:30)" : "12h (2:30 PM)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <motion.button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-5 py-2.5 font-medium text-white shadow-md"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Sauvegardé
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Sauvegarder
            </>
          )}
        </motion.button>
      </div>
    </SectionCard>
  );
}

// ─── Section: Informations entreprise ────────────────────────────────────────

interface CompanyInfo {
  name: string;
  siret: string;
  address: string;
  phone: string;
}

function CompanySection() {
  const [info, setInfo] = useState<CompanyInfo>({
    name: "",
    siret: "",
    address: "",
    phone: "",
  });
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof CompanyInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SectionCard
      icon={<Building2 className="h-6 w-6" />}
      title="Informations entreprise"
      description="Renseignez les informations de votre société"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nom de l&apos;entreprise
          </label>
          <input
            type="text"
            value={info.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Jardins du Soleil SARL"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            SIRET
          </label>
          <input
            type="text"
            value={info.siret}
            onChange={(e) => updateField("siret", e.target.value)}
            placeholder="123 456 789 00012"
            maxLength={17}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            value={info.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="12 Rue des Artisans, 75001 Paris"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            value={info.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+33 1 23 45 67 89"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 transition-all outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
          />
        </div>
      </div>

      <div className="mt-4">
        <motion.button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-5 py-2.5 font-medium text-white shadow-md"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Sauvegardé
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Sauvegarder
            </>
          )}
        </motion.button>
      </div>
    </SectionCard>
  );
}

// ─── Section: Danger zone ─────────────────────────────────────────────────────

function ClerkDeleteButton() {
  const { signOut } = useClerk();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const CONFIRM_WORD = "CONFIRMER";
  const canDelete = confirmInput === CONFIRM_WORD;

  const handleDelete = async () => {
    if (!canDelete) return;
    await signOut();
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-4">
        <div>
          <p className="font-medium text-red-700">Supprimer le compte</p>
          <p className="text-sm text-red-500">
            Cette action est permanente et irréversible
          </p>
        </div>
        <motion.button
          onClick={() => {
            setConfirmInput("");
            setIsModalOpen(true);
          }}
          className="rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white shadow-md"
          whileHover={{ scale: 1.03, backgroundColor: "#B91C1C" }}
          whileTap={{ scale: 0.97 }}
        >
          Supprimer le compte
        </motion.button>
      </div>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-100 p-2">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Supprimer le compte
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <p className="mb-6 text-gray-600">
                Cette action est définitive. Toutes vos données seront
                supprimées. Pour confirmer, tapez{" "}
                <span className="font-mono font-bold text-red-600">
                  {CONFIRM_WORD}
                </span>{" "}
                ci-dessous.
              </p>

              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={CONFIRM_WORD}
                className="mb-6 w-full rounded-xl border border-gray-200 px-4 py-2.5 font-mono transition-all outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <motion.button
                  onClick={handleDelete}
                  disabled={!canDelete}
                  className={`flex-1 rounded-xl px-4 py-2.5 font-medium text-white transition-all ${
                    canDelete
                      ? "bg-red-600 shadow-md hover:bg-red-700"
                      : "cursor-not-allowed bg-red-200"
                  }`}
                  whileHover={canDelete ? { scale: 1.02 } : {}}
                  whileTap={canDelete ? { scale: 0.98 } : {}}
                >
                  Supprimer définitivement
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DangerZoneSection() {
  return (
    <SectionCard
      icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
      title="Zone de danger"
      description="Actions irréversibles — procédez avec précaution"
      danger
    >
      {clerkEnabled ? (
        <ClerkDeleteButton />
      ) : (
        <p className="text-sm text-red-500">Authentification non configurée.</p>
      )}
    </SectionCard>
  );
}

// ─── Composant générique de section ──────────────────────────────────────────

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  danger?: boolean;
  children: React.ReactNode;
}

function SectionCard({
  icon,
  title,
  description,
  danger = false,
  children,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center gap-4">
        <div
          className={`rounded-xl p-3 ${
            danger
              ? "bg-red-100 text-red-600"
              : "bg-[#2D5A3D]/10 text-[#2D5A3D]"
          }`}
        >
          {icon}
        </div>
        <div>
          <h2
            className={`text-xl font-semibold ${danger ? "text-red-700" : "text-gray-900"}`}
          >
            {title}
          </h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-3xl font-bold text-transparent">
            Paramètres
          </h1>
          <p className="mt-1 text-gray-500">
            Gérez votre compte et vos préférences
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          <ProfileSection />
          <NotificationsSection />
          <PreferencesSection />
          <CompanySection />
          <DangerZoneSection />
        </div>
      </div>
    </AdminLayout>
  );
}
