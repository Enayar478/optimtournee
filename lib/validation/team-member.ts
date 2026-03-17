import { z } from "zod";

const VALID_LICENSE_TYPES = [
  "permis_b",
  "permis_be",
  "permis_c",
  "permis_ce",
  "caces_1",
  "caces_3",
  "caces_9",
  "sst",
  "habilitation_elec",
] as const;

export const LICENSE_LABELS: Record<string, string> = {
  permis_b: "Permis B",
  permis_be: "Permis BE",
  permis_c: "Permis C",
  permis_ce: "Permis CE",
  caces_1: "CACES 1",
  caces_3: "CACES 3",
  caces_9: "CACES 9",
  sst: "SST",
  habilitation_elec: "Habilitation élec.",
};

export const MEMBER_SKILL_LABELS: Record<string, string> = {
  mowing: "Tonte",
  hedge_trimming: "Taille haie",
  pruning: "Élagage",
  weeding: "Désherbage",
  planting: "Plantation",
  maintenance: "Entretien",
  emergency: "Urgence",
};

export const teamMemberFullSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  emergencyContact: z.string().optional().or(z.literal("")),
  licenseTypes: z.array(z.enum(VALID_LICENSE_TYPES)).default([]),
  skills: z
    .array(
      z.enum([
        "mowing",
        "hedge_trimming",
        "pruning",
        "weeding",
        "planting",
        "maintenance",
        "emergency",
      ])
    )
    .default([]),
  unavailableDates: z
    .array(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]+)?$/, "Format de date invalide")
    )
    .default([]),
  notes: z.string().optional().or(z.literal("")),
});

export type TeamMemberFullFormData = z.infer<typeof teamMemberFullSchema>;
