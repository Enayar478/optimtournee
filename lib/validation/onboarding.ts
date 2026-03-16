import { z } from "zod";

export const companySchema = z.object({
  companyName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(255),
  companyAddress: z.string().max(500).optional().or(z.literal("")),
  companySiret: z
    .string()
    .regex(
      /^\d{9}(\d{5})?$/,
      "Entrez un SIREN (9 chiffres) ou SIRET (14 chiffres)"
    )
    .optional()
    .or(z.literal("")),
  companyPhone: z.string().max(20).optional().or(z.literal("")),
});

export type CompanyFormData = z.infer<typeof companySchema>;

export const contractSchema = z.object({
  interventionType: z.enum([
    "mowing",
    "hedge_trimming",
    "pruning",
    "weeding",
    "planting",
    "maintenance",
    "emergency",
  ]),
  durationMinutes: z.number().min(15, "Durée minimum 15 minutes"),
  dayOfWeek: z.number().min(0).max(6),
  recurrence: z.enum([
    "weekly",
    "biweekly",
    "monthly",
    "bimonthly",
    "quarterly",
  ]),
  requiredEquipment: z
    .array(
      z.enum([
        "lawn_tractor",
        "push_mower",
        "hedge_trimmer",
        "chainsaw",
        "blower",
        "trailer",
        "utility_vehicle",
      ])
    )
    .default([]),
  priority: z.number().min(1).max(5).default(1),
  maxWindSpeed: z.number().min(0).max(200).default(50),
  noRainForecast: z.boolean().default(false),
  minTemperature: z.number().default(-5),
  maxTemperature: z.number().default(40),
});

export type ContractFormData = z.infer<typeof contractSchema>;

export const INTERVENTION_LABELS: Record<string, string> = {
  mowing: "Tonte",
  hedge_trimming: "Taille de haie",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Entretien général",
  emergency: "Urgence",
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  lawn_tractor: "Tondeuse autoportée",
  push_mower: "Tondeuse poussée",
  hedge_trimmer: "Taille-haie",
  chainsaw: "Tronçonneuse",
  blower: "Souffleur",
  trailer: "Remorque",
  utility_vehicle: "Utilitaire",
};

export const RECURRENCE_LABELS: Record<string, string> = {
  weekly: "Hebdomadaire",
  biweekly: "Bi-hebdomadaire",
  monthly: "Mensuel",
  bimonthly: "Bimestriel",
  quarterly: "Trimestriel",
};

export const DAY_LABELS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export const SKILL_LABELS: Record<string, string> = {
  mowing: "Tonte",
  hedge_trimming: "Taille haie",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Entretien",
  emergency: "Urgence",
};
