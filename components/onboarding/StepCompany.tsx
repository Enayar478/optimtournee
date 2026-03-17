"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import type { CompanyFormData } from "@/lib/validation/onboarding";
import {
  AddressInput,
  EMPTY_ADDRESS,
  type AddressData,
} from "@/components/ui/AddressInput";

interface StepCompanyProps {
  data: CompanyFormData;
  onChange: (data: CompanyFormData) => void;
}

function parseCompanyAddress(address: string): AddressData {
  if (!address) return { ...EMPTY_ADDRESS };
  const parts = address.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    const postcodeMatch = parts[1].match(/^(\d{4,5})\s+(.+)/);
    if (postcodeMatch) {
      return {
        street: parts[0],
        postcode: postcodeMatch[1],
        city: postcodeMatch[2],
        country: parts[2] ?? "France",
        fullAddress: address,
      };
    }
    return {
      street: parts[0],
      city: parts[1],
      postcode: "",
      country: parts[2] ?? "France",
      fullAddress: address,
    };
  }
  return { ...EMPTY_ADDRESS, street: address, fullAddress: address };
}

export function StepCompany({ data, onChange }: StepCompanyProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addressData, setAddressData] = useState<AddressData>(
    parseCompanyAddress(data.companyAddress ?? "")
  );

  const updateField = (field: keyof CompanyFormData, value: string) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleAddressChange = (addr: AddressData) => {
    setAddressData(addr);
    onChange({ ...data, companyAddress: addr.fullAddress });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D5A3D] to-[#3D7A52]">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Mon entreprise</h2>
        <p className="mt-2 text-gray-500">
          Ces informations permettent de personnaliser votre espace.
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nom de l&apos;entreprise *
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
            placeholder="Ex: Jardins du Sud"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>

        <AddressInput
          value={addressData}
          onChange={handleAddressChange}
          label="Adresse (siège / dépôt)"
          placeholder="Rechercher votre adresse..."
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              SIRET / SIREN
            </label>
            <input
              type="text"
              value={data.companySiret ?? ""}
              onChange={(e) => updateField("companySiret", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
              placeholder="9 ou 14 chiffres"
              maxLength={14}
            />
            {errors.companySiret && (
              <p className="mt-1 text-sm text-red-500">{errors.companySiret}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              value={data.companyPhone ?? ""}
              onChange={(e) => updateField("companyPhone", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20"
              placeholder="06 12 34 56 78"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
