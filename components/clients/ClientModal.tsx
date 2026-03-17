"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { clientSchema, type ClientFormData } from "@/lib/validation/client";
import {
  AddressInput,
  EMPTY_ADDRESS,
  type AddressData,
} from "@/components/ui/AddressInput";
import { geocodeAddress } from "@/lib/services/geocoding";

interface ClientModalProps {
  client: {
    id: string;
    name: string;
    address: string;
    contactPhone?: string;
    contactEmail?: string;
    notes?: string;
    lat?: number;
    lng?: number;
  } | null;
  onClose: () => void;
  onSave: () => void;
}

function parseExistingAddress(address: string): AddressData {
  // Try to parse "street, postcode city, country" format
  const parts = address.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    const street = parts[0];
    const cityPart = parts[1];
    const postcodeMatch = cityPart.match(/^(\d{4,5})\s+(.+)/);
    if (postcodeMatch) {
      return {
        street,
        postcode: postcodeMatch[1],
        city: postcodeMatch[2],
        country: parts[2] ?? "France",
        fullAddress: address,
      };
    }
    return {
      street,
      city: cityPart,
      postcode: "",
      country: parts[2] ?? "France",
      fullAddress: address,
    };
  }
  return { ...EMPTY_ADDRESS, street: address, fullAddress: address };
}

export function ClientModal({ client, onClose, onSave }: ClientModalProps) {
  const [form, setForm] = useState<Omit<ClientFormData, "address"> & { addressData: AddressData }>({
    name: client?.name ?? "",
    addressData: client?.address
      ? { ...parseExistingAddress(client.address), lat: client.lat, lng: client.lng }
      : { ...EMPTY_ADDRESS },
    contactPhone: client?.contactPhone ?? "",
    contactEmail: client?.contactEmail ?? "",
    notes: client?.notes ?? "",
    lat: client?.lat,
    lng: client?.lng,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = form.addressData.fullAddress;
    const formData: ClientFormData = {
      name: form.name,
      address: fullAddress,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail,
      notes: form.notes,
      lat: form.addressData.lat ?? form.lat,
      lng: form.addressData.lng ?? form.lng,
    };

    const result = clientSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      let lat = form.addressData.lat ?? form.lat;
      let lng = form.addressData.lng ?? form.lng;
      if (!lat || !lng) {
        const coords = await geocodeAddress(fullAddress);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      const payload = { ...result.data, lat: lat ?? 0, lng: lng ?? 0 };

      if (client) {
        const res = await fetch("/api/clients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: client.id, ...payload }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Erreur serveur");
        }
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Erreur serveur");
        }
      }
      onSave();
    } catch {
      setErrors({ name: "Erreur lors de la sauvegarde" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {client ? "Modifier le client" : "Nouveau client"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                placeholder="Ex: M. Dupont"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <AddressInput
              value={form.addressData}
              onChange={(addr) =>
                setForm((prev) => ({ ...prev, addressData: addr }))
              }
              required
              error={errors.address}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                  placeholder="client@email.com"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactEmail}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
                placeholder="Informations complémentaires..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-4 py-3 font-medium text-white disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {client ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
