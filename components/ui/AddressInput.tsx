"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import {
  searchAddress,
  buildFullAddress,
  type GeoResult,
} from "@/lib/services/geocoding";

export interface AddressData {
  street: string;
  city: string;
  postcode: string;
  country: string;
  fullAddress: string;
  lat?: number;
  lng?: number;
}

interface AddressInputProps {
  value: AddressData;
  onChange: (data: AddressData) => void;
  required?: boolean;
  label?: string;
  placeholder?: string;
  error?: string;
}

const EMPTY_ADDRESS: AddressData = {
  street: "",
  city: "",
  postcode: "",
  country: "France",
  fullAddress: "",
};

export { EMPTY_ADDRESS };

export function AddressInput({
  value,
  onChange,
  required = false,
  label = "Adresse",
  placeholder = "Commencez à taper une adresse...",
  error,
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const results = await searchAddress(query, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 350);
  };

  const selectSuggestion = (result: GeoResult) => {
    const data: AddressData = {
      street: result.street,
      city: result.city,
      postcode: result.postcode,
      country: result.country,
      fullAddress: buildFullAddress(result),
      lat: result.lat,
      lng: result.lng,
    };
    onChange(data);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const updateField = (field: keyof AddressData, val: string) => {
    const updated = { ...value, [field]: val };
    updated.fullAddress = buildFullAddress(updated);
    // Clear lat/lng when manually editing (will be re-geocoded on save)
    onChange({ ...updated, lat: undefined, lng: undefined });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20";

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Search / autocomplete bar */}
      <div>
        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <MapPin className="h-4 w-4 text-[#2D5A3D]" />
          {label} {required && "*"}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            className={inputClass}
            placeholder={placeholder}
          />
          {searching && (
            <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              {suggestions.map((result, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSuggestion(result)}
                  className="flex w-full items-start gap-2 border-b border-gray-50 px-4 py-2.5 text-left text-sm transition-colors last:border-0 hover:bg-[#2D5A3D]/5"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2D5A3D]" />
                  <span className="line-clamp-2 text-gray-700">
                    {result.displayName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Structured fields */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            N° et rue
          </label>
          <input
            type="text"
            value={value.street}
            onChange={(e) => updateField("street", e.target.value)}
            className={inputClass}
            placeholder="12 Rue des Lilas"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Code postal
          </label>
          <input
            type="text"
            value={value.postcode}
            onChange={(e) => updateField("postcode", e.target.value)}
            className={inputClass}
            placeholder="33000"
            maxLength={10}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Ville
          </label>
          <input
            type="text"
            value={value.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={inputClass}
            placeholder="Bordeaux"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Pays
          </label>
          <input
            type="text"
            value={value.country}
            onChange={(e) => updateField("country", e.target.value)}
            className={inputClass}
            placeholder="France"
          />
        </div>
      </div>

      {/* Geocoding indicator */}
      {value.lat && value.lng && (
        <p className="flex items-center gap-1 text-xs text-green-600">
          <MapPin className="h-3 w-3" />
          Coordonnées : {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
