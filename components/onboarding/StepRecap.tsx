"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, FileText, Rocket, MapPin } from "lucide-react";
import { INTERVENTION_LABELS, RECURRENCE_LABELS } from "@/lib/validation/onboarding";

interface RecapData {
  companyName: string;
  teams: {
    name: string;
    color: string;
    members: { firstName: string; lastName: string }[];
  }[];
  clients: {
    name: string;
    address: string;
    lat?: number;
    lng?: number;
    contract?: {
      interventionType: string;
      recurrence: string;
      durationMinutes: number;
    };
  }[];
}

interface StepRecapProps {
  data: RecapData;
}

export function StepRecap({ data }: StepRecapProps) {
  const totalMembers = data.teams.reduce((sum, t) => sum + t.members.length, 0);
  const totalContracts = data.clients.filter((c) => c.contract).length;

  const stats = [
    {
      icon: Users,
      label: "Équipes",
      value: data.teams.length,
      sub: `${totalMembers} membre(s)`,
      gradient: "from-[#4A90A4] to-[#6BB3C7]",
    },
    {
      icon: UserPlus,
      label: "Clients",
      value: data.clients.length,
      sub: "enregistré(s)",
      gradient: "from-[#E07B39] to-[#F5A572]",
    },
    {
      icon: FileText,
      label: "Contrats",
      value: totalContracts,
      sub: "récurrent(s)",
      gradient: "from-[#2D5A3D] to-[#3D7A52]",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4]">
          <Rocket className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Tout est prêt{data.companyName ? `, ${data.companyName}` : ""} !
        </h2>
        <p className="mt-2 text-gray-500">
          Voici un récapitulatif de votre configuration.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm"
          >
            <div
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient}`}
            >
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-xs text-gray-400">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Teams detail */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Vos équipes</h3>
        <div className="space-y-2">
          {data.teams.map((team, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3"
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: team.color }}
              />
              <span className="font-medium text-gray-900">{team.name}</span>
              <span className="text-sm text-gray-400">
                {team.members.map((m) => m.firstName).join(", ")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Clients detail */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Vos clients</h3>
        <div className="space-y-2">
          {data.clients.map((client, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3"
            >
              <MapPin className="h-4 w-4 text-[#E07B39]" />
              <div className="flex-1">
                <span className="font-medium text-gray-900">{client.name}</span>
                <span className="ml-2 text-sm text-gray-400">
                  {client.address}
                </span>
              </div>
              {client.contract && (
                <span className="text-xs text-[#2D5A3D]">
                  {INTERVENTION_LABELS[client.contract.interventionType]} &middot;{" "}
                  {RECURRENCE_LABELS[client.contract.recurrence]}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
