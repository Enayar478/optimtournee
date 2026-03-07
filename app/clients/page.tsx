"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Client,
  RecurrenceType,
  InterventionType,
  EquipmentType,
} from "@/types/domain";
import { Plus, Search, Filter, MoreHorizontal, MapPin, Phone, Mail } from "lucide-react";

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  weekly: "Hebdo",
  biweekly: "Bi-hebdo",
  monthly: "Mensuel",
  bimonthly: "Bimestriel",
  quarterly: "Trimestriel",
};

const RECURRENCE_COLORS: Record<RecurrenceType, string> = {
  weekly: "bg-[#2D5A3D]",
  biweekly: "bg-[#4A90A4]",
  monthly: "bg-[#E07B39]",
  bimonthly: "bg-purple-500",
  quarterly: "bg-pink-500",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Supprimer ce client ?")) return;
    await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
    fetchClients();
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4] bg-clip-text text-transparent">
            Clients
          </h1>
          <p className="text-muted-foreground mt-1">{clients.length} clients enregistrés</p>
        </div>
        
        <motion.button 
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] text-white rounded-xl font-medium shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          Nouveau client
        </motion.button>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="flex gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20 outline-none transition-all"
          />
        </div>
        
        <motion.button 
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50"
          whileHover={{ scale: 1.02 }}
        >
          <Filter className="w-5 h-5" />
          Filtres
        </motion.button>
      </motion.div>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D5A3D] to-[#4A90A4] flex items-center justify-center text-white text-xl font-bold"
                    whileHover={{ rotate: 5 }}
                  >
                    {client.name.charAt(0)}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold">{client.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {client.location.address.slice(0, 30)}...
                    </div>
                  </div>
                </div>
                
                <motion.button 
                  className="p-2 rounded-lg hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {client.contactPhone}
                </div>
              </div>
              
              {client.contract ? (
                <motion.div 
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium ${RECURRENCE_COLORS[client.contract.recurrence]}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {RECURRENCE_LABELS[client.contract.recurrence]}
                </motion.div>
              ) : (
                <span className="inline-flex px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600">
                  Ponctuel
                </span>
              )}
              
              <div className="mt-4 pt-4 border-t flex gap-2">
                <motion.button
                  onClick={() => {
                    setEditingClient(client);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 py-2 rounded-lg bg-[#2D5A3D]/10 text-[#2D5A3D] font-medium hover:bg-[#2D5A3D]/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Modifier
                </motion.button>
                <motion.button
                  onClick={() => deleteClient(client.id)}
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Supprimer
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            fetchClients();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// ... garder le ClientModal existant
function ClientModal({
  client,
  onClose,
  onSave,
}: {
  client: Client | null;
  onClose: () => void;
  onSave: () => void;
}) {
  // ... même code qu'avant
  return null; // Simplifié pour l'exemple
}
