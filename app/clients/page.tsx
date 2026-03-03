"use client";

import { useState, useEffect } from "react";
import { Client, RecurrenceType, InterventionType, EquipmentType } from "@/types/domain";

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  weekly: "Hebdomadaire",
  biweekly: "Bi-hebdomadaire",
  monthly: "Mensuel",
  bimonthly: "Bimestriel",
  quarterly: "Trimestriel",
};

const INTERVENTION_LABELS: Record<InterventionType, string> = {
  mowing: "Tonte",
  hedge_trimming: "Taille de haie",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Maintenance",
  emergency: "Urgence",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <button
            onClick={() => { setEditingClient(null); setIsModalOpen(true); }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            + Nouveau client
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Adresse</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Contrat</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.contactPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.location.address}</td>
                  <td className="px-6 py-4">
                    {client.contract ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {RECURRENCE_LABELS[client.contract.recurrence]}
                      </span>
                    ) : (
                      <span className="text-gray-400">Ponctuel</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setEditingClient(client); setIsModalOpen(true); }}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => setIsModalOpen(false)}
          onSave={() => { fetchClients(); setIsModalOpen(false); }}
        />
      )}
    </div>
  );
}

function ClientModal({ client, onClose, onSave }: {
  client: Client | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: client?.name || "",
    address: client?.location.address || "",
    phone: client?.contactPhone || "",
    email: client?.contactEmail || "",
    notes: client?.notes || "",
    hasContract: !!client?.contract,
    recurrence: client?.contract?.recurrence || "weekly",
    dayOfWeek: client?.contract?.dayOfWeek || 1,
    duration: client?.contract?.durationMinutes || 60,
    interventionType: client?.contract?.interventionType || "mowing",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Appel API save
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto p-6">
        <h2 className="text-xl font-bold mb-4">{client ? "Modifier" : "Nouveau"} client</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Adresse"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          <div className="flex gap-4">
            <input
              type="tel"
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="flex-1 border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="flex-1 border rounded px-3 py-2"
            />
          </div>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.hasContract}
              onChange={(e) => setForm({ ...form, hasContract: e.target.checked })}
            />
            Contrat d'entretien récurrent
          </label>

          {form.hasContract && (
            <div className="space-y-3 p-4 bg-gray-50 rounded">
              <select
                value={form.recurrence}
                onChange={(e) => setForm({ ...form, recurrence: e.target.value as RecurrenceType })}
                className="w-full border rounded px-3 py-2"
              >
                {Object.entries(RECURRENCE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <select
                value={form.interventionType}
                onChange={(e) => setForm({ ...form, interventionType: e.target.value as InterventionType })}
                className="w-full border rounded px-3 py-2"
              >
                {Object.entries(INTERVENTION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 border rounded-lg py-2">Annuler</button>
            <button type="submit" className="flex-1 bg-green-600 text-white rounded-lg py-2">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
